
const { spawn, execFile } = require("child_process");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const appsFile = path.join(__dirname, "../../data/apps.json");
const iconsDir = path.join(__dirname, "../../public/app-icons");
const { enqueueLaunch } = require("../utils/agentQueur");

function readApps() {
  return JSON.parse(fs.readFileSync(appsFile, "utf8"));
}

function saveApps(apps) {
  fs.mkdirSync(path.dirname(appsFile), { recursive: true });
  fs.writeFileSync(appsFile, JSON.stringify(apps, null, 2));
}

function extractAppIcon(executablePath, iconFileName) {
  return new Promise((resolve) => {
    if (process.platform !== "win32") {
      return resolve(false);
    }

    const outputPath = path.join(iconsDir, iconFileName);
    fs.mkdirSync(iconsDir, { recursive: true });

    const script = `
      Add-Type -AssemblyName System.Drawing
      $exe = $env:DESKPILOT_EXE
      $out = $env:DESKPILOT_ICON_OUT
      $icon = [System.Drawing.Icon]::ExtractAssociatedIcon($exe)

      if ($null -eq $icon) {
        throw "Icon not found"
      }

      $bitmap = $icon.ToBitmap()
      try {
        $bitmap.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
      }
      finally {
        $bitmap.Dispose()
        $icon.Dispose()
      }
    `;

    execFile(
      "powershell.exe",
      ["-NoProfile", "-NonInteractive", "-Command", script],
      {
        windowsHide: true,
        timeout: 15000,
        env: {
          ...process.env,
          DESKPILOT_EXE: executablePath,
          DESKPILOT_ICON_OUT: outputPath,
        },
      },
      (error, stdout, stderr) => {
        if (error) {
          console.error("Icon extraction error:", error.message);
        }
        if (stderr) console.error("Icon extraction stderr:", stderr);

        resolve(!error && fs.existsSync(outputPath));
      }
    );
  });
}

function getApps(req, res) {
  try {
    return res.json({ success: true, apps: readApps() });
  } catch (error) {
    console.error("Get apps error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not read applications",
    });
  }
}

async function addApp(req, res) {
  try {
    const { name, executablePath } = req.body || {};

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof executablePath !== "string" ||
      !path.win32.isAbsolute(executablePath) ||
      path.win32.extname(executablePath).toLowerCase() !== ".exe"
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid app name and absolute Windows executable path are required",
      });
    }

    const normalizedPath = path.win32.normalize(executablePath);
    const apps = readApps();

    const app = {
      id: crypto.randomUUID(),
      name: name.trim(),
      executablePath: normalizedPath,
      iconUrl: null,
    };

    const iconFileName = `${app.id}.png`;
    const extracted = await extractAppIcon(normalizedPath, iconFileName);

    if (extracted) {
      app.iconUrl = `${req.protocol}://${req.get("host")}/app-icons/${iconFileName}`;
    }

    apps.push(app);
    saveApps(apps);

    return res.status(201).json({
      success: true,
      message: "Application saved",
      app,
    });
  } catch (error) {
    console.error("Add app error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not save application",
    });
  }
}

// function launchApp(req, res) {
//   try {
//     const apps = readApps();
//     const app = apps.find((item) => item.id === req.params.id);

//     if (!app) {
//       return res.status(404).json({
//         success: false,
//         message: "Application not found",
//       });
//     }

//     // This endpoint can launch apps only on the machine running this process.
//     // A Render-hosted process cannot launch an executable on your Windows laptop.
//     if (process.platform !== "win32") {
//       return res.status(501).json({
//         success: false,
//         message: "Remote launch requires a Windows DeskPilot agent on your laptop",
//       });
//     }

//     if (
//       typeof app.executablePath !== "string" ||
//       !path.win32.isAbsolute(app.executablePath) ||
//       path.win32.extname(app.executablePath).toLowerCase() !== ".exe" ||
//       !fs.existsSync(app.executablePath)
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Configured executable is invalid or missing on this machine",
//       });
//     }

//     const child = spawn(app.executablePath, [], {
//       shell: false,
//       detached: true,
//       stdio: "ignore",
//       windowsHide: false,
//     });

//     child.once("error", (error) => {
//       console.error("Launch error:", error.message);

//       if (!res.headersSent) {
//         res.status(500).json({
//           success: false,
//           message: "Could not launch application",
//         });
//       }
//     });

//     child.once("spawn", () => {
//       if (!res.headersSent) {
//         res.status(200).json({
//           success: true,
//           message: `${app.name} launch requested`,
//           app: { id: app.id, name: app.name },
//         });
//       }

//       child.unref();
//     });
//   } catch (error) {
//     console.error("Launch error:", error.message);

//     if (!res.headersSent) {
//       return res.status(500).json({
//         success: false,
//         message: "Application launch failed",
//       });
//     }
//   }
// }



function launchApp(req, res) {
  try {
    const apps = readApps();
    const app = apps.find((item) => item.id === req.params.id);

    if (!app) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Render/Linux: queue command for the Windows Agent.
    if (process.platform !== "win32") {
      const command = enqueueLaunch(app);

      return res.status(202).json({
        success: true,
        message: `${app.name} launch command queued`,
        commandId: command.id,
        status: command.status,
        app: {
          id: app.id,
          name: app.name,
        },
      });
    }

    // Local Windows backend: launch directly.
    if (
      typeof app.executablePath !== "string" ||
      !path.win32.isAbsolute(app.executablePath) ||
      path.win32.extname(app.executablePath).toLowerCase() !== ".exe" ||
      !fs.existsSync(app.executablePath)
    ) {
      return res.status(400).json({
        success: false,
        message: "Configured executable is invalid or missing",
      });
    }

    const child = spawn(app.executablePath, [], {
      shell: false,
      detached: true,
      stdio: "ignore",
      windowsHide: false,
    });

    child.once("error", (error) => {
      console.error("Launch error:", error.message);
    });

    child.once("spawn", () => {
      child.unref();
    });

    return res.status(202).json({
      success: true,
      message: `${app.name} launch requested`,
      app: {
        id: app.id,
        name: app.name,
      },
    });
  } catch (error) {
    console.error("Launch error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Application launch failed",
    });
  }
}


function deleteApp(req, res) {
  try {
    const apps = readApps();
    const appIndex = apps.findIndex(
      (item) => item.id === req.params.id
    );

    if (appIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const deletedApp = apps[appIndex];
    apps.splice(appIndex, 1);
    saveApps(apps);

    if (deletedApp.iconUrl) {
      try {
        const iconFileName = path.basename(
          new URL(deletedApp.iconUrl).pathname
        );

        if (/^[a-f0-9-]+\.png$/i.test(iconFileName)) {
          const iconPath = path.join(iconsDir, iconFileName);

          if (fs.existsSync(iconPath)) {
            fs.unlinkSync(iconPath);
          }
        }
      } catch (iconError) {
        console.error("Icon cleanup error:", iconError.message);
      }
    }

    return res.json({
      success: true,
      message: "Application deleted successfully",
      app: { id: deletedApp.id, name: deletedApp.name },
    });
  } catch (error) {
    console.error("Delete error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not delete application",
    });
  }
}

module.exports = { getApps, addApp, launchApp, deleteApp };

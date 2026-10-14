
const { spawn, execFile } = require("child_process");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const appsFile = path.join(__dirname, "../../data/apps.json");
const iconsDir = path.join(__dirname, "../../public/app-icons");

function readApps() {
  return JSON.parse(fs.readFileSync(appsFile, "utf8"));
}

function saveApps(apps) {
  fs.writeFileSync(appsFile, JSON.stringify(apps, null, 2));
}

function extractAppIcon(executablePath, iconFileName) {
  return new Promise((resolve) => {
    if (process.platform !== "win32") {
      return resolve(false);
    }

    const outputPath = path.join(iconsDir, iconFileName);

    console.log("Extracting icon:", executablePath);
    console.log("Icon output:", outputPath);

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
        console.log("PowerShell error:", error?.message || "No error");
        if (stderr) console.log("PowerShell stderr:", stderr);

        const exists = fs.existsSync(outputPath);
        console.log("PNG exists:", exists);

        if (error || !exists) {
          return resolve(false);
        }

        console.log("Icon saved:", outputPath);
        resolve(true);
      }
    );
  });
}




function getApps(req, res) {
  res.json({ success: true, apps: readApps() });
}

async function addApp(req, res) {
  try {
    const { name, executablePath } = req.body;

    if (
      typeof name !== "string" ||
      typeof executablePath !== "string" ||
      !name.trim() ||
      !path.isAbsolute(executablePath)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid app name and absolute executable path are required",
      });
    }

    const normalizedPath = path.normalize(executablePath);

    if (
      path.extname(normalizedPath).toLowerCase() !== ".exe" ||
      !fs.existsSync(normalizedPath)
    ) {
      return res.status(400).json({
        success: false,
        message: "Executable .exe file does not exist",
      });
    }

    const apps = readApps();

    const app = {
      id: crypto.randomUUID(),
      name: name.trim(),
      executablePath: normalizedPath,
      iconUrl: null,
    };

    const iconFileName = `${app.id}.png`;
    const extracted = await extractAppIcon(
      normalizedPath,
      iconFileName
    );

    if (extracted) {
      // Uses the host/IP from the mobile API request.
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

    if (
      typeof app.executablePath !== "string" ||
      !path.isAbsolute(app.executablePath) ||
      path.extname(app.executablePath).toLowerCase() !== ".exe" ||
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

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Could not launch application",
        });
      }
    });

    child.once("spawn", () => {
      if (!res.headersSent) {
        res.status(200).json({
          success: true,
          message: `${app.name} launch requested`,
          app: { id: app.id, name: app.name },
        });
      }

      child.unref();
    });
  } catch (error) {
    console.error("Launch error:", error.message);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Application launch failed",
      });
    }
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

    // Remove the associated icon when the app is deleted.
    if (deletedApp.iconUrl) {
      const iconFileName = path.basename(
        new URL(deletedApp.iconUrl).pathname
      );

      if (/^[a-f0-9-]+\.png$/i.test(iconFileName)) {
        const iconPath = path.join(iconsDir, iconFileName);

        if (fs.existsSync(iconPath)) {
          fs.unlinkSync(iconPath);
        }
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

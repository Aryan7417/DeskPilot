const { spawn } = require("child_process");


const fs = require("fs");
const path = require("path");
const crypto = require("crypto");


const appsFile = path.join(__dirname, "../../data/apps.json");

function readApps() {
  return JSON.parse(fs.readFileSync(appsFile, "utf8"));
}

function saveApps(apps) {
  fs.writeFileSync(appsFile, JSON.stringify(apps, null, 2));
}

function getApps(req, res) {
  res.json({ success: true, apps: readApps() });
}


function addApp(req, res) {
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
  const apps = readApps();

  const app = {
    id: crypto.randomUUID(),
    name: name.trim(),
    executablePath: path.normalize(executablePath),
  };


  apps.push(app);
  saveApps(apps);

  res.status(201).json({
    success: true,
    message: "Application saved",
    app,
  });
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

    console.log("Launching app:", app.name);
    console.log("Executable:", app.executablePath);

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
      console.log("Process started. PID:", child.pid);

      if (!res.headersSent) {
        res.status(200).json({
          success: true,
          message: `${app.name} launch requested`,
          app: {
            id: app.id,
            name: app.name,
          },
        });
      }

      child.unref();
    });

    child.once("exit", (code, signal) => {
      console.log("Process exited:", { code, signal });
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


      return res.json({
      success: true,
      message: "Application deleted successfully",
      app: {
        id: deletedApp.id,
        name: deletedApp.name,
      },
    });
    } catch (error) {
    console.error("Delete error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not delete application",
    });
  }
}

module.exports = { getApps, addApp, launchApp,deleteApp };
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

module.exports = { getApps, addApp };


require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const SERVER_URL = (process.env.DESKPILOT_SERVER_URL || "").replace(/\/+$/, "");
const AGENT_TOKEN = process.env.DESKPILOT_AGENT_TOKEN;
const POLL_INTERVAL = 3000;

if (!SERVER_URL || !AGENT_TOKEN) {
  console.error("Missing server URL or agent token in .env");
  process.exit(1);
}

if (process.platform !== "win32") {
  console.error("DeskPilot Agent must run on Windows.");
  process.exit(1);
}

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${SERVER_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${AGENT_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
    signal: AbortSignal.timeout(15000),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${data.message || "Request failed"}`);
  }

  return data;
}

// Resolve only known, trusted applications on this Windows laptop.
// Cloud-provided executable paths are deliberately not executed directly.
function findLocalExecutable(app) {
  const roots = [
    process.env.ProgramFiles,
    process.env["ProgramFiles(x86)"],
    process.env.LOCALAPPDATA,
    process.env.WINDIR,
  ].filter(Boolean);

  const knownApps = {
    vlc: [
      path.join(roots[0] || "C:\\Program Files", "VideoLAN", "VLC", "vlc.exe"),
      path.join(roots[1] || "C:\\Program Files (x86)", "VideoLAN", "VLC", "vlc.exe"),
    ],
    "vs code": [
      path.join(process.env.LOCALAPPDATA || "", "Programs", "Microsoft VS Code", "Code.exe"),
      path.join(roots[0] || "C:\\Program Files", "Microsoft VS Code", "Code.exe"),
    ],
    "visual studio code": [
      path.join(process.env.LOCALAPPDATA || "", "Programs", "Microsoft VS Code", "Code.exe"),
      path.join(roots[0] || "C:\\Program Files", "Microsoft VS Code", "Code.exe"),
    ],
    edge: [
      path.join(roots[1] || "C:\\Program Files (x86)", "Microsoft", "Edge", "Application", "msedge.exe"),
      path.join(roots[0] || "C:\\Program Files", "Microsoft", "Edge", "Application", "msedge.exe"),
    ],
    "microsoft edge": [
      path.join(roots[1] || "C:\\Program Files (x86)", "Microsoft", "Edge", "Application", "msedge.exe"),
      path.join(roots[0] || "C:\\Program Files", "Microsoft", "Edge", "Application", "msedge.exe"),
    ],
    brave: [
      path.join(roots[0] || "C:\\Program Files", "BraveSoftware", "Brave-Browser", "Application", "brave.exe"),
    ],
    notepad: [
      path.join(process.env.WINDIR || "C:\\Windows", "System32", "notepad.exe"),
    ],
  };

  const candidates = knownApps[String(app.name || "").trim().toLowerCase()];

  if (!candidates) {
    throw new Error(
      `Automatic path detection is not configured for "${app.name}". Configure its local executable first.`
    );
  }

  const executable = candidates.find((candidate) => fs.existsSync(candidate));

  if (!executable) {
    throw new Error(`${app.name} was not found in its standard installation paths.`);
  }

  return executable;
}

function launchApplication(executable) {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, [], {
      shell: false,
      detached: true,
      stdio: "ignore",
      windowsHide: false,
    });

    child.once("error", reject);

    child.once("spawn", () => {
      child.unref();
      resolve();
    });
  });
}

async function reportResult(commandId, success, message) {
  return apiRequest(
    `/api/agent/commands/${encodeURIComponent(commandId)}/result`,
    {
      method: "POST",
      body: JSON.stringify({ success, message }),
    }
  );
}

async function processCommand(command) {
  if (
    !command ||
    typeof command.id !== "string" ||
    command.type !== "launch" ||
    !command.app ||
    typeof command.app.id !== "string"
  ) {
    console.error("Received an invalid command.");
    return;
  }

  let success = false;
  let message = "Launch failed";

  try {
    // Resolve locally using the cloud app's name and ID.
    const executable = findLocalExecutable(command.app);
    await launchApplication(executable);

    success = true;
    message = `${command.app.name} launch requested`;
    console.log(message);
  } catch (error) {
    message = error.message;
    console.error("Launch failed:", message);
  }

  try {
    await reportResult(command.id, success, message);
    console.log("Command result reported to Render.");
  } catch (error) {
    console.error("Could not report result:", error.message);
  }
}

async function poll() {
  try {
    const data = await apiRequest("/api/agent/commands/next");

    if (data.command) {
      console.log("Received launch command:", data.command.id);
      await processCommand(data.command);
    }
  } catch (error) {
    console.error("Polling error:", error.message);
  }
}

async function start() {
  console.log("DeskPilot Windows Agent started.");
  console.log("Backend:", SERVER_URL);
  console.log("App list will be resolved from each received command.");

  while (true) {
    await poll();
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
  }
}

start().catch((error) => {
  console.error("Agent startup failed:", error.message);
  process.exit(1);
});

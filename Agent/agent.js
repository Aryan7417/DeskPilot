
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const SERVER_URL = (
  process.env.DESKPILOT_SERVER_URL || ""
).replace(/\/+$/, "");

const AGENT_TOKEN = process.env.DESKPILOT_AGENT_TOKEN;

const APPS_FILE = path.join(__dirname, "apps.local.json");
const POLL_INTERVAL = 3000;

if (!SERVER_URL || !AGENT_TOKEN) {
  console.error(
    "Missing DESKPILOT_SERVER_URL or DESKPILOT_AGENT_TOKEN in .env"
  );
  process.exit(1);
}

if (process.platform !== "win32") {
  console.error("DeskPilot Agent must run on Windows.");
  process.exit(1);
}

function loadApps() {
  const data = JSON.parse(fs.readFileSync(APPS_FILE, "utf8"));

  if (!Array.isArray(data)) {
    throw new Error("apps.local.json must contain an array");
  }

  return data;
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
    throw new Error(
      `API ${response.status}: ${data.message || "Request failed"}`
    );
  }

  return data;
}

function launchApplication(app) {
  return new Promise((resolve, reject) => {
    if (
      typeof app.path !== "string" ||
      !path.win32.isAbsolute(app.path) ||
      path.win32.extname(app.path).toLowerCase() !== ".exe"
    ) {
      return reject(new Error("Invalid executable path"));
    }

    if (!fs.existsSync(app.path)) {
      return reject(new Error("Executable not found on this laptop"));
    }

    const child = spawn(app.path, [], {
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

  let result = {
    success: false,
    message: "Launch failed",
  };

  try {
    const apps = loadApps();

    // Only launch apps explicitly configured in the local allowlist.
    const app = apps.find(
      (item) => item.id === command.app.id
    );

    if (!app) {
      throw new Error(
        `App ID ${command.app.id} is not in apps.local.json`
      );
    }

    await launchApplication(app);

    result = {
      success: true,
      message: `${app.name} launched successfully`,
    };

    console.log(result.message);
  } catch (error) {
    result.message = error.message;
    console.error("Launch failed:", error.message);
  }

  try {
    await reportResult(command.id, result.success, result.message);
    console.log("Command result reported to Render.");
  } catch (error) {
    console.error("Could not report command result:", error.message);
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
  loadApps();

  console.log("DeskPilot Windows Agent started.");
  console.log("Backend:", SERVER_URL);
  console.log("Configured apps:", loadApps().length);

  while (true) {
    await poll();
    await new Promise((resolve) =>
      setTimeout(resolve, POLL_INTERVAL)
    );
  }
}

start().catch((error) => {
  console.error("Agent startup failed:", error.message);
  process.exit(1);
});

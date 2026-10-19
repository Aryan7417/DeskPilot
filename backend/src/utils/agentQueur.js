
const { randomUUID } = require("crypto");

const commands = new Map();

function enqueueLaunch(app) {
  const command = {
    id: randomUUID(),
    type: "launch",
    app: {
      id: app.id,
      name: app.name,
    },
    status: "pending",
    createdAt: Date.now(),
  };

  commands.set(command.id, command);
  return command;
}

function getNextCommand() {
  const now = Date.now();

  for (const [id, command] of commands) {
    if (now - command.createdAt > 5 * 60 * 1000) {
      commands.delete(id);
      continue;
    }

    if (command.status === "pending") {
      command.status = "processing";
      return command;
    }
  }

  return null;
}

function completeCommand(id, result) {
  const command = commands.get(id);

  if (!command || command.status !== "processing") {
    return false;
  }

  command.status = result.success ? "completed" : "failed";
  command.result = {
    success: Boolean(result.success),
    message: String(result.message || "").slice(0, 300),
  };
  command.completedAt = Date.now();

  return true;
}

module.exports = {
  enqueueLaunch,
  getNextCommand,
  completeCommand,
};


const {
  getNextCommand,
  completeCommand,
} = require("../utils/agentQueur");

// GET /api/agent/commands/next
function getCommand(req, res) {
  try {
    const command = getNextCommand();

    return res.status(200).json({
      success: true,
      command,
    });
  } catch (error) {
    console.error("Get agent command error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not fetch command",
    });
  }
}

// POST /api/agent/commands/:id/result
function reportResult(req, res) {
  try {
    const { success, message } = req.body;

    if (
      typeof success !== "boolean" ||
      typeof message !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "A boolean success and string message are required",
      });
    }

    const updated = completeCommand(req.params.id, {
      success,
      message,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Command not found or already completed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Command result received",
    });
  } catch (error) {
    console.error("Report agent result error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not save command result",
    });
  }
}

module.exports = {
  getCommand,
  reportResult,
};

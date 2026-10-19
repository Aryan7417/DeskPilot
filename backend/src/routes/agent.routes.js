const express = require("express");
const router = express.Router();

const {
  getCommand,
  reportResult,
  heartbeat,
  getAgentStatus,
} = require("../controllers/agent.controller");

const authenticateAgent = require("../middleware/agentAuth");

// Existing routes
router.get("/commands/next", authenticateAgent, getCommand);
router.post("/commands/:id/result", authenticateAgent, reportResult);

// New agent status routes
router.post("/heartbeat", authenticateAgent, heartbeat);
router.get("/status", getAgentStatus);

module.exports = router;
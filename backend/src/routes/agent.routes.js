
const express = require("express");
const router = express.Router();

const {
  getCommand,
  reportResult,
} = require("../controllers/agent.controller");

const authenticateAgent = require("../middleware/agentAuth");

router.get("/commands/next", authenticateAgent, getCommand);
router.post("/commands/:id/result", authenticateAgent, reportResult);

module.exports = router;

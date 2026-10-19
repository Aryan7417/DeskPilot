function authenticateAgent(req, res, next) {
  const expectedToken = process.env.DESKPILOT_AGENT_TOKEN;
  const authHeader = req.headers.authorization;

  if (!expectedToken) {
    return res.status(500).json({
      success: false,
      message: "Agent authentication is not configured",
    });
  }

  if (authHeader !== `Bearer ${expectedToken}`) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized agent",
    });
  }

  next();
}

module.exports = authenticateAgent;
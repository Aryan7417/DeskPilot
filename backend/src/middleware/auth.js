function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.DESKPILOT_TOKEN;

  if (!expectedToken) {
    return res.status(500).json({
      success: false,
      message: "Server authentication is not configured",
    });
  }

    if (authHeader !== `Bearer ${expectedToken}`) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or missing tokens",
    });
  }

  next();
}

module.exports = authenticate;
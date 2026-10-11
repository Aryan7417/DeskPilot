require("dotenv").config(); 

const express = require("express");
const app = express();


const PORT = process.env.PORT || 3000;


app.use(express.json({ limit: "10kb" }));




app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DeskPilot server is running",
    status: "online",
    timestamp: new Date().toISOString(),
  });
});




app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON body",
    });
  }

  console.error("Server error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});


app.listen(PORT, "0.0.0.0", () => {
  console.log(`DeskPilot server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
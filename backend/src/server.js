
// require("dotenv").config();

// const express = require("express");
// const path = require("path");

// const app = express();
// const authenticate = require("./middleware/auth");
// const appRoutes = require("./routes/app.routes");

// const PORT = process.env.PORT || 3000;

// app.use(express.json({ limit: "10kb" }));


// app.use(
//   "/app-icons",
//   express.static(path.join(__dirname, "../public/app-icons"))
// );

// app.use("/api/apps", appRoutes);

// app.get("/health", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "DeskPilot server is Running",
//     status: "online",
//     timestamp: new Date().toISOString(),
//   });
// });

// app.get("/api/test", authenticate, (req, res) => {
//   res.json({
//     success: true,
//     message: "Authentication successful",
//   });
// });

// app.use((err, req, res, next) => {
//   if (err instanceof SyntaxError && "body" in err) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid JSON body",
//     });
//   }

//   console.error("Server error:", err.message);

//   res.status(500).json({
//     success: false,
//     message: "Internal server Error",
//   });
// });

// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`DeskPilot server running on port ${PORT}`);
//   console.log(`Health check: http://localhost:${PORT}/health`);
// });


require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const authenticate = require("./middleware/auth");
const appRoutes = require("./routes/app.routes");
const clipboardRoutes = require("./routes/clipboard.routes");
const { startClipboardMonitor } = require("./controllers/clipboard.controller");

const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10kb" }));

app.use(
  "/app-icons",
  express.static(path.join(__dirname, "../public/app-icons"))
);

app.use("/api/apps", appRoutes);
app.use("/api/clipboard", clipboardRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DeskPilot server is Running",
    status: "online",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/test", authenticate, (req, res) => {
  res.json({
    success: true,
    message: "Authentication successful",
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
    message: "Internal server Error",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`DeskPilot server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);

  // Must run in the logged-in Windows desktop session to access its clipboard.
  startClipboardMonitor();
});

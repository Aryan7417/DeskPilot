const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth")
const {
  getApps,
  addApp,
  launchApp,
  deleteApp
} = require("../controllers/app.controller");



router.get("/", authenticate, getApps);
router.post("/", authenticate, addApp);
router.post("/:id/launch", authenticate, launchApp);
router.delete("/:id", authenticate, deleteApp);


module.exports = router;
const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth")
const {
  getApps,
  addApp,
} = require("../controllers/app.controller");



router.get("/", authenticate, getApps);
router.post("/", authenticate, addApp);


module.exports = router;
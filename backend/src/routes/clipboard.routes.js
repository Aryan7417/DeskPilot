const express = require("express");
const router = express.Router();

const {
    getClipboard,
    receiveClipboardText,
    deleteClipboardItem,
    deleteAllClipboard,
} = require("../controllers/clipboard.controller");

const agentAuth = require("../middleware/agentAuth");

// Windows Agent sends clipboard text
router.post("/", agentAuth, receiveClipboardText);

// Mobile app reads clipboard history
router.get("/", getClipboard);

// Delete all history
router.delete("/", deleteAllClipboard);

// Delete a single item
router.delete("/:id", deleteClipboardItem);

module.exports = router;
const express = require("express");
const authenticate = require("../middleware/auth");
const {
    getClipboard,
    deleteClipboardItem,
} = require("../controllers/clipboard.controller");

const router = express.Router();

router.use(authenticate);

router.get("/", getClipboard);
router.delete("/:id", deleteClipboardItem);

module.exports = router;

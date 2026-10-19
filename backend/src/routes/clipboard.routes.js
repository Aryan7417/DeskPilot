
const express = require("express");
const router = express.Router();

const {
    getClipboard,
    deleteClipboardItem,
    deleteAllClipboard,
} = require("../controllers/clipboard.controller");

router.get("/", getClipboard);

router.delete("/", deleteAllClipboard);


router.delete("/:id", deleteClipboardItem);

module.exports = router;

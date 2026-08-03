const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessages,
  getMessageById,
  deleteMessage,
} = require("../controllers/contactController");

// Send Message
router.post("/", sendMessage);

// Get All Messages
router.get("/", getMessages);

// Get Single Message
router.get("/:id", getMessageById);

// Delete Message
router.delete("/:id", deleteMessage);

module.exports = router;
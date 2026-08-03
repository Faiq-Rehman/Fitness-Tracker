const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus,
  deleteTicket,
} = require("../controllers/supportController");

// Create Ticket
router.post("/", protect, createTicket);

// Get All Tickets
router.get("/", protect, getTickets);

// Get Ticket By ID
router.get("/:id", protect, getTicketById);

// Update Ticket Status
router.put("/:id", protect, updateTicketStatus);

// Delete Ticket
router.delete("/:id", protect, deleteTicket);

module.exports = router;
const SupportTicket = require("../models/SupportTicket");

// ==============================
// Create Support Ticket
// ==============================

const createTicket = async (req, res) => {
  try {

    const {
      subject,
      description,
      priority,
    } = req.body;

    const ticket = await SupportTicket.create({
      userId: req.user._id,
      subject,
      description,
      priority,
      status: "Open",
    });

    res.status(201).json({
      success: true,
      message: "Support Ticket Created Successfully",
      ticket,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Get All Tickets
// ==============================

const getTickets = async (req, res) => {
  try {

    const tickets = await SupportTicket.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: tickets.length,
      tickets,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Get Ticket By ID
// ==============================

const getTicketById = async (req, res) => {
  try {

    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!ticket) {

      return res.status(404).json({
        success: false,
        message: "Ticket Not Found",
      });

    }

    res.status(200).json({
      success: true,
      ticket,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Update Ticket Status
// ==============================

const updateTicketStatus = async (req, res) => {
  try {

    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket Not Found",
      });
    }

    ticket.status = req.body.status || ticket.status;
    ticket.priority = req.body.priority || ticket.priority;
    ticket.subject = req.body.subject || ticket.subject;
    ticket.description = req.body.description || ticket.description;

    const updatedTicket = await ticket.save();

    res.status(200).json({
      success: true,
      message: "Ticket Updated Successfully",
      ticket: updatedTicket,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// ==============================
// Delete Ticket
// ==============================

const deleteTicket = async (req, res) => {
  try {

    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!ticket) {

      return res.status(404).json({
        success: false,
        message: "Ticket Not Found",
      });

    }

    await SupportTicket.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Ticket Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus,
  deleteTicket,
};
const Contact = require("../models/Contact");

// ==============================
// Send Contact Message
// ==============================

const sendMessage = async (req, res) => {
  try {

    const {
      fullName,
      email,
      subject,
      message,
    } = req.body;

    const contact = await Contact.create({
      fullName,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message Sent Successfully",
      contact,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Get All Messages
// ==============================

const getMessages = async (req, res) => {
  try {

    const contacts = await Contact.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      total: contacts.length,
      contacts,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Get Single Message
// ==============================

const getMessageById = async (req, res) => {
  try {

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message Not Found",
      });
    }

    res.status(200).json({
      success: true,
      contact,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Delete Message
// ==============================

const deleteMessage = async (req, res) => {
  try {

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message Not Found",
      });
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Message Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  sendMessage,
  getMessages,
  getMessageById,
  deleteMessage,
};
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
} = require("../controllers/reportController");

// Create Report
router.post("/", protect, createReport);

// Get All Reports
router.get("/", protect, getReports);

// Get Report By ID
router.get("/:id", protect, getReportById);

// Update Report
router.put("/:id", protect, updateReport);

// Delete Report
router.delete("/:id", protect, deleteReport);

module.exports = router;
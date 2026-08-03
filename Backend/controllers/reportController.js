const Report = require("../models/Report");

// ==============================
// Create Report
// ==============================

const createReport = async (req, res) => {
  try {

    const {
      reportType,
      fileName,
      fileUrl,
      generatedDate,
    } = req.body;

    const report = await Report.create({
      userId: req.user._id,
      reportType,
      fileName,
      fileUrl,
      generatedDate,
    });

    res.status(201).json({
      success: true,
      message: "Report Created Successfully",
      report,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Get All Reports
// ==============================

const getReports = async (req, res) => {
  try {

    const reports = await Report.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: reports.length,
      reports,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Get Report By ID
// ==============================

const getReportById = async (req, res) => {
  try {

    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!report) {

      return res.status(404).json({
        success: false,
        message: "Report Not Found",
      });

    }

    res.status(200).json({
      success: true,
      report,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Update Report
// ==============================

const updateReport = async (req, res) => {
  try {

    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!report) {

      return res.status(404).json({
        success: false,
        message: "Report Not Found",
      });

    }

    report.reportType = req.body.reportType || report.reportType;
    report.fileName = req.body.fileName || report.fileName;
    report.fileUrl = req.body.fileUrl || report.fileUrl;
    report.generatedDate =
      req.body.generatedDate || report.generatedDate;

    const updatedReport = await report.save();

    res.status(200).json({
      success: true,
      message: "Report Updated Successfully",
      report: updatedReport,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Delete Report
// ==============================

const deleteReport = async (req, res) => {
  try {

    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!report) {

      return res.status(404).json({
        success: false,
        message: "Report Not Found",
      });

    }

    await Report.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Report Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
};
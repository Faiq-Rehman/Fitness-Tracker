const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");

// ==============================
// Admin Login
// ==============================

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check Username
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid Username or Password",
      });
    }

    // Check Password (Without Hash)
    if (admin.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid Username or Password",
      });
    }

    // Generate JWT Token
    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: "Admin Login Successfully",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  adminLogin,
};
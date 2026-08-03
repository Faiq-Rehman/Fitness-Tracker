const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const adminProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.admin = await Admin.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized, Invalid Admin Token",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized, No Token Provided",
    });
  }
};

module.exports = adminProtect;

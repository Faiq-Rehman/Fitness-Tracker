const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user details except password
      req.user = await User.findById(decoded.id).select("-password");

      // Continue to next middleware/controller
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized, Invalid Token",
      });
    }
  }

  // No token found
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized, No Token Provided",
    });
  }
};

module.exports = protect;
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign(
    { id }, // Payload
    process.env.JWT_SECRET, // Secret Key from .env
    {
      expiresIn: "7d", // Token expires in 7 days
    }
  );
};

module.exports = generateToken;
const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");


// ==============================
// Register User
// ==============================

const registerUser = async (req, res) => {
  try {

    const {
      fullName,
      username,
      email,
      password,
      age,
      gender,
      height,
      weight,
      profilePicture
    } = req.body;

    // Check if user already exists

    const userExists = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // Create User

    const user = await User.create({
      fullName,
      username,
      email,
      password,
      age,
      gender,
      height,
      weight,
      profilePicture
    });

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      token: generateToken(user._id),
      user
    });

 } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
        success: false,
        message: error.message
    });
}

};




// ==============================
// Login User
// ==============================

const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    // Find User

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found"
      });
    }

    // Compare Password

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {

      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password"
      });

    }

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token: generateToken(user._id),
      user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



// ==============================
// Get Logged In User Profile
// ==============================

const getUserProfile = async (req, res) => {

  try {

    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



// ==============================
// Update User Profile
// ==============================

const updateUserProfile = async (req, res) => {

  try {

    const user = await User.findById(req.user._id);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User Not Found"
      });

    }

    user.fullName = req.body.fullName || user.fullName;
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.age = req.body.age !== undefined ? req.body.age : user.age;
    user.gender = req.body.gender || user.gender;
    user.height = req.body.height !== undefined ? req.body.height : user.height;
    user.weight = req.body.weight !== undefined ? req.body.weight : user.weight;
    if (req.body.profilePicture !== undefined) {
      user.profilePicture = req.body.profilePicture;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user: updatedUser
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



// ==============================
// Change Password
// ==============================

const changePassword = async (req, res) => {

  try {

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {

      return res.status(401).json({
        success: false,
        message: "Current Password is Incorrect"
      });

    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password Changed Successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



// ==============================
// Delete User
// ==============================

const deleteUser = async (req, res) => {

  try {

    const user = await User.findById(req.user._id);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User Not Found"
      });

    }

    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({
      success: true,
      message: "User Deleted Successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteUser
};
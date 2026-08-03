const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load Environment Variables
dotenv.config();

// Import Database Connection
const connectDB = require("./config/db");

// Import Routes
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");
const progressRoutes = require("./routes/progressRoutes");
const goalRoutes = require("./routes/goalRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reportRoutes = require("./routes/reportRoutes");
const settingRoutes = require("./routes/settingRoutes");
const supportRoutes = require("./routes/supportRoutes");
const adminRoutes = require("./routes/adminRoutes"); // ✅ Added
const adminDataRoutes = require("./routes/adminDataRoutes");

// Initialize Express App
const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Default Route
app.get("/", (req, res) => {
    res.send("🚀 Fitness Tracker Backend API is Running...");
});

// =========================
// API Routes
// =========================

// User Routes
app.use("/api/users", userRoutes);

// Workout Routes
app.use("/api/workouts", workoutRoutes);

// Nutrition Routes
app.use("/api/nutrition", nutritionRoutes);

// Progress Routes
app.use("/api/progress", progressRoutes);

// Goal Routes
app.use("/api/goals", goalRoutes);

// Notification Routes
app.use("/api/notifications", notificationRoutes);

// Report Routes
app.use("/api/reports", reportRoutes);

// Setting Routes
app.use("/api/settings", settingRoutes);

// Support Ticket Routes
app.use("/api/support", supportRoutes);

// Admin Routes
app.use("/api/admin", adminRoutes); // ✅ Added
// Admin Data Routes (overview, lists)
app.use("/api/admin", adminDataRoutes);

// Contact Routes
app.use("/api/contact", contactRoutes);

// 404 Route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API Route Not Found",
    });
});

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
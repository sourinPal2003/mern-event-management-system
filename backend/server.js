const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Route imports
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const vendorRoutes = require("./routes/vendor");
const userRoutes = require("./routes/user");

// Model imports (for scheduled tasks)
const User = require("./models/User");

/* ── Initialise app ── */
const app = express();

/* ── Global middleware ── */
app.use(cors({
            origin: "*",
            credentials: true
        }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ── API routes ── */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/user", userRoutes);

/* ── Health check ── */
app.get("/", (_req, res) => {
  res.json({ message: "Event Management System API is running." });
});

/* ── Error handler (must be last) ── */
app.use(errorHandler);

/* ── Start server ── */
const PORT = process.env.PORT || 5000;



const checkExpiredVendors = async () => {
  try {
    const today = new Date();

    await User.updateMany(
      {
        role: "vendor",
        membershipEnd: { $lte: today },
        isActive: true,
      },
      { $set: { isActive: false } }
    );

    console.log("Expired vendors checked");
  } catch (error) {
    console.error("Error checking vendors:", error);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);

    // Check for expired vendors immediately on startup, then every 24 hours
    checkExpiredVendors();
    setInterval(checkExpiredVendors, 24 * 60 * 60 * 1000);
  });
});

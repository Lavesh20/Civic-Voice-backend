const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/database');

// Import Routes & Models
const complaintRoutes = require("./routes/complaintRoutes");
const adminRoutes = require("./routes/adminRoutes");
const Admin = require("./models/Admin");

dotenv.config();
connectDB();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: 'https://civicvoice-rosy.vercel.app',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);

app.get('/', (req, res) => {
  res.status(200).send({ message: 'Welcome to your Express application' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(500).json({ message: err.message });
});

// One-Time Admin Creation or Update Password if Changed
const createOrUpdateAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });

    if (!existingAdmin) {
      // Create new admin
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      const newAdmin = new Admin({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword
      });

      await newAdmin.save();
      console.log("✅ Admin account created successfully!");
    } else {
      // Check if password has changed in .env
      const isMatch = await bcrypt.compare(process.env.ADMIN_PASSWORD, existingAdmin.password);
      if (!isMatch) {
        console.log("🔄 Updating Admin Password...");
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        existingAdmin.password = hashedPassword;
        await existingAdmin.save();
        console.log("✅ Admin password updated successfully!");
      } else {
        console.log("⚡ Admin already exists, skipping creation.");
      }
    }
  } catch (error) {
    console.error("❌ Error creating/updating admin:", error);
  }
};

// Start Server After Admin Check
const startServer = async () => {
  await createOrUpdateAdmin(); // Ensure admin exists before starting the server

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();

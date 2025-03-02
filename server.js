const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');

// Import Routes
const complaintRoutes = require("./routes/complaintRoutes");

dotenv.config();
connectDB();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:8080',
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

app.get('/', (req, res) => {
  res.status(200).send({ message: 'Welcome to your Express application' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const { submitComplaint, getAllComplaints } = require("../controllers/complaintController");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer Setup for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Routes
router.post("/submit", upload.array("files"), submitComplaint);
router.get("/all", getAllComplaints);

module.exports = router;

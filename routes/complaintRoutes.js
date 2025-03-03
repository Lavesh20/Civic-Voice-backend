// const express = require("express");
// const { submitComplaint, getAllComplaints } = require("../controllers/complaintController");
// const multer = require("multer");
// const path = require("path");

// const router = express.Router();

// // Multer Setup for File Uploads
// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // Ensure 'uploads/' directory exists
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage: storage }).array("files", 5); // Expecting an array of files

// module.exports = upload;

// // Routes
// router.post("/submit", upload.array("files"), submitComplaint);
// router.get("/all", getAllComplaints);

// module.exports = router;

const express = require("express");
const { submitComplaint, getAllComplaints, validateReferenceNumber } = require("../controllers/complaintController");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer Setup for File Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure 'uploads/' directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Routes
router.post("/submit", upload.array("files", 5), submitComplaint);
router.get("/all", getAllComplaints);
router.post("/validate/:referenceNumber", validateReferenceNumber); // Validation Route

module.exports = router;


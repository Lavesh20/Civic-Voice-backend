// const Complaint = require("../models/Complaint");
// const { v4: uuidv4 } = require("uuid");
// const sendComplaintEmail = require("../services/emailService");

// // Submit Complaint
// const submitComplaint = async (req, res) => {
//   try {
//     console.log("Received Request Body:", req.body);
//     console.log("Received Files:", req.files);

//     const { name, email, phone, title, category, description, addressLine1, addressLine2, city, state, pincode } = req.body;

//     // Validate required fields
//     if (!name || !email || !phone || !title || !category || !description || !addressLine1 || !city || !state || !pincode) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Generate reference number
//     const referenceNumber = uuidv4().slice(0, 8).toUpperCase();

//     // Handle file uploads (Ensure multer is set up in routes)
//     const files = req.files?.map(file => file.path) || [];

//     // Create new complaint object
//     const newComplaint = new Complaint({
//       personalInfo: { name, email, phone },
//       complaintDetails: { title, category, description },
//       location: { addressLine1, addressLine2, city, state, pincode },
//       files,
//       referenceNumber
//     });

//     // Save complaint to MongoDB
//     const savedComplaint = await newComplaint.save();
//     console.log("Complaint saved successfully:", savedComplaint);

//     // Send confirmation email
//     await sendComplaintEmail(email, name, referenceNumber);

//     // Send response with reference number
//     res.status(201).json({ 
//       message: "Complaint submitted successfully", 
//       referenceNumber: savedComplaint.referenceNumber 
//     });

//   } catch (error) {
//     console.error("❌ Error in submitComplaint:", error);
//     res.status(500).json({ message: "Server Error: " + error.message });
//   }
// };

// // Get All Complaints
// const getAllComplaints = async (req, res) => {
//   try {
//     const complaints = await Complaint.find().sort({ createdAt: -1 });
//     res.status(200).json(complaints);
//   } catch (error) {
//     console.error("❌ Error in getAllComplaints:", error);
//     res.status(500).json({ message: "Server Error: " + error.message });
//   }
// };

// // Validate Reference Number
// // const validateReferenceNumber = async (req, res) => {
// //   try {
// //     const { referenceNumber } = req.params;
// //     const complaint = await Complaint.findOne({ referenceNumber });

// //     res.json({ valid: !!complaint });
// //   } catch (error) {
// //     console.error("❌ Validation error:", error);
// //     res.status(500).json({ message: "Server error during validation" });
// //   }
// // };

// const getComplaintByReference = async (req, res) => {
//   try {
//     const { referenceNumber } = req.body; // Reference number from input

//     if (!referenceNumber) {
//       return res.status(400).json({ message: "Reference number is required" });
//     }

//     const complaint = await Complaint.findOne({ referenceNumber });

//     if (!complaint) {
//       return res.status(404).json({ message: "Complaint not found. Please check your reference number." });
//     }

//     // Send only required fields to match frontend
//     res.json({
//       id: complaint.id,
//       title: complaint.complaintDetails.title, // Fix: Access nested field
//       category: complaint.complaintDetails.category, // Fix: Access nested field
//       status: complaint.status,
//       submittedDate: complaint.createdAt, // Fix: Use timestamps
//       lastUpdated: complaint.updatedAt, // Fix: Use timestamps
//       progressPercentage: 50, // Not present in schema, replace with logic if needed
//     });
//   } catch (error) {
//     console.error("Error fetching complaint:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


// module.exports = { submitComplaint, getAllComplaints, getComplaintByReference };

const Complaint = require("../models/Complaint");
const { v4: uuidv4 } = require("uuid");
const sendComplaintEmail = require("../services/emailService");
const sendSMSNotification = require("../services/twilioService"); // Import Twilio service

// Submit Complaint
const submitComplaint = async (req, res) => {
  try {
    console.log("Received Request Body:", req.body);
    console.log("Received Files:", req.files);

    const { name, email, phone, title, category, description, addressLine1, addressLine2, city, state, pincode } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !title || !category || !description || !addressLine1 || !city || !state || !pincode) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Generate reference number
    const referenceNumber = uuidv4().slice(0, 8).toUpperCase();

    // Handle file uploads
    const files = req.files?.map(file => file.path) || [];

    // Create new complaint object
    const newComplaint = new Complaint({
      personalInfo: { name, email, phone },
      complaintDetails: { title, category, description },
      location: { addressLine1, addressLine2, city, state, pincode },
      files,
      referenceNumber,
    });

    // Save complaint to MongoDB
    const savedComplaint = await newComplaint.save();
    console.log("✅ Complaint saved successfully:", savedComplaint);

    // Send confirmation email
    await sendComplaintEmail(email, name, referenceNumber);

    // Send SMS notification
    const smsMessage = `Dear ${name}, your complaint '${title}' has been registered successfully. Reference Number: ${referenceNumber}. You will be updated on further progress.`;
    await sendSMSNotification(phone, smsMessage);

    // Send response
    res.status(201).json({ 
      message: "Complaint submitted successfully", 
      referenceNumber: savedComplaint.referenceNumber 
    });

  } catch (error) {
    console.error("❌ Error in submitComplaint:", error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

// Get All Complaints
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    console.error("❌ Error in getAllComplaints:", error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

// Get Complaint by Reference Number
const getComplaintByReference = async (req, res) => {
  try {
    const { referenceNumber } = req.body; // Reference number from input

    if (!referenceNumber) {
      return res.status(400).json({ message: "Reference number is required" });
    }

    const complaint = await Complaint.findOne({ referenceNumber });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found. Please check your reference number." });
    }

    // Send only required fields to match frontend
    res.json({
      id: complaint.id,
      title: complaint.complaintDetails.title, // Fix: Access nested field
      category: complaint.complaintDetails.category, // Fix: Access nested field
      status: complaint.status,
      submittedDate: complaint.createdAt, // Fix: Use timestamps
      lastUpdated: complaint.updatedAt, // Fix: Use timestamps
      progressPercentage: 50, // Placeholder, replace with actual logic if needed
    });
  } catch (error) {
    console.error("❌ Error fetching complaint:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { submitComplaint, getAllComplaints, getComplaintByReference };

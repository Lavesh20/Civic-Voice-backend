const Complaint = require("../models/Complaint");
const { v4: uuidv4 } = require("uuid");

// Submit Complaint
const submitComplaint = async (req, res) => {
  try {
    console.log("Received Request Body:", req.body);
    console.log("Received Files:", req.files);

    const { name, email, phone, title, category, description, addressLine1, addressLine2, city, state, pincode } = req.body;

    if (!name || !email || !phone || !title || !category || !description || !addressLine1 || !city || !state || !pincode) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const referenceNumber = uuidv4().slice(0, 8).toUpperCase();
    const files = req.files ? req.files.map(file => file.path) : [];

    const newComplaint = new Complaint({
      personalInfo: { name, email, phone },
      complaintDetails: { title, category, description },
      location: { addressLine1, addressLine2, city, state, pincode },
      files,
      referenceNumber
    });

    await newComplaint.save();
    res.status(201).json({ message: "Complaint submitted successfully", referenceNumber });

  } catch (error) {
    console.error("Error in submitComplaint:", error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

// Get All Complaints
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error in getAllComplaints:", error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

module.exports = { submitComplaint, getAllComplaints };

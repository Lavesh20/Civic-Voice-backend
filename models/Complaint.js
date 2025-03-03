const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  personalInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  complaintDetails: {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true }
  },
  location: {
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  files: { type: [String], default: [] },
  referenceNumber: { type: String, unique: true, required: true },
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" }, // Added Status
}, { timestamps: true }); // Auto-manages createdAt & updatedAt

module.exports = mongoose.model('Complaint', complaintSchema);

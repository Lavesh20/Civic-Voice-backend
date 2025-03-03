const nodemailer = require("nodemailer");
require("dotenv").config();

const sendComplaintEmail = async (userEmail, userName, referenceNumber) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Complaint Submission Confirmation",
      html: `
        <h2>Hello ${userName},</h2>
        <p>Thank you for submitting your complaint. Your reference number is:</p>
        <h3 style="color:blue;">${referenceNumber}</h3>
        <p>Use this number to track your complaint status.</p>
        <br/>
        <p>Best regards,<br>Public Service Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Complaint email sent to:", userEmail);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendComplaintEmail;

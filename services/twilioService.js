// const twilio = require("twilio");

// // Load Twilio credentials from environment variables
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// const client = twilio(accountSid, authToken);

// /**
//  * Send an SMS notification
//  * @param {string} phone - Recipient's phone number
//  * @param {string} message - SMS body text
//  */
// const sendSMSNotification = async (phone, message) => {
//   try {
//     const response = await client.messages.create({
//       body: message,
//       from: twilioPhoneNumber,
//       to: phone,
//     });

//     console.log("📩 SMS sent successfully:", response.sid);
//   } catch (error) {
//     console.error("❌ Error sending SMS:", error.message);
//   }
// };

// module.exports = sendSMSNotification;

const twilio = require("twilio");

// Debugging: Log credentials
console.log("Twilio SID:", process.env.TWILIO_ACCOUNT_SID);
console.log("Twilio Auth Token:", process.env.TWILIO_AUTH_TOKEN ? "Loaded ✅" : "❌ Not Found");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Ensure credentials exist
if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.error("❌ Twilio credentials are missing!");
  process.exit(1); // Stop execution if credentials are missing
}

const client = twilio(accountSid, authToken);

const sendSMSNotification = async (phone, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phone,
    });

    console.log("📩 SMS sent successfully:", response.sid);
  } catch (error) {
    console.error("❌ Error sending SMS:", error.message);
  }
};

module.exports = sendSMSNotification;

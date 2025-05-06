const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// In-memory storage for OTPs (in production, you should use a database)
const otpStorage = new Map();

/**
 * ##### CODE STANDARD #####
 */
const sendTwilioOtp = (req, res) => {
  const otp = generateOTP();
  otpStorage.set(req.body.phoneNumber, otp); //use this otp to db againts that user along with user id

  const client = twilio(accountSid, authToken);
  client.messages
    .create({
      body: `Your One time password is: ${otp}`,
      from: twilioPhoneNumber,
      to: req.body.phoneNumber,
    })
    .then(() => {
      return res.json({ message: "OTP sent successfully." });
    })
    .catch((err) => {
      return res.status(500).json({ error: "Failed to send OTP." });
    });
};

const verifyTwilioOtp = (req, res) => {
  const storedOTP = otpStorage.get(req.body.phoneNumber);
  if (!storedOTP || storedOTP !== parseInt(req.body.otp, 10)) {
    return res.json({ message: "OTP verification failed." });
  }

  otpStorage.delete(req.body.phoneNumber); //Delete otp from db
  return res.json({ message: "OTP verification successful." });
};

// Generate a random OTP (6 digits)
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

/*==========================================================================
    GOOD TO GO
========================================================================== */

module.exports = {
  sendTwilioOtp,
  verifyTwilioOtp,
};

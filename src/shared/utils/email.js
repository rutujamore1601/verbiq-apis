const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 465, //587
      secure: true,
      auth: {
        user: "rutujamore1601@gmail.com",
        pass: "tfpc cwxy fikm peni",
      },
      tls: {
        ciphers: "SSLv3",
      },
    });

    await transporter.sendMail({
      from: "rutujamore1601@gmail.com",
      to: email,
      subject: subject,
      html: message,
    });
    console.log("email sent successfully");
    return true;
  } catch (error) {
    console.log("email not sent");
    console.log(error);
    return false;
  }
};

module.exports = sendEmail;

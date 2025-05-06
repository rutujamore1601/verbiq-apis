const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);

function sendTwillioEmail(email, subject, text, html) {
  const msg = {
    to: email, // Change to your recipient
    from: "tburate10@gmail.com", // Change to your verified sender
    subject: subject,
    text: text,
    html: html,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}

// function sendTwillioEmail() {
//   const msg = {
//     to: "tejasburate19@gmail.com", // Change to your recipient
//     from: "tburate10@gmail.com", // Change to your verified sender
//     subject: "Sending with SendGrid is Fun",
//     text: "and easy to do anywhere, even with Node.js",
//     html: "<strong>and easy to do anywhere, even with Node.js</strong>",
//   };
//   sgMail
//     .send(msg)
//     .then(() => {
//       console.log("Email sent");
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }

module.exports = sendTwillioEmail;

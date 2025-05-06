const crypto = require("crypto");
const Razorpay = require("razorpay");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const proceedPayment = (req, res) => {
    const options = {
      amount: req.body.amount * 100, // Amount in paise (e.g., 50000 paise = INR 500)
      currency: req.body.currency,
      receipt: req.body.receipt, //orderId
      payment_capture: 1, // Auto-capture payment after successful payment
    };
  
    razorpay.orders.create(options, (err, order) => {
      if (err) {
        return res.status(500).send("Error creating order");
      }
      // Return the order details to the client
      return res.json(order);
    });
  };

const verifyPaymentSignature = (razorpayResData) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = razorpayResData;

  const data = `${razorpay_order_id}|${razorpay_payment_id}`;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(data)
    .digest("hex");

  if (generatedSignature === razorpay_signature) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  proceedPayment,
  verifyPaymentSignature,
};

const mongoose = require("mongoose");

const certificationPurchaseSchema = new mongoose.Schema(
  {
    razorpayResData: { type: Object, required: false },
    paymentStatus: { type: String, required: true },
    orderStatus: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    purchase: { type: String, default: false },
    materialFee: { type: String, default: false },
    purchase: { type: String, default: false },
    materialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "purchaseStudyMaterial",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "studentRegistration",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "certificationpurchase",
  certificationPurchaseSchema
);

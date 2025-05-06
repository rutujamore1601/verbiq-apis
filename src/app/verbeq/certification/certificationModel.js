const { required } = require("joi");
const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    certificateName: { type: String, required: false },
    certificateCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "certificatecategory",
      required: false,
    },
    certificateLevelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "certificatelevel",
      required: false,
    },
    description: { type: Array, required: false },
    coursefees: { type: String, required: false },
    amount: { type: String, required: true },
    purchases: { type: String, required: false },
    certificateImg: { type: String, required: false },
    materialUrl: { type: String, required: false },
    questionUrl: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("certificate", certificateSchema);

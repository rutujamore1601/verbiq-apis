const mongoose = require("mongoose");

const certificateCategorySchema = new mongoose.Schema(
  {
    certificateCategoryName: { type: String, required: false },
    description: { type: String, required: false },
    certificateCategoryImg: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "certificatecategory",
  certificateCategorySchema
);

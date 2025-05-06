const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema(
  {
    countryName: { type: String, required: false },
    isdCode: { type: String, required: false },
    description: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("country", countrySchema);

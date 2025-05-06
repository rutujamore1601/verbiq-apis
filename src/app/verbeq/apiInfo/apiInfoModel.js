const mongoose = require("mongoose");

const apiInfoSchema = new mongoose.Schema(
  {
    description: { type: Array, required: false },
    method: { type: String, required: false },
    endpoint: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("apiInfo", apiInfoSchema);

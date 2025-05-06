const mongoose = require("mongoose");

const certificateLevelSchema = new mongoose.Schema(
  {
    certificateLevelName: { type: String, required: false },
    levelName: { type: String, required: false },
    description: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("certificatelevel", certificateLevelSchema);

const mongoose = require("mongoose");

const uploadImageSchema = new mongoose.Schema(
  {
    img: { type: String, required: false },
    multipleImg: { type: Array, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("uploadImage", uploadImageSchema);

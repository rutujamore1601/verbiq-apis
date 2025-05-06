const mongoose = require("mongoose");

const fAQSchema = new mongoose.Schema(
  {
    question: { type: String, required: false },
    answer: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("frequentlyAskedQuestions", fAQSchema);

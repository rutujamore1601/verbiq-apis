const mongoose = require("mongoose");

const questionsSchema = new mongoose.Schema(
  {
    heading: { type: String, required: false },
    question: { type: String, required: false },
    typeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "types",
      required: false,
    },
    languageName: { type: String, required: false },
    passage: { type: String, required: false, default: null },
    solutionType: { type: String, required: false, default: null },
    instructionAudioUrl: { type: String, required: false },
    questionType: {
      type: String,
      enum: ["text", "mcq"],
      required: true,
    },
    options: [
      {
        optionText: String,
        isCorrect: Boolean,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("newquestions", questionsSchema);

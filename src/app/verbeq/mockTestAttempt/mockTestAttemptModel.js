const mongoose = require("mongoose");

const mockTestAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "studentRegistration",
      required: true,
    },
    typeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "types",
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "questions",
      required: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "session",
      required: false,
    },
    questionType: {
      type: String,
      enum: ["text", "mcq"], // Ensures only "text" or "mcq" is stored
      required: true,
    },
    answer: {
      type: String, // Stores the user's response (text or selected option)
      required: false,
    },
    isCorrect: {
      type: Boolean, // True/False for MCQs, null for text-based questions
      default: null,
    },
    languageAssessmentData: {
      type: String,
      required: false,
    },
    timeTaken: {
      type: Number,
      required: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
      required: false,
    },
    attemptedCount: { type: Number, required: true, default: 0 },
    unAttemptedCount: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

// Auto-update `attemptedCount` & `unAttemptedCount` before saving
mockTestAttemptSchema.pre("save", async function (next) {
  this.attemptedCount = this.answer ? 1 : 0;
  this.unAttemptedCount = this.answer ? 0 : 1;
  next();
});

module.exports = mongoose.model("mockTestAttempt", mockTestAttemptSchema);

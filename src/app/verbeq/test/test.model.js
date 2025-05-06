const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    testName: { type: String, required: false },
    rightAns: { type: Number, default: "4" },
    wrongAns: { type: Number, default: "1" },
    classId: [{ type: String, required: false }],
    totalQues: { type: String, required: false },
    questions: { type: Array, required: false },
    startTime: { type: String, required: false },
    endTime: { type: String, required: false },
    examDate: { type: String, required: false },
    testImage: { type: String, required: false },
    testNumber: { type: Number, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("test", testSchema);

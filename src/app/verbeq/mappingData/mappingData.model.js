const mongoose = require("mongoose");

const mappingDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "studentRegistration",
      required: false,
    },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "mockTest",
      required: false,
    },
    certificateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "certificate",
      required: false,
    },
    shedulId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "studentCertificationMapping",
      required: false,
    },
    paymentStatus: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("mappingData", mappingDataSchema);

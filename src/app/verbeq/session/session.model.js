const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "studentRegistration",
      required: true,
    },
    typeIds: [
      {
        typeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "types",
          required: true,
        },
        questionCount: { type: Number, default: 0 }, // Track progress per typeId
        completed: { type: Boolean, default: false },
      },
    ],
    sessionStatus: { type: String, required: true, default: "Running" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("session", sessionSchema);

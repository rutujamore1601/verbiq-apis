const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    settingTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "types",
      required: false
    },
    noOfQuizQuestions: {
      type: Number,
      default: 10
    },
    questionTime: {
      type: Number,
      default: 1800
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("setting", settingSchema);

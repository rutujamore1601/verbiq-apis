
const mongoose = require('mongoose');

const questionBookMarkSchema = new mongoose.Schema({
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
}, { timestamps: true });

module.exports = mongoose.model('questionBookMark', questionBookMarkSchema);

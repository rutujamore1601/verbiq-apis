const mongoose = require ('mongoose');

const questionLinkAudioSchema = new mongoose.Schema (
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'studentRegistration',
      required: true,
    },
    typeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'types',
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'questions',
      required: true,
    },
    audioUrl: {
      type: String,
      required: false,
    },
  },
  {timestamps: true}
);

module.exports = mongoose.model ('questionLinkAudio', questionLinkAudioSchema);

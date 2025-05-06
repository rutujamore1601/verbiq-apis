
const mongoose = require('mongoose');

const instructionSchema = new mongoose.Schema({
  instructions: { type: Array, required: false },
  typeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "types",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('instruction', instructionSchema);

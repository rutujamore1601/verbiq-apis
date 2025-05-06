
const mongoose = require('mongoose');

const uploadVideoSchema = new mongoose.Schema({
  video: { type: String, required: false },
  multipleVideo: { type: Array, required: false },
}, { timestamps: true });

module.exports = mongoose.model('uploadVideo', uploadVideoSchema);

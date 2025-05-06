
const mongoose = require('mongoose');

const registrationForScholershipSchema = new mongoose.Schema({
  classId: { type: String, required: false },
  examFee: { type: Number, required: false }
}, { timestamps: true });

module.exports = mongoose.model('registrationForScholership', registrationForScholershipSchema);

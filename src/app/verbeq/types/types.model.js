
const mongoose = require('mongoose');

const typesSchema = new mongoose.Schema({
  typeName: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model('types', typesSchema);

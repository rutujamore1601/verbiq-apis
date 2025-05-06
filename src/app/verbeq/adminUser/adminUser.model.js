
const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
  userNname: { type: String, required: false },
  password: { type: String, required: false },
  userType: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model('adminUser', adminUserSchema);

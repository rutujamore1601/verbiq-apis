const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: false },
    isdCode: { type: String, required: false },
    mobileNo: { type: String, required: false },
    companyName: { type: String, required: false },
    jobTitle: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    country: { type: String, required: false },
    description: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("contactus", contactUsSchema);

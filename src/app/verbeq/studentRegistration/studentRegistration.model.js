const mongoose = require("mongoose");

const studentRegistrationSchema = new mongoose.Schema(
  {
    registrationNumber: { type: String, required: false },
    firstName: { type: String, required: false },
    laststName: { type: String, required: false },
    mobileNo: { type: Number, required: false },
    email: { type: String, required: false },
    password: { type: String, required: false },
    language: { type: String, required: false },
    proficiency: { type: String, required: false },
    process: { type: String, required: false },
    client: { type: String, required: false },
    experience: { type: String, required: false },
    currentLocation: { type: String, required: false },
    processLocation: { type: String, required: false },
    roleType: { type: String, required: false },
    thirdPartyAssessment: { type: String, required: false },
    scoreInThirdPartyAssessment: { type: String, required: false },
    regionalLanguages: { type: String, required: false },
    foreignLanguages: { type: String, required: false },
    token: { type: String, required: false, default: null },
    deviceRegistrationToken: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "studentRegistration",
  studentRegistrationSchema
);

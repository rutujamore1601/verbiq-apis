const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "studentRegistration" },
  method: { type: String, required: true },
  statusCode: { type: String, required: true },
  url: { type: String, required: true },
  headers: { type: Object, required: true },
  body: { type: Object, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Log = mongoose.model("Log", logSchema);

module.exports = Log;

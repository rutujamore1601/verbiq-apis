const mongoose = require("mongoose");

const idCounterSchema = new mongoose.Schema({
  collectionName: {
    type: String,
    required: true,
    unique: true,
  },
  currentId: {
    type: Number,
    default: 1,
  },
});

const idCounterModel = mongoose.model("idCounter", idCounterSchema);

const getNextSequentialId = async (collectionName) => {
  const idCounter = await idCounterModel.findOneAndUpdate(
    { collectionName: collectionName },
    { $inc: { currentId: 1 } },
    { new: true, upsert: true }
  );
  return idCounter.currentId;
};

module.exports = {
  getNextSequentialId,
};

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("../../config/config");

// Get current app serving host point
const getFileUrlPath = (folderName) => {
  // return `${config.app.protocol}://${config.app.host}:${config.app.port}/assets/${folderName}`;
  if (config.app.host == "localhost") {
    return `${config.app.protocol}://${config.app.host}:${config.app.port}/assets/${folderName}`;
  } else {
    return `${config.app.protocol}://${config.app.host}/assets/${folderName}`;
  }
};

// Function to encode a given string into a mongoose ObjectId
const encodeStrToObjectId = (id) => {
  return new mongoose.Types.ObjectId(id);
};

// Function to decode a given string into a mongoose ObjectId
const decodeObjectId = (id) => {
  return new mongoose.Types.ObjectId(id);
};

// Function to generate a JWT token
const generateToken = (payload) => {
  // const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
  //   expiresIn: "1m",
  // });
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
  return token;
};

const getSumOfOneKeyFromArray = (data, key) => {
  return data.reduce((sum, item) => sum + item[key], 0);
};

const getPopulatedDataWithDiffName = (data, oldKey, newKey) => {
  let sendData = { ...data.toObject() };
  sendData[newKey] = data[oldKey];
  delete sendData[oldKey];
  return sendData;
};

module.exports = {
  encodeStrToObjectId,
  getFileUrlPath,
  decodeObjectId,
  generateToken,
  getSumOfOneKeyFromArray,
  getPopulatedDataWithDiffName,
};

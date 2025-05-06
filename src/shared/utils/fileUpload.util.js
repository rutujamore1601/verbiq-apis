const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Function to create the folder if it does not exist
const createFolderIfNotExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Function to configure multer for image upload with dynamic folder name
const configureMulter = (folderName) => {
  const folderPath = path.join("uploads", folderName);
  createFolderIfNotExists(folderPath);

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, folderPath);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  return multer({ storage: storage });
};

// Middleware function to handle file upload with dynamic folder name
const uploadFile = (folderName, keyName) => {
  const upload = configureMulter(folderName);

  return (req, res, next) => {
    upload.single(keyName)(req, res, function (err) {
      if (err) {
        return res.status(500).send({ message: "Error uploading image." });
      }

      if (!req.file) {
        return res.status(400).send({ message: "No image file provided." });
      }

      req.body[keyName] = req.file.filename;
      next();
    });
  };
};

const multipleUploadFile = (folderName, keyName) => {
  const upload = configureMulter(folderName);

  return (req, res, next) => {
    upload.array(keyName)(req, res, function (err) {
      if (err) {
        return res.status(500).send({ message: "Error uploading images." });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).send({ message: "No image files provided." });
      }

      // Assuming each uploaded file will be appended to an array in req.body[keyName]
      req.body[keyName] = req.files.map((file) => file.filename);
      next();
    });
  };
};

module.exports = { uploadFile, multipleUploadFile };

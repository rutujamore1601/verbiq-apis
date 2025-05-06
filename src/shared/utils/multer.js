const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const maxSize = 2 * 1024 * 1024;

const docsUpload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
});

module.exports = docsUpload;

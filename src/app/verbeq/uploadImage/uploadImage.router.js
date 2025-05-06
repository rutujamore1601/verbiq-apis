const router = require("express").Router();
const uploadImageController = require("./uploadImage.controller");

// Create Operation - Create uploadImage
router.post("/createUploadImage", uploadImageController.createUploadImage);
router.post("/multipleUploadImage", uploadImageController.multipleUploadImage);

// Read Operation - Get all uploadImage
router.get("/getAllUploadImage", uploadImageController.getAllUploadImage);

// Read Operation - Get all uploadImage by Id
router.get(
  "/getAllUploadImageById/:id",
  uploadImageController.getAllUploadImageById
);

// Read Operation - Get a single uploadImage by Id
router.get("/getUploadImageById/:id", uploadImageController.getUploadImageById);

// Update Operation - Update uploadImage
router.put("/updateUploadImage/:id", uploadImageController.updateUploadImage);

// Delete Operation - Delete uploadImage
router.delete(
  "/deleteUploadImage/:id",
  uploadImageController.deleteUploadImage
);

module.exports = router;

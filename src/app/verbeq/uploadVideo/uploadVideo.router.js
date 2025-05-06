
const router = require("express").Router();
const uploadVideoController = require('./uploadVideo.controller');

// Create Operation - Create uploadVideo
router.post('/createUploadVideo', uploadVideoController.createUploadVideo);

router.post('/multipleUploadVideo', uploadVideoController.multipleUploadVideo);

// Read Operation - Get all uploadVideo
router.get('/getAllUploadVideo', uploadVideoController.getAllUploadVideo);

// Read Operation - Get all uploadVideo by Id 
router.get("/getAllUploadVideoById/:id", uploadVideoController.getAllUploadVideoById);

// Read Operation - Get a single uploadVideo by Id
router.get('/getUploadVideoById/:id', uploadVideoController.getUploadVideoById);

// Update Operation - Update uploadVideo
router.put('/updateUploadVideo/:id', uploadVideoController.updateUploadVideo);

// Delete Operation - Delete uploadVideo
router.delete('/deleteUploadVideo/:id', uploadVideoController.deleteUploadVideo);

module.exports = router;

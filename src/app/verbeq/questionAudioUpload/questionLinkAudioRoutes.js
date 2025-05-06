const express = require("express");
const { audioUpload, uploadQaudio, uploadProfile, questionAudioUpload } = require("./questionLinkController");

const router = express.Router();

router.post("/audioUpload", uploadQaudio.single("file"), audioUpload);
router.post("/questionAudioUpload", uploadProfile.single("file"), questionAudioUpload);

module.exports = router;

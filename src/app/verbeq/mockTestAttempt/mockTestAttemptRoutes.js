const express = require("express");
const multer = require('multer');
const upload = multer();
const {
  updateTestAttempt,
  createMockTestAttempt,
  getAllMockTestAttempt,
  getMockTestAttemptById,
  updateMockTestAttemptById,
  deleteMockTestAttemptById,
  getMockTestAttemptByIdtest,
  submitteQuestionAnswer,
  sendEvaluationRequest,
  closeActiveSession,
  sendAnalyzeEvaluationRequest
} = require("./mockTestAttemptController");

const router = express.Router();

router.post("/updateTestAttempt", updateTestAttempt);
router.post("/createMockTestAttempt", createMockTestAttempt);
router.get("/getAllMockTestAttempt", getAllMockTestAttempt);
router.get("/getMockTestAttemptByIdtest/:userId", getMockTestAttemptByIdtest);
router.get("/getMockTestAttemptById/:userId", getMockTestAttemptById);
router.post('/submitteQuestionAnswer', submitteQuestionAnswer);
router.post('/sendEvaluationRequest', sendEvaluationRequest);
router.post('/sendAnalyzeEvaluationRequest', upload.none(), sendAnalyzeEvaluationRequest);
router.post('/closeActiveSession', closeActiveSession);

router.put("/updateMockTestAttemptById/:id", updateMockTestAttemptById);
router.delete("/deleteMockTestAttemptById/:id", deleteMockTestAttemptById);

module.exports = router;


const router = require("express").Router();
const questionsController = require('./questions.controller');

// Create Operation - Create questions
router.post('/createQuestions', questionsController.createQuestions);

// Read Operation - Get all questions
router.get('/getAllQuestions', questionsController.getAllQuestions);

// Read Operation - Get all questions by Id 
router.get("/getAllQuestionsById/:typeId/:languageName", questionsController.getAllQuestionsById);

// Read Operation - Get a single questions by Id
router.get('/getQuestionsById/:typeId/:languageName', questionsController.getQuestionsById);
router.get('/getNextQuestionsById/:typeId/:languageName/:userId', questionsController.getNextQuestionsById);
router.get('/getNextQuestionsById2/:typeId/:languageName/:userId/:sessionId', questionsController.getNextQuestionsById2);
router.get('/getTestQuestionsById/:typeId/:languageName/:userId', questionsController.getTestQuestionsById);

// Update Operation - Update questions
router.put('/updateQuestions/:id', questionsController.updateQuestions);

// Delete Operation - Delete questions
router.delete('/deleteQuestions/:id', questionsController.deleteQuestions);
router.post('/submitteQuestionAnswer', questionsController.submitteQuestionAnswer);

module.exports = router;

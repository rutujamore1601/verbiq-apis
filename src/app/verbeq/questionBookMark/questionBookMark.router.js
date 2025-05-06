
const router = require("express").Router();
const questionBookMarkController = require('./questionBookMark.controller');

// Create Operation - Create questionBookMark
router.post('/createQuestionBookMark', questionBookMarkController.createQuestionBookMark);

// Read Operation - Get all questionBookMark
router.get('/getAllQuestionBookMark', questionBookMarkController.getAllQuestionBookMark);

// Read Operation - Get all questionBookMark by Id 
router.get("/getAllQuestionBookMarkById/:id", questionBookMarkController.getAllQuestionBookMarkById);

// Read Operation - Get a single questionBookMark by Id
router.get('/getQuestionBookMarkById/:id', questionBookMarkController.getQuestionBookMarkById);

// Update Operation - Update questionBookMark
router.put('/updateQuestionBookMark/:id', questionBookMarkController.updateQuestionBookMark);

// Delete Operation - Delete questionBookMark
router.delete('/deleteQuestionBookMark/:id', questionBookMarkController.deleteQuestionBookMark);

module.exports = router;

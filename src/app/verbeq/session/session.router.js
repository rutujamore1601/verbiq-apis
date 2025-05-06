
const router = require("express").Router();
const sessionController = require('./session.controller');

// Create Operation - Create session
router.post('/createSession', sessionController.createSession);

// Read Operation - Get all session
router.get('/getAllSession', sessionController.getAllSession);

// Read Operation - Get all session by Id 
router.get("/getAllSessionById/:id", sessionController.getAllSessionById);

// Read Operation - Get a single session by Id
router.get('/getSessionById/:id/:userId', sessionController.getSessionById);

// Update Operation - Update session
router.put('/updateSession/:id', sessionController.updateSession);

// Delete Operation - Delete session
router.delete('/deleteSession/:id', sessionController.deleteSession);

module.exports = router;

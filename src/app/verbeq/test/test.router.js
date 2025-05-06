
const router = require("express").Router();
const testController = require('./test.controller');

// Create Operation - Create test
router.post('/createTest', testController.createTest);

// Read Operation - Get all test
router.get('/getAllTest', testController.getAllTest);

// Read Operation - Get all test by Id 
router.get("/getAllTestById/:id", testController.getAllTestById);

router.get("/getAllTestByClassId/:classId", testController.getAllTestByClassId);

// Read Operation - Get a single test by Id
router.get('/getTestById/:id', testController.getTestById);

// Update Operation - Update test
router.put('/updateTest/:id', testController.updateTest);

// Delete Operation - Delete test
router.delete('/deleteTest/:id', testController.deleteTest);

module.exports = router;

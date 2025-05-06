
const router = require("express").Router();
const registrationForScholershipController = require('./registrationForScholership.controller');

// Create Operation - Create registrationForScholership
router.post('/createRegistrationFeeForScholership', registrationForScholershipController.createRegistrationFeeForScholership);

// Read Operation - Get all registrationForScholership
router.get('/getAllRegistrationForScholership', registrationForScholershipController.getAllRegistrationForScholership);

// Read Operation - Get all registrationForScholership by Id 
router.get("/getAllRegistrationForScholershipById/:id", registrationForScholershipController.getAllRegistrationForScholershipById);

// Read Operation - Get a single registrationForScholership by Id
router.get('/getRegistrationForScholershipById/:id', registrationForScholershipController.getRegistrationForScholershipById);

// Read Operation - Get a single getMyEnrollmentByClassId by Id
router.get('/getMyEnrollmentByClassId/:classId/:userId', registrationForScholershipController.getMyEnrollmentByClassId);

// Update Operation - Update registrationForScholership
router.put('/updateRegistrationForScholership/:id', registrationForScholershipController.updateRegistrationForScholership);

// Delete Operation - Delete registrationForScholership
router.delete('/deleteRegistrationForScholership/:id', registrationForScholershipController.deleteRegistrationForScholership);

module.exports = router;


const router = require("express").Router();
const typesController = require('./types.controller');

// Create Operation - Create types
router.post('/createTypes', typesController.createTypes);

// Read Operation - Get all types
router.get('/getAllTypes', typesController.getAllTypes);

// Read Operation - Get all types by Id 
router.get("/getAllTypesById/:id", typesController.getAllTypesById);

// Read Operation - Get a single types by Id
router.get('/getTypesById/:id', typesController.getTypesById);

// Update Operation - Update types
router.put('/updateTypes/:id', typesController.updateTypes);

// Delete Operation - Delete types
router.delete('/deleteTypes/:id', typesController.deleteTypes);

module.exports = router;

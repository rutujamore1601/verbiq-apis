
const router = require("express").Router();
const mappingDataController = require('./mappingData.controller');

// Create Operation - Create mappingData
router.post('/createMappingData', mappingDataController.createMappingData);

// Read Operation - Get all mappingData
router.get('/getAllMappingData', mappingDataController.getAllMappingData);

// Read Operation - Get all mappingData by Id 
router.get("/getAllMappingDataById/:id", mappingDataController.getAllMappingDataById);

// Read Operation - Get a single mappingData by Id
router.get('/getMappingDataById/:id', mappingDataController.getMappingDataById);

// Update Operation - Update mappingData
router.put('/updateMappingData/:id', mappingDataController.updateMappingData);

// Delete Operation - Delete mappingData
router.delete('/deleteMappingData/:id', mappingDataController.deleteMappingData);

module.exports = router;

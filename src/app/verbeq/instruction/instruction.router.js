
const router = require("express").Router();
const instructionController = require('./instruction.controller');

// Create Operation - Create instruction
router.post('/createInstruction', instructionController.createInstruction);

// Read Operation - Get all instruction
router.get('/getAllInstruction', instructionController.getAllInstruction);

// Read Operation - Get all instruction by Id 
router.get("/getAllInstructionById/:id", instructionController.getAllInstructionById);

// Read Operation - Get a single instruction by Id
router.get('/getInstructionById/:typeId', instructionController.getInstructionById);

// Update Operation - Update instruction
router.put('/updateInstruction/:id', instructionController.updateInstruction);

// Delete Operation - Delete instruction
router.delete('/deleteInstruction/:id', instructionController.deleteInstruction);

module.exports = router;

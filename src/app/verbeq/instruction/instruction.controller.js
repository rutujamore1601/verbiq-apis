
const instructionModel = require('./instruction.model');

// Create Operation - Create instruction
const createInstruction = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const instruction = new instructionModel(req.body);
  instruction
    .save()
    .then((data) => {
      res.status(200).send({
        data: data,
        dataCount: data.length,
        message: "instruction created successfully!",
        success: true,
        statusCode: 200,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the instruction.",
      });
    });
};

// Read Operation - Get all instruction
const getAllInstruction = (req, res) => {
  instructionModel.find()
    .then((data) => {
      if (data.length > 0) {
        res.status(200).send({
          data: data,
          dataCount: data.length,
          message: "instruction fetch successfully!",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(200).send({
          data: [],
          dataCount: data.length,
          message: "instruction not found!",
          success: false,
          statusCode: 200,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while Retrieve the instruction.",
      });
    });
};

// Read Operation - Get all instruction by Id 
const getAllInstructionById = (req, res) => {
  const typeId = req.params.typeId;
  const condition = { _id: id };

  instructionModel.find(condition)
    .then((data) => {
      if (data.length > 0) {
        res.status(200).send({
          data: data,
          dataCount: data.length,
          message: "instruction fetch successfully!",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(200).send({
          data: [],
          dataCount: data.length,
          message: "instruction not found!",
          success: false,
          statusCode: 200,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while Retrieve the instruction.",
      });
    });
};

// Read Operation - Get a single instruction by Id
const getInstructionById = (req, res) => {
  const typeId = req.params.typeId;
  instructionModel.findOne({ typeId }).populate('typeId')
    .then((data) => {
      if (data) {
        res.status(200).send({
          data: data,
          dataCount: data.length,
          message: "instruction fetch successfully!",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(200).send({
          data: {},
          dataCount: 0,
          message: 'instruction not found with ID=' + typeId,
          status: false,
          statusCode: 200,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while Retrieve the instruction.",
      });
    });
};

// Update Operation - Update instruction
const updateInstruction = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  instructionModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (data) {
        res.status(200).send({
          message: "instruction was updated successfully.",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(404).send({
          message: 'Cannot update instruction with order ID=' + id + '. Maybe instruction was not found!',
          success: false,
          statusCode: 404,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating instruction with ID=" + id,
      });
    });
};


// Delete Operation - Delete instruction
const deleteInstruction = (req, res) => {
  const id = req.params.id;

  instructionModel.findByIdAndDelete(id)
    .then((data) => {
      if (data) {
        res.status(200).send({
          message: "instruction was deleted successfully!",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(404).send({
          message: 'Cannot delete instruction with ID=' + id + '. Maybe instruction was not found!',
          success: false,
          statusCode: 404,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};

module.exports = {
  createInstruction,
  getAllInstruction,
  getAllInstructionById,
  getInstructionById,
  updateInstruction,
  deleteInstruction
};

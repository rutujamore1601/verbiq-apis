
const typesModel = require('./types.model');

  // Create Operation - Create types
  const createTypes = (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
  
    const types = new typesModel(req.body);
    types
      .save()
      .then((data) => {
        res.status(200).send({
          data: data,
          dataCount: data.length,
          message: "types created successfully!",
          success: true,
          statusCode: 200,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the types.",
        });
      });
  };

  // Read Operation - Get all types
  const getAllTypes = (req, res) => {
    typesModel.find()
      .then((data) => {
        if (data.length > 0) {
          res.status(200).send({
            data: data,
            dataCount: data.length,
            message: "types fetch successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(200).send({
            data: [],
            dataCount: data.length,
            message: "types not found!",
            success: false,
            statusCode: 200,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while Retrieve the types.",
        });
      });
  };

  // Read Operation - Get all types by Id 
  const getAllTypesById  = (req, res) => {
    const id = req.params.id;
    const condition = { _id: id};

    typesModel.find(condition)
      .then((data) => {
        if (data.length > 0) {
          res.status(200).send({
            data: data,
            dataCount: data.length,
            message: "types fetch successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(200).send({
            data: [],
            dataCount: data.length,
            message: "types not found!",
            success: false,
            statusCode: 200,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while Retrieve the types.",
        });
      });
  };

  // Read Operation - Get a single types by Id
  const getTypesById = (req, res) => {
    const id = req.params.id;
    typesModel.findById(id)
      .then((data) => {
        if (data) {
          res.status(200).send({
            data: data,
            dataCount: data.length,
            message: "types fetch successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(200).send({
            data: {},
            dataCount: 0,
            message: 'types not found with ID=' + id,
            status: false,
            statusCode: 200,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while Retrieve the types.",
        });
      });
  };

  // Update Operation - Update types
 const updateTypes = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  typesModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (data) {
        res.status(200).send({
          message: "types was updated successfully.",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(404).send({
          message: 'Cannot update types with order ID=' + id + '. Maybe types was not found!',
          success: false,
          statusCode: 404,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating types with ID=" + id,
      });
    });
};


// Delete Operation - Delete types
  const deleteTypes = (req, res) => {
    const id = req.params.id;
  
    typesModel.findByIdAndDelete(id)
      .then((data) => {
        if (data) {
          res.status(200).send({
            message: "types was deleted successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(404).send({
            message: 'Cannot delete types with ID=' + id + '. Maybe types was not found!',
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
  createTypes,
  getAllTypes,
  getAllTypesById,
  getTypesById,
  updateTypes,
  deleteTypes
};

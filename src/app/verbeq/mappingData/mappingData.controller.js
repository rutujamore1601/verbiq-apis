
const mappingDataModel = require('./mappingData.model');

  // Create Operation - Create mappingData
  const createMappingData = async (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
  
    const { userId, certificateId, shedulId } = req.body;
  
    try {
      // Check if an examId exists for the given certificateId
      const mockTest = await mockTestModel.findOne({ certificateId });
      
      let examId = null;
      if (mockTest) {
        examId = mockTest._id;
      }
  
      // Create a new mappingData instance
      const mappingData = new mappingDataModel({
        userId,
        examId,
        certificateId,
        shedulId,
      });
  
      // Save the mappingData to the database
      const data = await mappingData.save();
  
      res.status(200).send({
        data: data,
        dataCount: data.length,
        message: "mappingData created successfully!",
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the mappingData.",
      });
    }
  };

  // Read Operation - Get all mappingData
  const getAllMappingData = (req, res) => {
    mappingDataModel.find().populate({path:"userId"}).populate({path:"examId"}).populate({path:"certificateId"}).populate({path:"shedulId"})
      .then((data) => {
        if (data.length > 0) {
          res.status(200).send({
            data: data,
            dataCount: data.length,
            message: "mappingData fetch successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(200).send({
            data: [],
            dataCount: data.length,
            message: "mappingData not found!",
            success: false,
            statusCode: 200,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while Retrieve the mappingData.",
        });
      });
  };

  // Read Operation - Get all mappingData by Id 
  const getAllMappingDataById  = (req, res) => {
    const id = req.params.id;
    const condition = { _id: id};

    mappingDataModel.find(condition)
      .then((data) => {
        if (data.length > 0) {
          res.status(200).send({
            data: data,
            dataCount: data.length,
            message: "mappingData fetch successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(200).send({
            data: [],
            dataCount: data.length,
            message: "mappingData not found!",
            success: false,
            statusCode: 200,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while Retrieve the mappingData.",
        });
      });
  };

  // Read Operation - Get a single mappingData by Id
  const getMappingDataById = (req, res) => {
    const id = req.params.id;
    mappingDataModel.findById(id)
      .then((data) => {
        if (data) {
          res.status(200).send({
            data: data,
            dataCount: data.length,
            message: "mappingData fetch successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(200).send({
            data: {},
            dataCount: 0,
            message: 'mappingData not found with ID=' + id,
            status: false,
            statusCode: 200,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while Retrieve the mappingData.",
        });
      });
  };

  // Update Operation - Update mappingData
 const updateMappingData = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  mappingDataModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (data) {
        res.status(200).send({
          message: "mappingData was updated successfully.",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(404).send({
          message: 'Cannot update mappingData with order ID=' + id + '. Maybe mappingData was not found!',
          success: false,
          statusCode: 404,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating mappingData with ID=" + id,
      });
    });
};


// Delete Operation - Delete mappingData
  const deleteMappingData = (req, res) => {
    const id = req.params.id;
  
    mappingDataModel.findByIdAndDelete(id)
      .then((data) => {
        if (data) {
          res.status(200).send({
            message: "mappingData was deleted successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(404).send({
            message: 'Cannot delete mappingData with ID=' + id + '. Maybe mappingData was not found!',
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
  createMappingData,
  getAllMappingData,
  getAllMappingDataById,
  getMappingDataById,
  updateMappingData,
  deleteMappingData
};

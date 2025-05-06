
const testModel = require('./test.model');
const QuestionModel = require('./../questions/questions.model');
const mongoose = require('mongoose');

  // Create Operation - Create test
  const createTest = async (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
  
    try {
      const { classId } = req.body;
  
      const questions = await QuestionModel.find({ 'classId': { $in: classId } });
  
      const test = new testModel({
        ...req.body,
        questions,
      });
  
      const data = await test.save();
  
      res.status(200).send({
        data,
        dataCount: 1,
        message: "Test created successfully!",
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the test.",
      });
    }
  };
  
  // Read Operation - Get all test
  const getAllTest = (req, res) => {
    testModel.find()
    .populate({
      path: "questions",
    })
      .then((data) => {
        if (data.length > 0) {
          res.status(200).send({
            data: data,
            dataCount: data.length,
            message: "test fetch successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(200).send({
            data: [],
            dataCount: data.length,
            message: "test not found!",
            success: false,
            statusCode: 200,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while Retrieve the test.",
        });
      });
  };

  // Read Operation - Get all test by Id 
  const getAllTestById  = (req, res) => {
    const id = req.params.id;
    const condition = { _id: id};

    testModel.find(condition)
      .then((data) => {
        if (data.length > 0) {
          res.status(200).send({
            data: data,
            dataCount: data.length,
            message: "test fetch successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(200).send({
            data: [],
            dataCount: data.length,
            message: "test not found!",
            success: false,
            statusCode: 200,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while Retrieve the test.",
        });
      });
  };

  // Read Operation - Get all test by Id 
  const getAllTestByClassId = (req, res) => {
    const condition = { classId: { $exists: true, $ne: [] } };
  
    testModel.find(condition)
      .then((data) => {
        if (data.length > 0) {
          res.status(200).send({
            data: data,
            dataCount: data.length,
            message: "Tests fetched successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(200).send({
            data: [],
            dataCount: data.length,
            message: "Tests not found!",
            success: false,
            statusCode: 200,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving the tests.",
        });
      });
  };

  // Read Operation - Get a single test by Id
  const getTestById = (req, res) => {
    const id = req.params.id;
    testModel.findById(id)
      .then((data) => {
        if (data) {
          res.status(200).send({
            data: data,
            dataCount: data.length,
            message: "test fetch successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(200).send({
            data: {},
            dataCount: 0,
            message: 'test not found with ID=' + id,
            status: false,
            statusCode: 200,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while Retrieve the test.",
        });
      });
  };

  // Update Operation - Update test
  const updateTest = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!",
      });
    }

    const id = req.params.id;

    testModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
        if (data) {
          res.status(200).send({
            message: "test was updated successfully.",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(404).send({
            message: 'Cannot update test with order ID=' + id + '. Maybe test was not found!',
            success: false,
            statusCode: 404,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating test with ID=" + id,
        });
      });
  };

  // Delete Operation - Delete test
  const deleteTest = (req, res) => {
    const id = req.params.id;
  
    testModel.findByIdAndDelete(id)
      .then((data) => {
        if (data) {
          res.status(200).send({
            message: "test was deleted successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(404).send({
            message: 'Cannot delete test with ID=' + id + '. Maybe test was not found!',
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
  createTest,
  getAllTest,
  getAllTestById,
  getTestById,
  updateTest,
  deleteTest,
  getAllTestByClassId
};

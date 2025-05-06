const registrationForScholershipModel = require("./registrationForScholership.model");
const registrationForScholershipPaymentModel = require("./../registrationForScholershipPayment/registrationForScholershipPayment.model");
const mongoose = require("mongoose");

// Create Operation - Create registrationForScholership
const createRegistrationFeeForScholership = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const registrationForScholership = new registrationForScholershipModel(
    req.body
  );
  registrationForScholership
    .save()
    .then((data) => {
      res.status(200).send({
        data: data,
        dataCount: data.length,
        message: "registrationForScholership created successfully!",
        success: true,
        statusCode: 200,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the registrationForScholership.",
      });
    });
};

// Read Operation - Get all registrationForScholership
const getAllRegistrationForScholership = (req, res) => {
  registrationForScholershipModel
    .find()
    .then((data) => {
      if (data.length > 0) {
        res.status(200).send({
          data: data,
          dataCount: data.length,
          message: "registrationForScholership fetch successfully!",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(200).send({
          data: [],
          dataCount: data.length,
          message: "registrationForScholership not found!",
          success: false,
          statusCode: 200,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while Retrieve the registrationForScholership.",
      });
    });
};

// Read Operation - Get all registrationForScholership by Id
const getAllRegistrationForScholershipById = (req, res) => {
  const id = req.params.id;
  const condition = { _id: id };

  registrationForScholershipModel
    .find(condition)
    .then((data) => {
      if (data.length > 0) {
        res.status(200).send({
          data: data,
          dataCount: data.length,
          message: "registrationForScholership fetch successfully!",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(200).send({
          data: [],
          dataCount: data.length,
          message: "registrationForScholership not found!",
          success: false,
          statusCode: 200,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while Retrieve the registrationForScholership.",
      });
    });
};

// Read Operation - Get a single registrationForScholership by Id
const getRegistrationForScholershipById = (req, res) => {
  const id = req.params.id;
  registrationForScholershipModel
    .findById(id)
    .then((data) => {
      if (data) {
        res.status(200).send({
          data: data,
          dataCount: data.length,
          message: "registrationForScholership fetch successfully!",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(200).send({
          data: {},
          dataCount: 0,
          message: "registrationForScholership not found with ID=" + id,
          status: false,
          statusCode: 200,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while Retrieve the registrationForScholership.",
      });
    });
};

// Read Operation - Get a single registrationForScholership by Id
const getMyEnrollmentByClassId = (req, res) => {
  const classId = req.params.classId;
  const userId = req.params.userId;

  registrationForScholershipModel
    .findOne({ classId })
    .lean()
    .then((data) => {
      registrationForScholershipPaymentModel
        .findOne({
          $and: [{ bsatExamRegistrationId: data._id }, { userId: userId }],
        })
        .then((payInfo) => {
          if (payInfo) {
            data.isPurchased = true;
          } else {
            data.isPurchased = false;
          }
          if (data) {
            res.status(200).send({
              data: data,
              dataCount: 1,
              message: "registrationForScholership fetched successfully!",
              success: true,
              statusCode: 200,
            });
          } else {
            res.status(200).send({
              data: null,
              dataCount: 0,
              message:
                "registrationForScholership not found with classId=" + classId,
              success: false,
              statusCode: 200,
            });
          }
        });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving the registrationForScholership.",
        success: false,
        statusCode: 500,
      });
    });
};

// Update Operation - Update registrationForScholership
const updateRegistrationForScholership = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  registrationForScholershipModel
    .findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (data) {
        res.status(200).send({
          message: "registrationForScholership was updated successfully.",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(404).send({
          message:
            "Cannot update registrationForScholership with order ID=" +
            id +
            ". Maybe registrationForScholership was not found!",
          success: false,
          statusCode: 404,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating registrationForScholership with ID=" + id,
      });
    });
};

// Delete Operation - Delete registrationForScholership
const deleteRegistrationForScholership = (req, res) => {
  const id = req.params.id;

  registrationForScholershipModel
    .findByIdAndDelete(id)
    .then((data) => {
      if (data) {
        res.status(200).send({
          message: "registrationForScholership was deleted successfully!",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(404).send({
          message:
            "Cannot delete registrationForScholership with ID=" +
            id +
            ". Maybe registrationForScholership was not found!",
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
  createRegistrationFeeForScholership,
  getAllRegistrationForScholership,
  getAllRegistrationForScholershipById,
  getRegistrationForScholershipById,
  updateRegistrationForScholership,
  deleteRegistrationForScholership,
  getMyEnrollmentByClassId,
};

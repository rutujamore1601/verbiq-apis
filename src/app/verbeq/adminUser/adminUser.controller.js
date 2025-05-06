const adminUserModel = require("./adminUser.model");

// Create Operation - Create adminUser
const createAdminUser = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const adminUser = new adminUserModel(req.body);
  adminUser
    .save()
    .then((data) => {
      res.status(200).send({
        data: data,
        dataCount: data.length,
        message: "adminUser created successfully!",
        success: true,
        statusCode: 200,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the adminUser.",
      });
    });
};

// create Operation - login
const login = (req, res) => {
  const { userNname, password } = req.body;
  console.log("userNname", userNname);

  if (!userNname || !password) {
    res.status(400).send({ message: "userNname and password are required." });
    return;
  }

  adminUserModel.findOne({ userNname, password }, (err, user) => {
    if (err) {
      res.status(500).send({ message: "Internal server error." });
      return;
    }

    if (user) {
      res.status(200).send({
        data: user,
        message: "Login successful!",
        success: true,
        statusCode: 200,
      });
    } else {
      res.status(400).send({
        data: user,
        message: "Login failed. Invalid userNname or password.",
        success: false,
        statusCode: 400,
      });
    }
  });
};

// Read Operation - Get all adminUser
const getAllAdminUser = (req, res) => {
  adminUserModel
    .find()
    .then((data) => {
      if (data.length > 0) {
        res.status(200).send({
          data: data,
          dataCount: data.length,
          message: "adminUser fetch successfully!",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(200).send({
          data: [],
          dataCount: data.length,
          message: "adminUser not found!",
          success: false,
          statusCode: 200,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while Retrieve the adminUser.",
      });
    });
};

// Read Operation - Get all adminUser by Id
const getAllAdminUserById = (req, res) => {
  const id = req.params.id;
  const condition = { _id: id };

  adminUserModel
    .find(condition)
    .then((data) => {
      if (data.length > 0) {
        res.status(200).send({
          data: data,
          dataCount: data.length,
          message: "adminUser fetch successfully!",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(200).send({
          data: [],
          dataCount: data.length,
          message: "adminUser not found!",
          success: false,
          statusCode: 200,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while Retrieve the adminUser.",
      });
    });
};

// Read Operation - Get a single adminUser by Id
const getAdminUserById = (req, res) => {
  const id = req.params.id;
  adminUserModel
    .findById(id)
    .then((data) => {
      if (data) {
        res.status(200).send({
          data: data,
          dataCount: data.length,
          message: "adminUser fetch successfully!",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(200).send({
          data: {},
          dataCount: 0,
          message: "adminUser not found with ID=" + id,
          status: false,
          statusCode: 200,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while Retrieve the adminUser.",
      });
    });
};

// Update Operation - Update adminUser
const updateAdminUser = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  adminUserModel
    .findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (data) {
        res.status(200).send({
          message: "adminUser was updated successfully.",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(404).send({
          message:
            "Cannot update adminUser with order ID=" +
            id +
            ". Maybe adminUser was not found!",
          success: false,
          statusCode: 404,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating adminUser with ID=" + id,
      });
    });
};

// Delete Operation - Delete adminUser
const deleteAdminUser = (req, res) => {
  const id = req.params.id;

  adminUserModel
    .findByIdAndDelete(id)
    .then((data) => {
      if (data) {
        res.status(200).send({
          message: "adminUser was deleted successfully!",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(404).send({
          message:
            "Cannot delete adminUser with ID=" +
            id +
            ". Maybe adminUser was not found!",
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
  createAdminUser,
  getAllAdminUser,
  getAllAdminUserById,
  getAdminUserById,
  updateAdminUser,
  deleteAdminUser,
  login
};

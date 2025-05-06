
const settingModel = require('./setting.model');

  // Create Operation - Create setting
  const createSetting = (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
  
    const setting = new settingModel(req.body);
    setting
      .save()
      .then((data) => {
        res.status(200).send({
          data: data,
          dataCount: data.length,
          message: "setting created successfully!",
          success: true,
          statusCode: 200,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the setting.",
        });
      });
  };

  // Read Operation - Get all setting
  const getAllSetting = (req, res) => {
    settingModel.find().populate('settingTypeId')
      .then((data) => {
        if (data.length > 0) {
          res.status(200).send({
            data: data,
            dataCount: data.length,
            message: "setting fetch successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(200).send({
            data: [],
            dataCount: data.length,
            message: "setting not found!",
            success: false,
            statusCode: 200,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while Retrieve the setting.",
        });
      });
  };

  // Read Operation - Get all setting by Id 
  const getAllSettingById  = (req, res) => {
    const id = req.params.id;
    const condition = { _id: id};

    settingModel.find(condition).populate('settingTypeId')
      .then((data) => {
        if (data.length > 0) {
          res.status(200).send({
            data: data,
            dataCount: data.length,
            message: "setting fetch successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(200).send({
            data: [],
            dataCount: data.length,
            message: "setting not found!",
            success: false,
            statusCode: 200,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while Retrieve the setting.",
        });
      });
  };

  // Read Operation - Get a single setting by Id
  const getSettingById = (req, res) => {
    const id = req.params.id;
    settingModel.findById(id).populate('settingTypeId')
      .then((data) => {
        if (data) {
          res.status(200).send({
            data: data,
            dataCount: data.length,
            message: "setting fetch successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(200).send({
            data: {},
            dataCount: 0,
            message: 'setting not found with ID=' + id,
            status: false,
            statusCode: 200,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while Retrieve the setting.",
        });
      });
  };

  // Update Operation - Update setting
  const updateSetting = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  settingModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (data) {
        res.status(200).send({
          message: "setting was updated successfully.",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(404).send({
          message: 'Cannot update setting with order ID=' + id + '. Maybe setting was not found!',
          success: false,
          statusCode: 404,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating setting with ID=" + id,
      });
    });
  };

  // Delete Operation - Delete setting
  const deleteSetting = (req, res) => {
    const id = req.params.id;
  
    settingModel.findByIdAndDelete(id)
      .then((data) => {
        if (data) {
          res.status(200).send({
            message: "setting was deleted successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(404).send({
            message: 'Cannot delete setting with ID=' + id + '. Maybe setting was not found!',
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
  createSetting,
  getAllSetting,
  getAllSettingById,
  getSettingById,
  updateSetting,
  deleteSetting
};

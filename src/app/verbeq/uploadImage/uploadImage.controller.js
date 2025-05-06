const uploadImageModel = require("./uploadImage.model");
const commonUtil = require("../../../shared/utils/common.util");
const fileUploadUtil = require("../../../shared/utils/fileUpload.util");

// Create Operation - Create uploadImage
const createUploadImage = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const folderName = "uploadImg";

  fileUploadUtil.uploadFile(folderName, "img")(req, res, async () => {
    req.body.img = `${commonUtil.getFileUrlPath(folderName)}/${req.body.img}`;

    const uploadImage = new uploadImageModel(req.body);
    uploadImage
      .save()
      .then((data) => {
        res.status(200).send({
          data: data,
          dataCount: data.length,
          message: "uploadImage created successfully!",
          success: true,
          statusCode: 200,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while creating the uploadImage.",
        });
      });
  });
};

const multipleUploadImage = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const folderName = "uploadImg";

  fileUploadUtil.multipleUploadFile(folderName, "multipleImg")(
    req,
    res,
    async () => {
      const uploadedImageUrls = req.body.multipleImg.map((imageName) => {
        return `${commonUtil.getFileUrlPath(folderName)}/${imageName}`;
      });

      const uploadImage = new uploadImageModel({
        multipleImg: uploadedImageUrls,
      });

      uploadImage
        .save()
        .then((data) => {
          res.status(200).send({
            data: {
              multipleImg: data.multipleImg,
              _id: data._id,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              __v: data.__v,
            },
            dataCount: data.multipleImg.length,
            message: "uploadImage created successfully!",
            success: true,
            statusCode: 200,
          });
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while creating the uploadImage.",
          });
        });
    }
  );
};

// Read Operation - Get all uploadImage
const getAllUploadImage = (req, res) => {
  uploadImageModel
    .find()
    .then((data) => {
      if (data.length > 0) {
        res.status(200).send({
          data: data,
          dataCount: data.length,
          message: "uploadImage fetch successfully!",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(200).send({
          data: [],
          dataCount: data.length,
          message: "uploadImage not found!",
          success: false,
          statusCode: 200,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while Retrieve the uploadImage.",
      });
    });
};

// Read Operation - Get all uploadImage by Id
const getAllUploadImageById = (req, res) => {
  const id = req.params.id;
  const condition = { _id: id };

  uploadImageModel
    .find(condition)
    .then((data) => {
      if (data.length > 0) {
        res.status(200).send({
          data: data,
          dataCount: data.length,
          message: "uploadImage fetch successfully!",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(200).send({
          data: [],
          dataCount: data.length,
          message: "uploadImage not found!",
          success: false,
          statusCode: 200,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while Retrieve the uploadImage.",
      });
    });
};

// Read Operation - Get a single uploadImage by Id
const getUploadImageById = (req, res) => {
  const id = req.params.id;
  uploadImageModel
    .findById(id)
    .then((data) => {
      if (data) {
        res.status(200).send({
          data: data,
          dataCount: data.length,
          message: "uploadImage fetch successfully!",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(200).send({
          data: {},
          dataCount: 0,
          message: "uploadImage not found with ID=" + id,
          status: false,
          statusCode: 200,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while Retrieve the uploadImage.",
      });
    });
};

// Update Operation - Update uploadImage
const updateUploadImage = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  uploadImageModel
    .findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (data) {
        res.status(200).send({
          message: "uploadImage was updated successfully.",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(404).send({
          message:
            "Cannot update uploadImage with order ID=" +
            id +
            ". Maybe uploadImage was not found!",
          success: false,
          statusCode: 404,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating uploadImage with ID=" + id,
      });
    });
};

// Delete Operation - Delete uploadImage
const deleteUploadImage = (req, res) => {
  const id = req.params.id;

  uploadImageModel
    .findByIdAndDelete(id)
    .then((data) => {
      if (data) {
        res.status(200).send({
          message: "uploadImage was deleted successfully!",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(404).send({
          message:
            "Cannot delete uploadImage with ID=" +
            id +
            ". Maybe uploadImage was not found!",
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
  createUploadImage,
  multipleUploadImage,
  getAllUploadImage,
  getAllUploadImageById,
  getUploadImageById,
  updateUploadImage,
  deleteUploadImage,
};


const uploadVideoModel = require('./uploadVideo.model');
const commonUtil = require("../../../shared/utils/common.util");
const fileUploadUtil = require("../../../shared/utils/fileUpload.util");

  // Create Operation - Create uploadVideo
  const createUploadVideo = (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
    const folderName = "uploadVideo";
  
    fileUploadUtil.uploadFile(folderName, "video")(req, res, async () => {
      req.body.video = `${commonUtil.getFileUrlPath(folderName)}/${req.body.video}`;
  
      const uploadVideo = new uploadVideoModel(req.body);
      uploadVideo
        .save()
        .then((data) => {
          res.status(200).send({
            data: data,
            dataCount: data.length,
            message: "uploadVideo created successfully!",
            success: true,
            statusCode: 200,
          });
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while creating the uploadVideo.",
          });
        });
    });
  };

  const multipleUploadVideo = (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
    const folderName = "uploadVideo"; // Change the folder name for videos
  
    fileUploadUtil.multipleUploadFile(folderName, "multipleVideo")(
      req,
      res,
      async () => {
        const uploadedVideoUrls = req.body.multipleVideo.map((videoName) => {
          return `${commonUtil.getFileUrlPath(folderName)}/${videoName}`;
        });
  
        const uploadVideo = new uploadVideoModel({
          multipleVideo: uploadedVideoUrls,
        });
  
        uploadVideo
          .save()
          .then((data) => {
            res.status(200).send({
              data: {
                multipleVideo: data.multipleVideo,
                _id: data._id,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                __v: data.__v,
              },
              dataCount: data.multipleVideo.length,
              message: "uploadVideo created successfully!",
              success: true,
              statusCode: 200,
            });
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while creating the uploadVideo.",
            });
          });
      }
    );
  };  

  // Read Operation - Get all uploadVideo
  const getAllUploadVideo = (req, res) => {
    uploadVideoModel.find()
      .then((data) => {
        if (data.length > 0) {
          res.status(200).send({
            data: data,
            dataCount: data.length,
            message: "uploadVideo fetch successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(200).send({
            data: [],
            dataCount: data.length,
            message: "uploadVideo not found!",
            success: false,
            statusCode: 200,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while Retrieve the uploadVideo.",
        });
      });
  };

  // Read Operation - Get all uploadVideo by Id 
  const getAllUploadVideoById  = (req, res) => {
    const id = req.params.id;
    const condition = { _id: id};

    uploadVideoModel.find(condition)
      .then((data) => {
        if (data.length > 0) {
          res.status(200).send({
            data: data,
            dataCount: data.length,
            message: "uploadVideo fetch successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(200).send({
            data: [],
            dataCount: data.length,
            message: "uploadVideo not found!",
            success: false,
            statusCode: 200,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while Retrieve the uploadVideo.",
        });
      });
  };

  // Read Operation - Get a single uploadVideo by Id
  const getUploadVideoById = (req, res) => {
    const id = req.params.id;
    uploadVideoModel.findById(id)
      .then((data) => {
        if (data) {
          res.status(200).send({
            data: data,
            dataCount: data.length,
            message: "uploadVideo fetch successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(200).send({
            data: {},
            dataCount: 0,
            message: 'uploadVideo not found with ID=' + id,
            status: false,
            statusCode: 200,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while Retrieve the uploadVideo.",
        });
      });
  };

  // Update Operation - Update uploadVideo
 const updateUploadVideo = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  uploadVideoModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (data) {
        res.status(200).send({
          message: "uploadVideo was updated successfully.",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(404).send({
          message: 'Cannot update uploadVideo with order ID=' + id + '. Maybe uploadVideo was not found!',
          success: false,
          statusCode: 404,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating uploadVideo with ID=" + id,
      });
    });
};

// Delete Operation - Delete uploadVideo
  const deleteUploadVideo = (req, res) => {
    const id = req.params.id;
  
    uploadVideoModel.findByIdAndDelete(id)
      .then((data) => {
        if (data) {
          res.status(200).send({
            message: "uploadVideo was deleted successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(404).send({
            message: 'Cannot delete uploadVideo with ID=' + id + '. Maybe uploadVideo was not found!',
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
  createUploadVideo,
  getAllUploadVideo,
  getAllUploadVideoById,
  getUploadVideoById,
  updateUploadVideo,
  deleteUploadVideo,
  multipleUploadVideo
};

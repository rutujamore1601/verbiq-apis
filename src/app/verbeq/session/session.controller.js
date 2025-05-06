
const sessionModel = require('./session.model');
const settingModel = require('../setting/setting.model')

  // Create Operation - Create session
  const createSession = (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
  
    const session = new sessionModel(req.body);
    session
      .save()
      .then((data) => {
        res.status(200).send({
          data: data,
          dataCount: data.length,
          message: "session created successfully!",
          success: true,
          statusCode: 200,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the session.",
        });
      });
  };

  // Read Operation - Get all session
  const getAllSession = (req, res) => {
    sessionModel.find()
      .then((data) => {
        if (data.length > 0) {
          res.status(200).send({
            data: data,
            dataCount: data.length,
            message: "session fetch successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(200).send({
            data: [],
            dataCount: data.length,
            message: "session not found!",
            success: false,
            statusCode: 200,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while Retrieve the session.",
        });
      });
  };

  // Read Operation - Get all session by Id 
  const getAllSessionById  = (req, res) => {
    const id = req.params.id;
    const condition = { _id: id};

    sessionModel.find(condition)
      .then((data) => {
        if (data.length > 0) {
          res.status(200).send({
            data: data,
            dataCount: data.length,
            message: "session fetch successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(200).send({
            data: [],
            dataCount: data.length,
            message: "session not found!",
            success: false,
            statusCode: 200,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while Retrieve the session.",
        });
      });
  };

  // Read Operation - Get a single session by Id
  const getSessionById = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.params.userId;

        const sessionData = await sessionModel.findOne({ _id: id, userId })
            .populate("typeIds.typeId");

        if (!sessionData) {
            return res.status(404).json({
                data: null,
                message: `Session not found with ID=${id}`,
                success: false,
                statusCode: 404,
            });
        }

        const updatedTypeIds = await Promise.all(
            sessionData.typeIds.map(async (typeObj) => {
                if (!typeObj.typeId) return typeObj;

                const settingData = await settingModel.findOne({ settingTypeId: typeObj.typeId._id });
                return {
                    ...typeObj.toObject(),
                    noOfQuizQuestions: settingData ? settingData.noOfQuizQuestions : 0
                };
            })
        );

        const updatedSessionData = sessionData.toObject();
        updatedSessionData.typeIds = updatedTypeIds;

        res.status(200).json({
            data: updatedSessionData,
            message: "Session fetched successfully!",
            success: true,
            statusCode: 200,
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || "Some error occurred while retrieving the session.",
            success: false,
            statusCode: 500,
        });
    }
};


  

  // Update Operation - Update session
 const updateSession = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  sessionModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (data) {
        res.status(200).send({
          message: "session was updated successfully.",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(404).send({
          message: 'Cannot update session with order ID=' + id + '. Maybe session was not found!',
          success: false,
          statusCode: 404,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating session with ID=" + id,
      });
    });
};


// Delete Operation - Delete session
  const deleteSession = (req, res) => {
    const id = req.params.id;
  
    sessionModel.findByIdAndDelete(id)
      .then((data) => {
        if (data) {
          res.status(200).send({
            message: "session was deleted successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(404).send({
            message: 'Cannot delete session with ID=' + id + '. Maybe session was not found!',
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
  createSession,
  getAllSession,
  getAllSessionById,
  getSessionById,
  updateSession,
  deleteSession
};

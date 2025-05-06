
const questionBookMarkModel = require('./questionBookMark.model');

  // Create Operation - Create questionBookMark
  const createQuestionBookMark = async (req, res) => {
    try {
      if (!req.body) {
        return res.status(400).send({ message: "Content cannot be empty!" });
      }
  
      const { userId, typeId, questionId } = req.body;
      const filter = { userId, typeId, questionId };
  
      const existingEntry = await questionBookMarkModel.findOne(filter);
  
      if (existingEntry) {
        await questionBookMarkModel.deleteOne(filter);
        return res.status(200).send({
          message: "Bookmark removed successfully!",
          success: true,
          statusCode: 200,
        });
      } else {
        const newEntry = new questionBookMarkModel(req.body);
        const savedEntry = await newEntry.save();
        return res.status(200).send({
          data: savedEntry,
          message: "Successfully Added!",
          success: true,
          statusCode: 200,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while processing the Question Book Mark entry.",
      });
    }
  };
  
  // Read Operation - Get all questionBookMark
  const getAllQuestionBookMark = (req, res) => {
    questionBookMarkModel.find().populate("userId questionId typeId")
      .then((data) => {
        if (data.length > 0) {
          res.status(200).send({
            data: data,
            dataCount: data.length,
            message: "questionBookMark fetch successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(200).send({
            data: [],
            dataCount: data.length,
            message: "questionBookMark not found!",
            success: false,
            statusCode: 200,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while Retrieve the questionBookMark.",
        });
      });
  };

  // Read Operation - Get all questionBookMark by Id 
  const getAllQuestionBookMarkById  = (req, res) => {
    const id = req.params.id;
    const condition = { userId: id};

    questionBookMarkModel.find(condition).populate("userId questionId typeId")
      .then((data) => {
        if (data.length > 0) {
          res.status(200).send({
            data: data,
            dataCount: data.length,
            message: "questionBookMark fetch successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(200).send({
            data: [],
            dataCount: data.length,
            message: "questionBookMark not found!",
            success: false,
            statusCode: 200,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while Retrieve the questionBookMark.",
        });
      });
  };

  // Read Operation - Get a single questionBookMark by Id
  const getQuestionBookMarkById = (req, res) => {
    const id = req.params.id;
    questionBookMarkModel.findById(id)
      .then((data) => {
        if (data) {
          res.status(200).send({
            data: data,
            dataCount: data.length,
            message: "questionBookMark fetch successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(200).send({
            data: {},
            dataCount: 0,
            message: 'questionBookMark not found with ID=' + id,
            status: false,
            statusCode: 200,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while Retrieve the questionBookMark.",
        });
      });
  };

  // Update Operation - Update questionBookMark
 const updateQuestionBookMark = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  questionBookMarkModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (data) {
        res.status(200).send({
          message: "questionBookMark was updated successfully.",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(404).send({
          message: 'Cannot update questionBookMark with order ID=' + id + '. Maybe questionBookMark was not found!',
          success: false,
          statusCode: 404,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating questionBookMark with ID=" + id,
      });
    });
};

// Delete Operation - Delete questionBookMark
  const deleteQuestionBookMark = (req, res) => {
    const id = req.params.id;
  
    questionBookMarkModel.findByIdAndDelete(id)
      .then((data) => {
        if (data) {
          res.status(200).send({
            message: "questionBookMark was deleted successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(404).send({
            message: 'Cannot delete questionBookMark with ID=' + id + '. Maybe questionBookMark was not found!',
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
  createQuestionBookMark,
  getAllQuestionBookMark,
  getAllQuestionBookMarkById,
  getQuestionBookMarkById,
  updateQuestionBookMark,
  deleteQuestionBookMark
};

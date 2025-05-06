const questionsModel = require("./questions.model");
const settingModel = require("../setting/setting.model");
const mockTestAttemptModel = require("../mockTestAttempt/mockTestAttemptModel");
const sessionModel = require("../session/session.model")
const authModel = require("../studentRegistration/studentRegistration.model")
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const multer = require("multer");

// Set up disk storage for audios
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "public/audios";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `temp-${Date.now()}${ext}`);
  },
});

// Create Operation - Create questions
const createQuestions = async (req, res) => {
  try {
    if (!req.body || !req.body.question) {
      return res.status(400).send({ message: "Question text is required!" });
    }

    const data = {
      text: req.body.question,
      voice: "af_heart",
      speed: 1,
      split_pattern: "r\n+"
    };

    let ttsResponse = null;
    let ttsResponseaudio = null;
    try {
      const response = await axios.post('http://35.200.143.247:8080/generate_audio', data);
      ttsResponse = response.data;
      ttsResponseaudio = ttsResponse.audio_files[0];
    } catch (ttsErr) {
      console.error("Error calling TTS API:", ttsErr.message);
    }

    const filename = `${ttsResponseaudio}`;
    const audioPath = path.join(__dirname, '../../../../', 'public', 'audios', filename);

    fs.writeFileSync(audioPath, ttsResponseaudio);

    const publicUrl = `http://35.200.143.247:8080/audios/${filename}`;
    req.body.instructionAudioUrl = publicUrl;

    const questions = new questionsModel(req.body);
    const savedData = await questions.save();

    res.status(200).send({
      data: savedData,
      message: "Question created successfully!",
      success: true,
      statusCode: 200
    });

  } catch (err) {
    console.error('Error creating question:', err.message);
    res.status(500).send({
      message: err.message || "Some error occurred while creating the question."
    });
  }
};

// Read Operation - Get all questions
const getAllQuestions = (req, res) => {
  questionsModel
    .find()
    .populate("typeId")
    .then((data) => {
      if (data.length > 0) {
        res.status(200).send({
          data: data,
          dataCount: data.length,
          message: "questions fetch successfully!",
          success: true,
          statusCode: 200
        });
      } else {
        res.status(200).send({
          data: [],
          dataCount: data.length,
          message: "questions not found!",
          success: false,
          statusCode: 200
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while Retrieve the questions."
      });
    });
};

// Read Operation - Get all questions by Id
const getAllQuestionsById = (req, res) => {
  const typeId = req.params.typeId;
  const languageName = req.params.languageName;
  const condition = { typeId: typeId, languageName: languageName };

  questionsModel
    .find(condition)
    .then((data) => {
      if (data.length > 0) {
        res.status(200).send({
          data: data,
          dataCount: data.length,
          message: "questions fetch successfully!",
          success: true,
          statusCode: 200
        });
      } else {
        res.status(200).send({
          data: [],
          dataCount: data.length,
          message: "questions not found!",
          success: false,
          statusCode: 200
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while Retrieve the questions."
      });
    });
};

const getQuestionsById = (req, res) => {
  const typeId = req.params.typeId;
  const languageName = req.params.languageName;
  const condition = { typeId: typeId, languageName: languageName };

  questionsModel
    .findOne(condition)
    .then((data) => {
      if (data) {
        res.status(200).send({
          data: data,
          message: "Questions fetched successfully!",
          success: true,
          statusCode: 200
        });
      } else {
        res.status(200).send({
          data: {},
          message: `Questions not found with typeId=${typeId}`,
          success: false,
          statusCode: 200
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the questions.",
        success: false,
        statusCode: 500
      });
    });
};

let lastFetchedQuestionId = null;

const getNextQuestionsById = async (req, res) => {
  try {
    const { typeId, languageName, userId } = req.params;

    // Fetch quiz settings
    const setting = await settingModel.findOne({ settingTypeId: typeId });
    if (!setting) {
      return res.status(404).json({
        success: false,
        message: `No setting found for typeId=${typeId}`,
      });
    }

    const noOfQuizQuestions = setting.noOfQuizQuestions;

    // Fetch already attempted question IDs
    const attemptedQuestions = await mockTestAttemptModel
      .find({ userId, typeId })
      .distinct("questionId");

    // if (attemptedQuestions.length >= noOfQuizQuestions) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "No more new questions available.",
    //   });
    // }

    // Create filter condition for unattempted questions
    let condition = {
      typeId,
      languageName,
      _id: { $in: attemptedQuestions },
    };

    if (lastFetchedQuestionId) {
      condition._id.$in = [...attemptedQuestions, lastFetchedQuestionId];
    }

    const nextQuestion = await questionsModel.findOne(condition);

    if (!nextQuestion) {
      return res.status(404).json({
        success: false,
        message: "No more new questions available.",
      });
    }

    lastFetchedQuestionId = nextQuestion._id;

    return res.status(200).json({
      data: nextQuestion,
      message: "Next question fetched successfully!",
      success: true,
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error fetching next question:", error);
    return res.status(500).json({
      message: "Some error occurred while retrieving the next question.",
      success: false,
      statusCode: 500,
    });
  }
};

//function for session create
const createSession = async (userId, typeId) => {
  let session = await sessionModel.findOne({ userId, sessionStatus: "Running" });

  if (!session) {
    session = await sessionModel.create({
      userId,
      typeIds: [{ typeId, questionCount: 0, completed: false }],
      sessionStatus: "Running",
    });
  } else {
    // Check if typeId is already in the session
    const typeExists = session.typeIds.some((t) => t.typeId.equals(typeId));

    if (!typeExists) {
      session.typeIds.push({ typeId, questionCount: 0, completed: false });
      await session.save();
    }
  }

  return session;
};

const getTestQuestionsById = async (req, res) => {
  try {
    const { typeId, languageName, userId } = req.params;

    const activeSession = await createSession(userId, typeId);

    const attemptedQuestions = await mockTestAttemptModel
      .find({ userId, typeId });

    const condition = {
      typeId,
      languageName,
      _id: { $nin: attemptedQuestions },
    };

    const nextQuestion = await questionsModel.findOne(condition);

    const settingTime = await settingModel.findOne({ settingTypeId: typeId })
    const time = settingTime.questionTime;
    if (nextQuestion) {
      return res.status(200).json({
        sessionId: activeSession,
        data: nextQuestion,
        questionTime: time,
        message: "Next question fetched successfully!",
        success: true,
        statusCode: 200,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No more new questions available.",
      });
    }
  } catch (error) {
    console.error("Error fetching next question:", error);
    return res.status(500).json({
      message: "Some error occurred while retrieving the next question.",
      success: false,
      statusCode: 500,
    });
  }
};

const verifyGivenQuestionLimit = async (sessionId, typeId) => {
  try {
    const settings = await settingModel.findOne({ settingTypeId: typeId });

    if (!settings) {
      throw new Error("No settings found");
    }

    const userQuestions = await mockTestAttemptModel.find({
      sessionId,
      typeId,
    });

    if (userQuestions.length >= settings.noOfQuizQuestions) {
      const session = await sessionModel.findById(sessionId);
      if (session) {
        const typeProgress = session.typeIds.find((t) =>
          t.typeId.equals(typeId)
        );
        if (typeProgress) {
          typeProgress.completed = true;
          await session.save();
        }
      }
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error in verifyGivenQuestionLimit:", error);
    return false;
  }
};

const getNextQuestionsById2 = async (req, res) => {
  try {
    const { typeId, languageName, userId, sessionId } = req.params;

    const user = await authModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: `User with ID ${userId} is not found.`,
      });
    }

    const userQuestionLimit = await verifyGivenQuestionLimit(sessionId, typeId);
    console.log('userQuestionLimit: ', userQuestionLimit);
    if (!userQuestionLimit) {
      return res
        .status(400)
        .json({ status: false, message: "No more questions for this type" });
    }

    const settingTime = await settingModel.findOne({ settingTypeId: typeId })
    console.log('settingTime: ', settingTime);
    const time = settingTime.questionTime;

    const attemptedQuestions = await mockTestAttemptModel
      .find({ userId, typeId });

    const condition = {
      typeId,
      languageName,
      _id: { $nin: attemptedQuestions },
    };

    const nextQuestion = await questionsModel.findOne(condition);

    if (nextQuestion) {
      return res.status(200).json({
        data: nextQuestion,
        questionTime: time,
        message: "Next question fetched successfully!",
        success: true,
        statusCode: 200,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No more new questions available.",
      });
    }
  } catch (error) {
    console.error("Error fetching next question:", error);
    return res.status(500).json({
      message: "Some error occurred while retrieving the next question.",
      success: false,
      statusCode: 500,
    });
  }
};

const createUserQuestionMapping = async (data) => {
  try {
    const userQuestion = await mockTestAttemptModel.create(data);
    return !!userQuestion;
  } catch (error) {
    console.error("Error creating user question mapping:", error);
    return false;
  }
};

const submitteQuestionAnswer = async (req, res) => {
  try {
    const { questionId, answer, userId, typeId, timeTaken, languageAssessmentData } = req.body;

    const getQuestion = await questionsModel.findById(questionId);
    if (!getQuestion) {
      return res.status(404).json({
        status: false,
        message: `Question with ID ${questionId} not found`
      });
    }

    const mappingData = {
      userId,
      questionId,
      typeId,
      answer,
      languageAssessmentData,
      timeTaken,
      status: answer === "null" ? "UnAttempted" : "Attempted"
    };

    const mappingResult = await createUserQuestionMapping(mappingData);
    if (!mappingResult) {
      return res.status(400).json({
        status: false,
        message: "Failed to create new record"
      });
    }

    return res.status(200).json({
      submittedAnswer: answer,
      message: "Answer recorded successfully"
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Update Operation - Update questions
const updateQuestions = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  questionsModel
    .findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (data) {
        res.status(200).send({
          message: "questions was updated successfully.",
          success: true,
          statusCode: 200
        });
      } else {
        res.status(404).send({
          message:
            "Cannot update questions with order ID=" +
            id +
            ". Maybe questions was not found!",
          success: false,
          statusCode: 404
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating questions with ID=" + id
      });
    });
};

// Delete Operation - Delete questions
const deleteQuestions = (req, res) => {
  const id = req.params.id;

  questionsModel
    .findByIdAndDelete(id)
    .then((data) => {
      if (data) {
        res.status(200).send({
          message: "questions was deleted successfully!",
          success: true,
          statusCode: 200
        });
      } else {
        res.status(404).send({
          message:
            "Cannot delete questions with ID=" +
            id +
            ". Maybe questions was not found!",
          success: false,
          statusCode: 404
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
};

module.exports = {
  createQuestions,
  getAllQuestions,
  getAllQuestionsById,
  getQuestionsById,
  updateQuestions,
  deleteQuestions,
  getNextQuestionsById,
  submitteQuestionAnswer,
  getNextQuestionsById2,
  getTestQuestionsById
};

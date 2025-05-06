const mockTestAttemptModel = require("./mockTestAttemptModel");
const questionsModel = require("../questions/questions.model")
const sessionModel = require("../session/session.model")
const mongoose = require("mongoose");
const axios = require('axios');
const FormData = require('form-data');

//Sending selectedOption as a Index
const updateTestAttempt = async (req, res) => {
  try {
    const {
      studentCertificationId,
      userId,
      mockTestId,
      questionId,
      nextQuestionId,
      status,
      selectedOption,
      remainingTime,
    } = req.body;

    const attempt = await mockTestAttemptModel.findOne({
      userId,
      mockTestId,
      studentCertificationId,
    });

    if (attempt) {
      const questionIndex = attempt.attemptedQuestions.findIndex(
        (q) => q.questionId.toString() === questionId.toString()
      );

      if (questionIndex > -1) {
        // Update existing question attempt
        attempt.attemptedQuestions[questionIndex].status = status;
        attempt.attemptedQuestions[questionIndex].selectedOption =
          selectedOption;

        // Update currentQuestionId if provided (assuming it's for tracking progress)
        if (questionId) {
          attempt.attemptedQuestions[questionIndex].questionId = questionId;
        }
      } else {
        // Add new question attempt
        attempt.attemptedQuestions.push({ questionId, status, selectedOption });

        // Update status counts based on the new attempt
        if (status === "attempted") {
          attempt.attemptedCount++;
        } else if (status === "unattempted") {
          attempt.unAttemptedCount++;
        } else if (status === "skip") {
          attempt.skippedCount++;
        }
      }

      attempt.remainingTime = remainingTime;
      await attempt.save();
    } else {
      // Create new attempt
      const newAttempt = new mockTestAttemptModel({
        studentCertificationId,
        userId,
        mockTestId,
        attemptedQuestions: [{ questionId, status, selectedOption }],
        remainingTime,
        attemptedCount: status === "attempted" ? 1 : 0, // Initial count based on status
        unAttemptedCount: status === "unattempted" ? 1 : 0,
        skippedCount: status === "skip" ? 1 : 0,
      });
      await newAttempt.save();
    }

    const updatedAttempt = await mockTestAttemptModel
      .findOne({
        userId,
        mockTestId,
        studentCertificationId,
      })
      .select(
        "userId mockTestId attemptedQuestions remainingTime attemptedCount skippedCount unAttemptedCount"
      );

    const nextQuestion = await mockTestQuestionModel
      .findById(nextQuestionId)
      .select("mockTestId question questionImg optionList");

    res.status(200).json({
      status: 200,
      message: "Test attempt updated successfully",
      data: {
        attempted: updatedAttempt.attemptedCount,
        unAttempted: updatedAttempt.unAttemptedCount,
        skipped: updatedAttempt.skippedCount,
        ...updatedAttempt._doc, // Spread operator to include all attempt data
      },
      nextQuestion: nextQuestion,
    });
  } catch (error) {
    console.error("Error updating test attempt:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

//update session
const updateSession = async (sessionId, typeId) => {
  try {
    const session = await sessionModel.findById(sessionId);
    if (!session) {
      console.error(`Session with ID ${sessionId} not found.`);
      return null;
    }

    let typeIndex = session.typeIds.findIndex(t => t.typeId.equals(typeId));

    if (typeIndex !== -1) {
      // If typeId exists, increment questionCount
      session.typeIds[typeIndex].questionCount += 1;
    } else {
      // If typeId does not exist, add new entry
      session.typeIds.push({ typeId, questionCount: 1, completed: false });
    }

    await session.save();
    return session;
  } catch (error) {
    console.error("Error updating session:", error);
    return null;
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

const EVALUATE_URL = "http://35.200.143.247:8080/evaluate/";

const sendEvaluationRequest = async (req, res) => {
  try {
    const { Question, response } = req.body;

    if (!Question || !response) {
      return res.status(400).json({ error: "Both Question and response are required." });
    }

    const payload = {
      Question: Question,
      response: response,
    };

    const responseData = await axios.post(EVALUATE_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });

    res.json(responseData.data);
  } catch (error) {
    console.error("Error calling evaluate API:", error.message);

    res.status(500).json({
      error: "Failed to evaluate content",
      details: error.response ? error.response.data : error.message
    });
  }
};

const ANALYZE_EVALUATE_URL = "http://35.200.143.247:8080/analyze_uploaded_audios/";

const sendAnalyzeEvaluationRequest = async (req, res) => {
  try {
    const audio_url = req.body.audio_url;
    const user_text = req.body.user_text;

    if (!audio_url || !user_text) {
      return res.status(400).json({ error: "Both audio_url and user_text are required." });
    }

    const formData = new FormData();
    formData.append('audio_url', audio_url);
    formData.append('user_text', user_text);

    console.log('Sending FormData:', { audio_url, user_text });

    const response = await axios.post(ANALYZE_EVALUATE_URL, formData, {
      headers: formData.getHeaders(),
    });

    console.log('ANALYZE_EVALUATE_URL:', ANALYZE_EVALUATE_URL);
    console.log('response:', response.data);

    res.json(response.data);
  } catch (error) {
    console.error("Error calling evaluate API:", error.message);
    const errorDetails = error.response ? error.response.data : error.message;
    res.status(500).json({
      error: "Failed to evaluate content",
      details: errorDetails,
    });
  }
};

//submit question result
const submitteQuestionAnswer = async (req, res) => {
  try {
    const { questionId, answer, userId, typeId, timeTaken, languageAssessmentData, sessionId, questionType } = req.body;

    if (!questionType) {
      return res.status(400).json({
        status: false,
        message: "questionType is required",
      });
    }

    const getQuestion = await questionsModel.findById(questionId);
    console.log('getQuestion', getQuestion)
    if (!getQuestion) {
      return res.status(404).json({
        status: false,
        message: `Question with ID ${questionId} not found`,
      });
    }

    let status = "UnAttempted";
    let isCorrect = null;

    if (questionType === "text") {
      status = answer && answer.trim() !== "" ? "Attempted" : "UnAttempted";
    } else if (questionType === "mcq") {
      if (!answer || answer.trim() === "") {
        status = "UnAttempted";
      } else {
        const selectedOption = getQuestion.options.find(opt => opt.optionText === answer);
        if (selectedOption) {
          status = "Attempted";
          isCorrect = selectedOption.isCorrect;
        } else {
          return res.status(400).json({
            status: false,
            message: "Invalid option selected.",
          });
        }
      }
    }

    const mappingData = {
      userId,
      questionId,
      typeId,
      answer,
      languageAssessmentData,
      timeTaken,
      sessionId,
      status,
      questionType, // Ensure questionType is stored in DB
      isCorrect,
    };

    const mappingResult = await mockTestAttemptModel.create(mappingData);
    if (!mappingResult) {
      return res.status(400).json({
        status: false,
        message: "Failed to create new record",
      });
    }

    const updatedSession = await updateSession(sessionId, typeId);
    if (!updatedSession) {
      return res.status(500).json({
        status: false,
        message: "Failed to update session",
      });
    }

    return res.status(200).json({
      getQuestion,
      submittedAnswer: answer,
      isCorrect,
      updatedSession,
      message: "Answer recorded successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const closeActiveSession = async (req, res) => {
  try {
    const { userId, sessionId } = req.body;

    const session = await sessionModel.findOne({
      userId: userId,
      _id: sessionId,
    });

    if (!session) {
      return res
        .status(404)
        .json({ status: false, message: "Session not found" });
    }

    session.sessionStatus = "Completed";
    await session.save();

    return res
      .status(200)
      .json({ status: true, message: "Session closed successfully" });

  } catch (error) {
    console.error("Error closing user active session:", error);
    res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};

const createMockTestAttempt = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: "Please fill all fields..",
      });
      return;
    }
    const MockTestAttempt = await mockTestAttemptModel.create({
      ...req.body,
    });
    if (!MockTestAttempt) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: "Failed to create MockTestAttempt..",
      });
      return;
    }
    res.status(201).json({
      status: 201,
      error: "201",
      message: "MockTestAttempt created successfully..",
      data: MockTestAttempt,
    });
  } catch (error) {
    console.log("error", error);
    // const errorMessage = error.errors.map((err) => err.message).join(" ,");
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      // error: errorMessage,
    });
  }
};

const getAllMockTestAttempt = async (req, res) => {
  try {
    const MockTestAttempt = await mockTestAttemptModel.find();

    if (MockTestAttempt.length === 0) {
      return res.status(404).json({
        status: 404,
        error: 404,
        message: "MockTestAttempt data not found..",
      });
    }
    return res.status(200).json({
      status: 200,
      error: 200,
      totalRecords: MockTestAttempt.length,
      data: MockTestAttempt,
    });
  } catch (error) {
    console.error("Error fetching MockTestAttempt:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getMockTestAttemptById = async (req, res) => {
  try {
    const userId = req.params.userId;

    const mockTestAttempt = await mockTestAttemptModel.findOne({ userId }).sort({ createdAt: 1 });

    if (!mockTestAttempt) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: `MockTestAttempt for userId ${userId} not found`,
      });
    }

    let parsedAssessmentData = null;

    if (mockTestAttempt.languageAssessmentData) {
      try {
        parsedAssessmentData = JSON.parse(mockTestAttempt.languageAssessmentData);
      } catch (error) {
        parsedAssessmentData = extractAssessmentData(mockTestAttempt.languageAssessmentData);
      }
    }

    res.status(200).json({
      status: 200,
      success: true,
      data: {
        ...mockTestAttempt.toObject(),
        languageAssessmentData: parsedAssessmentData,
      },
    });
  } catch (error) {
    console.error("Error fetching MockTestAttempt:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// const getMockTestAttemptById = async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     const mockTestAttempt = await mockTestAttemptModel.findOne({ userId })
//         .sort({ createdAt: -1 });

//     if (!mockTestAttempt) {
//       return res.status(404).json({
//         status: 404,
//         success: false,
//         message: `MockTestAttempt for userId ${userId} not found`,
//       });
//     }

//     res.status(200).json({
//       status: 200,
//       success: true,
//       data: mockTestAttempt,
//     });
//   } catch (error) {
//     console.error("Error fetching MockTestAttempt:", error);
//     res.status(500).json({
//       status: 500,
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

const getMockTestAttemptByIdtest = async (req, res) => {
  try {
    const userId = req.params.userId;

    const mockTestAttempt = await mockTestAttemptModel.find({ userId });

    if (!mockTestAttempt) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: `MockTestAttempt for userId ${userId} not found`,
      });
    }

    let parsedAssessmentData = null;

    if (mockTestAttempt.languageAssessmentData) {
      try {
        parsedAssessmentData = JSON.parse(mockTestAttempt.languageAssessmentData);
      } catch (error) {
        parsedAssessmentData = extractAssessmentData(mockTestAttempt.languageAssessmentData);
      }
    }

    res.status(200).json({
      status: 200,
      success: true,
      data: {
        ...mockTestAttempt.toObject(),
        languageAssessmentData: parsedAssessmentData,
      },
    });
  } catch (error) {
    console.error("Error fetching MockTestAttempt:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const extractAssessmentData = (text) => {
  if (!text || typeof text !== "string") {
    return {};
  }

  const sections = text.split("**");
  const result = {};

  for (let i = 0; i < sections.length; i++) {
    if (sections[i].includes("Evaluation Criteria:") || sections[i].includes("Evaluation Results:") || sections[i].includes("Recommendations:")) {
      continue;
    }

    const key = sections[i].trim();
    const value = sections[i + 1] ? sections[i + 1].trim() : "";

    if (key && value) {
      result[key] = value;
    }
  }

  return result;
};

const updateMockTestAttemptById = async (req, res) => {
  try {
    const id = req.params.id;

    const MockTestAttemptUpdate = await mockTestAttemptModel.findByIdAndUpdate(
      id,
      {
        ...req.body,
      }
    );

    if (!MockTestAttemptUpdate) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: `Failed to update MockTestAttempt of ID ${id}.`,
      });
      return;
    }

    res
      .status(200)
      .json({ status: 200, error: "200", data: MockTestAttemptUpdate });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal server error" });
  }
};

const deleteMockTestAttemptById = async (req, res) => {
  try {
    const id = req.params.id;
    const MockTestAttempt = await mockTestAttemptModel.findByIdAndDelete(id);

    if (!MockTestAttempt) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: `Failed to delete MockTestAttempt of ID ${id}...`,
      });
      return;
    }
    res.status(200).json({
      status: 200,
      error: "200",
      message: `MockTestAttempt of MockTestAttemptID ${id} is successfully deleted..`,
    });
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal server error" });
  }
};
module.exports = {
  updateTestAttempt,
  createMockTestAttempt,
  getAllMockTestAttempt,
  getMockTestAttemptById,
  updateMockTestAttemptById,
  deleteMockTestAttemptById,
  getMockTestAttemptByIdtest,
  submitteQuestionAnswer,
  sendEvaluationRequest,
  closeActiveSession,
  sendAnalyzeEvaluationRequest
};

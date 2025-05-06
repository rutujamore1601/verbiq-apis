const fAQuestionModel = require("./frequentlyAskedQuestionsModel");

const faqFilter = async (req, res) => {
  const { question, answer } = req.body;
  try {
    const filter = {};

    if (question.length > 0) {
      filter.question = new RegExp(question, "i");
    }
    if (answer.length > 0) {
      filter.answer = new RegExp(answer, "i");
    }

    const result = await fAQuestionModel.find({ ...filter });

    res.status(200).json({ status: 200, totalRecords: result.length, result });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ status: 500, message: error });
  }
};

const createFAQuestion = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: "Please fill all fields..",
      });
      return;
    }
    const FAQuestion = await fAQuestionModel.create({
      ...req.body,
    });
    if (!FAQuestion) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: "Failed to create FAQuestion..",
      });
      return;
    }
    res.status(201).json({
      status: 201,
      error: "201",
      message: "FAQuestion created successfully..",
      data: FAQuestion,
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

const getAllFAQuestion = async (req, res) => {
  const { search } = req.body; // Destructure 'search' from req.body
  try {
    const filter = {};

    if (search && search.length > 0) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ question: regex }, { answer: regex }];
    }

    const data = await fAQuestionModel.find(filter);

    res.status(200).json({ status: 200, totalRecords: data.length, data });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ status: 500, message: error.message });
  }
};

const getFAQuestionById = async (req, res) => {
  try {
    const id = req.params.id;
    const FAQuestion = await fAQuestionModel.findById(id);

    if (!FAQuestion) {
      res.status(404).json({
        status: 404,
        error: 404,
        message: `FAQuestion of id ${id} is not found`,
      });
      return;
    }
    res.status(200).json({ status: 200, error: 200, data: FAQuestion });
  } catch (error) {
    console.error("Error fetching FAQuestion:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateFAQuestionById = async (req, res) => {
  try {
    const id = req.params.id;

    const FAQuestionUpdate = await fAQuestionModel.findByIdAndUpdate(id, {
      ...req.body,
    });

    if (!FAQuestionUpdate) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: `Failed to update FAQuestion of ID ${id}.`,
      });
      return;
    }

    res.status(200).json({ status: 200, error: "200", data: FAQuestionUpdate });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal server error" });
  }
};

const deleteFAQuestionById = async (req, res) => {
  try {
    const id = req.params.id;
    const FAQuestion = await fAQuestionModel.findByIdAndDelete(id);

    if (!FAQuestion) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: `Failed to delete FAQuestion of ID ${id}...`,
      });
      return;
    }
    res.status(200).json({
      status: 200,
      error: "200",
      message: `FAQuestion of FAQuestionID ${id} is successfully deleted..`,
    });
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal server error" });
  }
};
module.exports = {
  faqFilter,
  createFAQuestion,
  getAllFAQuestion,
  getFAQuestionById,
  updateFAQuestionById,
  deleteFAQuestionById,
};

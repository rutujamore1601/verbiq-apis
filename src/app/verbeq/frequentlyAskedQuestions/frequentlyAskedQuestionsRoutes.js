const express = require("express");
const {
  faqFilter,
  createFAQuestion,
  getAllFAQuestion,
  getFAQuestionById,
  updateFAQuestionById,
  deleteFAQuestionById,
} = require("./frequentlyAskedQuestionsController");

const router = express.Router();

router.post("/faqFilter", faqFilter);
router.post("/createFAQuestion", createFAQuestion);
router.post("/getAllFAQuestion", getAllFAQuestion);
router.get("/getFAQuestionById/:id", getFAQuestionById);
router.put("/updateFAQuestionById/:id", updateFAQuestionById);
router.delete("/deleteFAQuestionById/:id", deleteFAQuestionById);

module.exports = router;

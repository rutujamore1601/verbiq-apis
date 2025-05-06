const express = require("express");
const {
  createContactUs,
  getAllContactUs,
  getContactUsById,
  updateContactUsById,
  deleteContactUsById,
} = require("./contactUsController");

const router = express.Router();

router.post("/createContactUs", createContactUs);
router.post("/getAllContactUs", getAllContactUs);
router.get("/getContactUsById/:id", getContactUsById);
router.put("/updateContactUsById/:id", updateContactUsById);
router.delete("/deleteContactUsById/:id", deleteContactUsById);

module.exports = router;

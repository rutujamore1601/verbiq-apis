const express = require("express");
const {
  createCertification,
  getAllCertification,
  getCertificationById,
  updateCertificationById,
  deleteCertificationById,
  certificationFilter,
} = require("./certificationController");

const router = express.Router();

router.post("/certificationFilter", certificationFilter);
router.post("/createCertification", createCertification);
router.post("/getAllCertification", getAllCertification);
router.get("/getCertificationById/:id", getCertificationById);
router.put("/updateCertificationById/:id", updateCertificationById);
router.delete("/deleteCertificationById/:id", deleteCertificationById);

module.exports = router;

const express = require("express");
const authenticateToken = require("../../../shared/middleware/auth");
const {
  certificationLevelFilter,
  createCertificationLevel,
  getAllCertificationLevel,
  getCertificationLevelById,
  updateCertificationLevelById,
  deleteCertificationLevelById,
} = require("./certificationLevelController");

const router = express.Router();

router.post("/certificationLevelFilter", certificationLevelFilter);
router.post("/createCertificationLevel", createCertificationLevel);
router.post("/getAllCertificationLevel", getAllCertificationLevel);
router.get("/getCertificationLevelById/:id", getCertificationLevelById);
router.put("/updateCertificationLevelById/:id", updateCertificationLevelById);
router.delete(
  "/deleteCertificationLevelById/:id",
  deleteCertificationLevelById
);

module.exports = router;

const express = require("express");
const {
  certificationCetegoryFilter,
  createCertificationCategory,
  getAllCertificationCategory,
  getCertificationCategoryById,
  updateCertificationCategoryById,
  deleteCertificationCategoryById,
} = require("./certificationCategoryController");

const router = express.Router();

router.post("/certificationCetegoryFilter", certificationCetegoryFilter);
router.post("/createCertificationCategory", createCertificationCategory);
router.post("/getAllCertificationCategory", getAllCertificationCategory);
router.get("/getCertificationCategoryById/:id", getCertificationCategoryById);
router.put(
  "/updateCertificationCategoryById/:id",
  updateCertificationCategoryById
);
router.delete(
  "/deleteCertificationCategoryById/:id",
  deleteCertificationCategoryById
);

module.exports = router;

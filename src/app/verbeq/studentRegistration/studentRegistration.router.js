const router = require("express").Router();
const studentRegistrationController = require("./studentRegistration.controller");
const authenticateToken = require("../../../shared/middleware/auth");

// Create Operation - Create studentRegistration
router.post(
  "/createStudentRegistration",
  studentRegistrationController.createStudentRegistration
);

router.get("/email/verify", studentRegistrationController.verify);
router.post("/reset", studentRegistrationController.reset);
router.post("/login", studentRegistrationController.login);
router.post("/submitOtp", studentRegistrationController.submitOtp);

// Read Operation - Get all studentRegistration
router.get(
  "/getAllStudentRegistration",
  studentRegistrationController.getAllStudentRegistration
);

// Read Operation - Get all studentRegistration by Id
router.get(
  "/getAllStudentRegistrationById/:id",
  studentRegistrationController.getAllStudentRegistrationById
);

// Read Operation - Get a single studentRegistration by Id
router.get(
  "/getStudentRegistrationById/:id",
  authenticateToken,
  studentRegistrationController.getStudentRegistrationById
);

router.get(
  "/getStudentRegistrationByUserType/:userType",
  studentRegistrationController.getStudentRegistrationByUserType
);

// Update Operation - Update studentRegistration
router.put(
  "/updateStudentRegistration/:id",
  studentRegistrationController.updateStudentRegistration
);

// Delete Operation - Delete studentRegistration
router.delete(
  "/deleteStudentRegistration/:id",
  studentRegistrationController.deleteStudentRegistration
);

router.post("/forgetPassword", studentRegistrationController.forgetPassword);
router.post("/otpVerify", studentRegistrationController.otpVerify);
router.post("/resetPassword", studentRegistrationController.resetPassword);

module.exports = router;

const express = require("express");
const {
  createApiInfo,
  getAllApiInfo,
  getApiInfoById,
  updateApiInfoById,
  deleteApiInfoById,
  ApiInfoFilter,
} = require("./apiInfoController");

const router = express.Router();

router.post("/ApiInfoFilter", ApiInfoFilter);
router.post("/createApiInfo", createApiInfo);
router.post("/getAllApiInfo", getAllApiInfo);
router.get("/getApiInfoById/:id", getApiInfoById);
router.put("/updateApiInfoById/:id", updateApiInfoById);
router.delete("/deleteApiInfoById/:id", deleteApiInfoById);

module.exports = router;

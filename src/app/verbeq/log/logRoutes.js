const express = require("express");
const { getAllLogs } = require("./logController");

const router = express.Router();

router.post("/getAllLogs", getAllLogs);
// router.get("/getOrderById/:id", getOrderById);
// router.get("/getOrderByUserId/:id", getOrderByUserId);
// router.put("/updateOrderById/:id", updateOrderById);
// router.delete("/deleteOrderById/:id", deleteOrderById);

module.exports = router;

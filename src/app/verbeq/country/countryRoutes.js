const express = require("express");
const {
  createCountry,
  getAllCountry,
  getCountryById,
  updateCountryById,
  deleteCountryById,
} = require("./countryController");

const router = express.Router();

router.post("/createCountry", createCountry);
router.get("/getAllCountry", getAllCountry);
router.get("/getCountryById/:id", getCountryById);
router.put("/updateCountryById/:id", updateCountryById);
router.delete("/deleteCountryById/:id", deleteCountryById);

module.exports = router;

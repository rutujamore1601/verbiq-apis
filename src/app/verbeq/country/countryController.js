const countryModel = require("./countryModel");

const createCountry = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: "Please fill all fields..",
      });
      return;
    }
    const Country = await countryModel.create({
      ...req.body,
    });
    if (!Country) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: "Failed to create Country..",
      });
      return;
    }
    res.status(201).json({
      status: 201,
      error: "201",
      message: "Country created successfully..",
      data: Country,
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

const getAllCountry = async (req, res) => {
  try {
    const Country = await countryModel.find();

    if (Country.length === 0) {
      return res.status(404).json({
        status: 404,
        error: 404,
        message: "Country data not found..",
      });
    }
    return res.status(200).json({
      status: 200,
      error: 200,
      totalRecords: Country.length,
      data: Country,
    });
  } catch (error) {
    console.error("Error fetching Country:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getCountryById = async (req, res) => {
  try {
    const id = req.params.id;
    const Country = await countryModel.findById(id);

    if (!Country) {
      res.status(404).json({
        status: 404,
        error: 404,
        message: `Country of id ${id} is not found`,
      });
      return;
    }
    res.status(200).json({ status: 200, error: 200, data: Country });
  } catch (error) {
    console.error("Error fetching Country:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateCountryById = async (req, res) => {
  try {
    const id = req.params.id;

    const CountryUpdate = await countryModel.findByIdAndUpdate(id, {
      ...req.body,
    });

    if (!CountryUpdate) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: `Failed to update Country of ID ${id}.`,
      });
      return;
    }

    res.status(200).json({ status: 200, error: "200", data: CountryUpdate });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal server error" });
  }
};

const deleteCountryById = async (req, res) => {
  try {
    const id = req.params.id;
    const Country = await countryModel.findByIdAndDelete(id);

    if (!Country) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: `Failed to delete Country of ID ${id}...`,
      });
      return;
    }
    res.status(200).json({
      status: 200,
      error: "200",
      message: `Country of CountryID ${id} is successfully deleted..`,
    });
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal server error" });
  }
};
module.exports = {
  createCountry,
  getAllCountry,
  getCountryById,
  updateCountryById,
  deleteCountryById,
};

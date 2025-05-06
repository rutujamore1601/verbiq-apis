const certificationLevelModel = require("./certificationLevelModel");

const certificationLevelFilter = async (req, res) => {
  const { search } = req.body; // Destructure 'search' from req.body
  try {
    const filter = {};

    if (search && search.length > 0) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { certificateLevelName: regex },
        { levelName: regex },
        { description: regex },
      ];
    }

    const result = await certificationLevelModel.find(filter);

    res.status(200).json({ status: 200, totalRecords: result.length, result });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ status: 500, message: error.message });
  }
};

const createCertificationLevel = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: "Please fill all fields..",
      });
      return;
    }
    const CertificationLevel = await certificationLevelModel.create({
      ...req.body,
    });
    if (!CertificationLevel) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: "Failed to create CertificationLevel..",
      });
      return;
    }
    res.status(201).json({
      status: 201,
      error: "201",
      message: "CertificationLevel created successfully..",
      data: CertificationLevel,
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

const getAllCertificationLevel = async (req, res) => {
  const { search } = req.body; // Destructure 'search' from req.body
  try {
    const filter = {};

    if (search && search.length > 0) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { certificateLevelName: regex },
        { levelName: regex },
        { description: regex },
      ];
    }

    const data = await certificationLevelModel.find(filter);

    res.status(200).json({ status: 200, totalRecords: data.length, data });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ status: 500, message: error.message });
  }
};

const getCertificationLevelById = async (req, res) => {
  try {
    const id = req.params.id;
    const CertificationLevel = await certificationLevelModel.findById(id);
    if (!CertificationLevel) {
      res.status(404).json({
        status: 404,
        error: 404,
        message: `CertificationLevel of id ${id} is not found`,
      });
      return;
    }
    res.status(200).json({ status: 200, error: 200, data: CertificationLevel });
  } catch (error) {
    console.error("Error fetching CertificationLevel:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateCertificationLevelById = async (req, res) => {
  try {
    const id = req.params.id;

    const CertificationUpdate = await certificationLevelModel.findByIdAndUpdate(
      id,
      { ...req.body }
    );

    if (!CertificationUpdate) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: `Failed to update CertificationLevel of ID ${id}.`,
      });
      return;
    }

    res
      .status(200)
      .json({ status: 200, error: "200", data: CertificationUpdate });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal server error" });
  }
};

const deleteCertificationLevelById = async (req, res) => {
  try {
    const id = req.params.id;
    const CertificationLevel = await certificationLevelModel.findByIdAndDelete(
      id
    );

    if (!CertificationLevel) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: `Failed to delete CertificationLevel of ID ${id}...`,
      });
      return;
    }
    res.status(200).json({
      status: 200,
      error: "200",
      message: `CertificationLevel of CertificationLevelID ${id} is successfully deleted..`,
    });
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal server error" });
  }
};
module.exports = {
  certificationLevelFilter,
  createCertificationLevel,
  getAllCertificationLevel,
  getCertificationLevelById,
  updateCertificationLevelById,
  deleteCertificationLevelById,
};

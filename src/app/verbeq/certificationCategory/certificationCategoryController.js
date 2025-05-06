const certificationCategoryModel = require("./certificationCategoryModel");

const certificationCetegoryFilter = async (req, res) => {
  const { search } = req.body;
  try {
    const filter = {};

    if (search && search.length > 0) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ certificateCategoryName: regex }, { description: regex }];
    }

    const data = await certificationCategoryModel.find(filter);

    res.status(200).json({ status: 200, totalRecords: data.length, data });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ status: 500, message: error.message });
  }
};
const createCertificationCategory = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: "Please fill all fields..",
      });
      return;
    }
    const CertificationCategory = await certificationCategoryModel.create({
      ...req.body,
    });
    if (!CertificationCategory) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: "Failed to create CertificationCategory..",
      });
      return;
    }
    res.status(201).json({
      status: 201,
      error: "201",
      message: "CertificationCategory created successfully..",
      data: CertificationCategory,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

const getAllCertificationCategory = async (req, res) => {
  const { search } = req.body;
  try {
    const filter = {};

    if (search && search.length > 0) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ certificateCategoryName: regex }, { description: regex }];
    }

    const data = await certificationCategoryModel.find(filter);

    res.status(200).json({ status: 200, totalRecords: data.length, data });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ status: 500, message: error.message });
  }
};

const getCertificationCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const CertificationCategory = await certificationCategoryModel.findById(id);
    if (!CertificationCategory) {
      res.status(404).json({
        status: 404,
        error: 404,
        message: `CertificationCategory of id ${id} is not found`,
      });
      return;
    }
    res
      .status(200)
      .json({ status: 200, error: 200, data: CertificationCategory });
  } catch (error) {
    console.error("Error fetching CertificationCategory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateCertificationCategoryById = async (req, res) => {
  try {
    const id = req.params.id;

    const CertificationCategoryUpdate =
      await certificationCategoryModel.findByIdAndUpdate(id, {
        ...req.body,
      });

    if (!CertificationCategoryUpdate) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: `Failed to update CertificationCategory of ID ${id}.`,
      });
      return;
    }

    res
      .status(200)
      .json({ status: 200, error: "200", data: CertificationCategoryUpdate });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal server error" });
  }
};

const deleteCertificationCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const CertificationCategory =
      await certificationCategoryModel.findByIdAndDelete(id);

    if (!CertificationCategory) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: `Failed to delete CertificationCategory of ID ${id}...`,
      });
      return;
    }
    res.status(200).json({
      status: 200,
      error: "200",
      message: `CertificationCategory of CertificationCategoryID ${id} is successfully deleted..`,
    });
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal server error" });
  }
};

module.exports = {
  certificationCetegoryFilter,
  createCertificationCategory,
  getAllCertificationCategory,
  getCertificationCategoryById,
  updateCertificationCategoryById,
  deleteCertificationCategoryById,
};

const certificateModel = require("./certificationModel");
const mockTestModel = require("../mockTest/mockTest.model");
const studentCertification = require("../StudentCertificationMapping/studentCertificationModel");
const studentCertificationModel = require("../StudentCertificationMapping/studentCertificationModel");
const certificateCategoryModel = require("../certificationCategory/certificationCategoryModel");
const certificateLevelModel = require("../certificationLevel/certificationLevelModel");

const certificationFilter = async (req, res) => {
  const { certificateLevelId, certificateCategoryId, coursefees, userId } =
    req.body;
  try {
    // Retrieve student certifications for the user
    const studentCertifications = await studentCertificationModel.find({
      userId,
      paymentStatus: "complete",
    });
    console.log("studentCertifications", studentCertifications);

    // Extract certification IDs and convert to string for comparison
    const studentCertificationIds = studentCertifications.map((cert) =>
      cert.certificationId.toString()
    );
    console.log("studentCertificationIds", studentCertificationIds);

    // Build filter object
    const filter = {};

    if (certificateLevelId.length > 0) {
      filter.certificateLevelId = { $in: certificateLevelId };
    }

    if (certificateCategoryId.length > 0) {
      filter.certificateCategoryId = { $in: certificateCategoryId };
    }

    if (coursefees.length > 0) {
      filter.coursefees = coursefees; // Implement your logic for coursefees filter
    }

    // Retrieve certifications from mockTestModel
    const certificates = await mockTestModel.find().select("certificationId");
    const certificationIds = certificates.map((c) => c.certificationId);

    // Retrieve certificates with filters applied and populate related fields
    const enrichedResults = await certificateModel
      .find({
        ...filter,
        _id: { $in: certificationIds },
      })
      .populate("certificateCategoryId certificateLevelId");

    enrichedResults.forEach((certificate) => {
      console.log("certificate._id", certificate._id.toString());
      const isPurchased = studentCertificationIds.includes(
        certificate._id.toString()
      );
      console.log("isPurchased", isPurchased);
      certificate.purchases = isPurchased;
    });

    res.status(200).json({
      status: 200,
      totalRecords: enrichedResults.length,
      result: enrichedResults,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: 500, message: error.message });
  }
};

const createCertification = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: "Please fill all fields..",
      });
      return;
    }
    const Certification = await certificateModel.create({
      ...req.body,
    });
    if (!Certification) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: "Failed to create Certification..",
      });
      return;
    }
    res.status(201).json({
      status: 201,
      error: "201",
      message: "Certification created successfully..",
      data: Certification,
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

const getAllCertification = async (req, res) => {
  try {
    const { search, start, limit } = req.body;
    const regex = search ? new RegExp(search, "i") : null;

    // Find matching certificate categories
    const categoryQuery = regex
      ? { $or: [{ categoryName: regex }, { description: regex }] }
      : {};
    const categoryResults = await certificateCategoryModel.find(categoryQuery);
    const categoryIds = categoryResults.map((category) => category._id);

    // Find matching certificate levels
    const levelQuery = regex
      ? { $or: [{ certificateLevelName: regex }, { description: regex }] }
      : {};
    const levelResults = await certificateLevelModel.find(levelQuery);
    const levelIds = levelResults.map((level) => level._id);

    // Construct the final filter for certificateModel.find()
    const filter = regex
      ? {
          $or: [
            { certificateCategoryId: { $in: categoryIds } },
            { certificateLevelId: { $in: levelIds } },
            { certificateName: regex },
            { description: regex },
            { coursefees: search },
            { amount: search },
          ],
        }
      : {};

    const Certification = await certificateModel
      .find(filter)
      .skip(start)
      .limit(limit)
      .populate("certificateCategoryId certificateLevelId");

    if (Certification.length === 0) {
      return res.status(404).json({
        status: 404,
        error: "404",
        message: "Certification data not found.",
      });
    }

    return res.status(200).json({
      status: 200,
      totalRecords: Certification.length,
      data: Certification,
    });
  } catch (error) {
    console.error("Error fetching Certification:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

const getCertificationById = async (req, res) => {
  try {
    const id = req.params.id;
    const Certification = await certificateModel
      .findById(id)
      .populate("certificateCategoryId certificateLevelId");
    if (!Certification) {
      res.status(404).json({
        status: 404,
        error: 404,
        message: `Certification of id ${id} is not found`,
      });
      return;
    }
    res.status(200).json({ status: 200, error: 200, data: Certification });
  } catch (error) {
    console.error("Error fetching Certification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateCertificationById = async (req, res) => {
  try {
    const id = req.params.id;

    const certificateUpdate = await certificateModel.findByIdAndUpdate(id, {
      ...req.body,
    });

    if (!certificateUpdate) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: `Failed to update Certification of ID ${id}.`,
      });
      return;
    }

    res
      .status(200)
      .json({ status: 200, error: "200", data: certificateUpdate });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal server error" });
  }
};

const deleteCertificationById = async (req, res) => {
  try {
    const id = req.params.id;
    const Certification = await certificateModel.findByIdAndDelete(id);

    if (!Certification) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: `Failed to delete Certification of ID ${id}...`,
      });
      return;
    }
    res.status(200).json({
      status: 200,
      error: "200",
      message: `Certification of CertificationID ${id} is successfully deleted..`,
    });
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal server error" });
  }
};
module.exports = {
  certificationFilter,
  createCertification,
  getAllCertification,
  getCertificationById,
  updateCertificationById,
  deleteCertificationById,
};

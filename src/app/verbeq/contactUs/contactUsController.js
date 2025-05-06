const contactUsModel = require("./contactUsModel");

const createContactUs = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: "Please fill all fields..",
      });
      return;
    }
    const ContactUs = await contactUsModel.create({
      ...req.body,
    });
    if (!ContactUs) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: "Failed to create ContactUs..",
      });
      return;
    }
    res.status(201).json({
      status: 201,
      error: "201",
      message: "ContactUs created successfully..",
      data: ContactUs,
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

const getAllContactUs = async (req, res) => {
  const { search } = req.body; // Destructure 'search' from req.body
  try {
    const filter = {};

    if (search && search.length > 0) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { name: regex },
        { email: regex },
        { country: regex },
        { description: regex },
      ];
    }

    const data = await contactUsModel.find(filter);

    res.status(200).json({ status: 200, totalRecords: data.length, data });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ status: 500, message: error.message });
  }
};

const getContactUsById = async (req, res) => {
  try {
    const id = req.params.id;
    const ContactUs = await contactUsModel.findById(id);

    if (!ContactUs) {
      res.status(404).json({
        status: 404,
        error: 404,
        message: `ContactUs of id ${id} is not found`,
      });
      return;
    }
    res.status(200).json({ status: 200, error: 200, data: ContactUs });
  } catch (error) {
    console.error("Error fetching ContactUs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateContactUsById = async (req, res) => {
  try {
    const id = req.params.id;

    const ContactUsUpdate = await contactUsModel.findByIdAndUpdate(id, {
      ...req.body,
    });

    if (!ContactUsUpdate) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: `Failed to update ContactUs of ID ${id}.`,
      });
      return;
    }

    res.status(200).json({ status: 200, error: "200", data: ContactUsUpdate });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal server error" });
  }
};

const deleteContactUsById = async (req, res) => {
  try {
    const id = req.params.id;
    const ContactUs = await contactUsModel.findByIdAndDelete(id);

    if (!ContactUs) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: `Failed to delete ContactUs of ID ${id}...`,
      });
      return;
    }
    res.status(200).json({
      status: 200,
      error: "200",
      message: `ContactUs of ContactUsID ${id} is successfully deleted..`,
    });
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal server error" });
  }
};
module.exports = {
  createContactUs,
  getAllContactUs,
  getContactUsById,
  updateContactUsById,
  deleteContactUsById,
};

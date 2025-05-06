const apiInfoModel = require("./apiInfoModel");

const ApiInfoFilter = async (req, res) => {
  try {
    const result = await apiInfoModel.find();
    if (result.length === 0) {
      res.status(404).json({ status: 404, message: "ApiInfo is not found.." });
      return;
    }
    res.status(200).json({ status: 200, totalRecords: result.length, result });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ status: 500, message: error });
    return;
  }
};

const createApiInfo = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: "Please fill all fields..",
      });
      return;
    }
    const ApiInfo = await apiInfoModel.create({
      ...req.body,
    });
    if (!ApiInfo) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: "Failed to create ApiInfo..",
      });
      return;
    }
    res.status(201).json({
      status: 201,
      error: "201",
      message: "ApiInfo created successfully..",
      data: ApiInfo,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

const getAllApiInfo = async (req, res) => {
  const { search } = req.body; // Destructure 'search' from req.body
  try {
    const filter = {};

    if (search && search.length > 0) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ ApiInfoTitle: regex }, { authorName: regex }];
    }

    const data = await apiInfoModel.find(filter);

    res.status(200).json({ status: 200, totalRecords: data.length, data });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ status: 500, message: error.message });
  }
};

const getApiInfoById = async (req, res) => {
  try {
    const id = req.params.id;
    const ApiInfo = await apiInfoModel.findById(id);

    if (!ApiInfo) {
      res.status(404).json({
        status: 404,
        error: 404,
        message: `ApiInfo of id ${id} is not found`,
      });
      return;
    }
    res.status(200).json({ status: 200, error: 200, data: ApiInfo });
  } catch (error) {
    console.error("Error fetching ApiInfo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateApiInfoById = async (req, res) => {
  try {
    const id = req.params.id;

    const ApiInfoUpdate = await apiInfoModel.findByIdAndUpdate(id, {
      ...req.body,
    });

    if (!ApiInfoUpdate) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: `Failed to update ApiInfo of ID ${id}.`,
      });
      return;
    }

    res.status(200).json({ status: 200, error: "200", data: ApiInfoUpdate });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal server error" });
  }
};

const deleteApiInfoById = async (req, res) => {
  try {
    const id = req.params.id;
    const ApiInfo = await apiInfoModel.findByIdAndDelete(id);

    if (!ApiInfo) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: `Failed to delete ApiInfo of ID ${id}...`,
      });
      return;
    }
    res.status(200).json({
      status: 200,
      error: "200",
      message: `ApiInfo of ApiInfoID ${id} is successfully deleted..`,
    });
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal server error" });
  }
};
module.exports = {
  ApiInfoFilter,
  createApiInfo,
  getAllApiInfo,
  getApiInfoById,
  updateApiInfoById,
  deleteApiInfoById,
};

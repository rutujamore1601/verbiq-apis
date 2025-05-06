const logModel = require("./logModel");
const studentRegistration = require("../studentRegistration/studentRegistration.model");

const getAllLogs = async (req, res) => {
  try {
    const { search } = req.body;
    const regex = search ? new RegExp(search, "i") : null;

    // Find matching certificate categories
    const userQuery = regex
      ? { $or: [{ fullName: regex }, { email: regex }] }
      : {};
    const userResults = await studentRegistration.find(userQuery);
    const userIds = userResults.map((user) => user._id);

    // Construct the final filter for certificateModel.find()
    const filter = regex
      ? {
          $or: [
            { userId: { $in: userIds } },
            { statusCode: regex },
            { descmethodription: regex },
            { url: regex },
          ],
        }
      : {};

    const Log = await logModel.find(filter).populate("userId");

    if (Log.length === 0) {
      return res.status(404).json({
        status: 404,
        error: "404",
        message: "Log data not found.",
      });
    }

    return res.status(200).json({
      status: 200,
      totalRecords: Log.length,
      data: Log,
    });
  } catch (error) {
    console.error("Error fetching Certification:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

module.exports = { getAllLogs };

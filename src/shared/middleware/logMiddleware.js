const Log = require("../../app/verbeq/log/logModel");
const candidateDetailsModel = require("../../app/verbeq/studentRegistration/studentRegistration.model");
const jwt = require("jsonwebtoken");

const requestLogger = async (req, res, next) => {
  const token =
    req.header("Authorization")?.replace("Bearer ", "") || req.query.token;
  // const token3 = req.query.token;
  // console.log("token3", token3);

  const deviceInfo = req.headers["user-agent"] || "Unknown device";
  const loginEndpoints = [
    "/candidateDetails/adminLogin",
    "/candidateDetails/createcandidateDetails",
    "/candidateDetails/login",
    "/country/getAllCountry",
    "/contactus/createContactUs",
    // "/certification/certificationFilter",
    // "/certificationCategory/getAllCertificationCategory",
    // "/certificationLevel/getAllCertificationLevel",
    // "/certification/getCertificationById",
    // "/blog/getAllBlog",
    // "/blog/getBlogById",
    // "/ebook/getAllEBook",
    // "/ebook/getEBookById",
    // "/faq/getAllFAQuestion",
    // "/faq/getFAQuestionById",
    // "/ourspeakers/getAllOurSpeakers",
    // "/testimonials/getAllTestimonials",
    // "/testimonials/getTestimonialsById",
    // "/events/getAllEvents",
    // "/events/getAllEventsById",
    // "/report/getAllReport",
    // "/report/getReportById",
    // "/academicChallenges/getAcademicChallengesById",
    // "/events/getUpcomingEvent",
    // "/eventRegistration/createEventRegistration",
  ];

  const isLoginApi = loginEndpoints.includes(
    req.originalUrl.split("/").slice(0, 3).join("/")
  );

  if (!token && !isLoginApi) {
    return res
      .status(401)
      .json({ status: 401, message: "Unauthorized user..." });
  }

  let user = null;
  let statusCode = null;

  try {
    if (token && !isLoginApi) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      user = await candidateDetailsModel.findOne({ _id: decoded.userId });

      const logEntry = new Log({
        userId: user ? user._id : null,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        headers: req.headers,
        body: req.body,
        device: deviceInfo,
      });
      await logEntry.save();
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    statusCode = 401;

    if (token && !isLoginApi) {
      const logEntry = new Log({
        userId: null,
        method: req.method,
        url: req.originalUrl,
        statusCode: statusCode,
        headers: req.headers,
        body: req.body,
        device: deviceInfo,
      });

      try {
        await logEntry.save();
      } catch (logError) {
        console.error("Failed to log request:", logError);
        return res
          .status(500)
          .json({ status: 500, message: "Failed to log request..." });
      }
    }

    return res
      .status(401)
      .json({ status: 401, message: "Unauthorized user..." });
  }

  next();
};

module.exports = requestLogger;

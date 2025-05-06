const verbeq = (app) => {
  // Add your middleware here if needed
  app.use(
    "/studentRegistration",
    require("../app/verbeq/studentRegistration/studentRegistration.router")
  );
  app.use(
    "/uploadVideo",
    require("../app/verbeq/uploadVideo/uploadVideo.router")
  );
  app.use(
    "/uploadImage",
    require("../app/verbeq/uploadImage/uploadImage.router")
  );
  app.use("/adminUser", require("../app/verbeq/adminUser/adminUser.router"));
  app.use("/country", require("../app/verbeq/country/countryRoutes"));
  app.use(
    "/upload",
    require("../app/verbeq/questionAudioUpload/questionLinkAudioRoutes")
  );
  app.use(
    "/mappingData",
    require("../app/verbeq/mappingData/mappingData.router")
  );
  app.use("/contactus", require("../app/verbeq/contactUs/contactUsRoutes"));
  app.use("/blog", require("../app/verbeq/blogs/blogRoutes"));
  app.use(
    "/faq",
    require("../app/verbeq/frequentlyAskedQuestions/frequentlyAskedQuestionsRoutes")
  );
  app.use(
    "/mockTestAttempt",
    require("../app/verbeq/mockTestAttempt/mockTestAttemptRoutes")
  );
  app.use("/log", require("../app/verbeq/log/logRoutes"));
  app.use("/apiInfo", require("../app/verbeq/apiInfo/apiInfoRoutes"));
  app.use("/instruction", require("../app/verbeq/instruction/instruction.router"));
  app.use("/types", require("../app/verbeq/types/types.router"));
  app.use("/questions", require("../app/verbeq/questions/questions.router"));
  app.use("/setting", require("../app/verbeq/setting/setting.router"));
  app.use("/session", require("../app/verbeq/session/session.router"));
  app.use("/questionBookMark", require("../app/verbeq/questionBookMark/questionBookMark.router"));
};

const routes = {
  verbeq,
};

module.exports = routes[process.env.PROJ_NAME];

// Packages/files Imports
const express = require("express");
const cors = require("cors");
const config = require("./src/config/config");
const http = require("http");
const path = require("path");
// const cors = require("cors");
const loggerToFile = require("./logs/log");
const requestLogger = require("./src/shared/middleware/logMiddleware");
const helmet = require("helmet");

require("./src/config/dbConnection");

const app = express();
const server = http.createServer(app);

//BodyParsing
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({ origin: true }));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.set("views", path.join(__dirname, "views"));
//Payment
app.set("view engine", "ejs");
//CORS allow
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

app.use(loggerToFile);

app.get("/", (req, res) => {
  res.send("Hii verbeq");
});

// app.use(requestLogger);
// Serve uploaded files statically
app.use(express.static("verbeq/Public"));
app.use("/Qaudio", express.static(path.join(__dirname, "public/Qaudio")));
app.use(express.static(path.join(__dirname, 'public')));

app.use("/audio", express.static(path.join(__dirname, "public/audio")));
app.use("/questionAudioLink", express.static(path.join(__dirname, "public/questionAudioLink")));

app.use(express.static('public'));


// Importing all the routes
require("./src/config/routeRegistry")(app);

// Listen Server
server.listen(config.app.port, '0.0.0.0', () => {
  console.log(
    `### Server is running on port ${config.app.port} - ${process.env.ENVIRONMENT}`
  );
});

// Socket implementation for reference
require("./src/shared/utils/socket.util").ioSocket(server);






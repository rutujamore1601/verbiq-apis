const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const accessLogPath = path.join(__dirname, "access.log");
const accessLogStream = fs.createWriteStream(accessLogPath, { flags: "a" });

// Define custom morgan token for request body
morgan.token("req-body", (req) => JSON.stringify(req.body));

// Define custom morgan token for combined format
morgan.token("combined", morgan.combined);

// Define custom format string with request body and combined format
const loggerFormat =
  '[:date[clf]] :method :url :status :res[content-length] - :response-time ms :req-body : :remote-addr - :remote-user [:date[clf]] HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

// Setup morgan logger with custom format
const logger = morgan(loggerFormat, { stream: accessLogStream });

const loggerToFile = (req, res, next) => {
  logger(req, res, (err) => {
    if (err) {
      console.error("Error logging to file:", err);
    }
    next();
  });
};

module.exports = loggerToFile;

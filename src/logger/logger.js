const path = require("path");
const fs = require("fs");
const logger = () => {
  var accessLogStream = fs.createWriteStream(
    path.join(__dirname, "/logs.txt"),
    {
      flags: "a",
    }
  );

  return morgan(":method :url :status :response-time ms", {
    stream: accessLogStream,
  });
};
module.exports = logger;

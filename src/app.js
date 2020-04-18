const express = require("express");
const app = express();
const logger = require("./logger/logger");
const userRoute = require("./routes/user.route");
app.use(logger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/users", userRoute);

module.exports = app;

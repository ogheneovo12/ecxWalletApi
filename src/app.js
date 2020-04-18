const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const logger = require("./logger/logger");
const apiRoute = require("./routes/");
const path = require("path");
app.use(logger());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "/public")));

app.use("/api", apiRoute);

module.exports = app;

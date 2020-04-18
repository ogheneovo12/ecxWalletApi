const express = require("express");
const logRoute = express.Router();
const fs = require("fs");
const path = require("path");
logRoute.get("/", (req, res) => {
  fs.readFile(path.join(__dirname, "../logger/logs.txt"), (err, log) => {
    if (err) {
      console.log(err);
    }
    res.send(log);
  });
});

module.exports = logRoute;

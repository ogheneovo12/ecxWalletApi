const express = require("express");
const apiRoute = express.Router();
const userRoute = require("./user.route");
const logRoute = require("./log.route");
apiRoute.use("/users", userRoute);
apiRoute.use("/logs", logRoute);
module.exports = apiRoute;

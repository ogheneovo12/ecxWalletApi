const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const logger = require("./logger/logger");
const apiRoute = require("./routes/");
const path = require("path");
const cors = require("cors")
app.use(logger());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "/public")));
const whitelist = ['http://localhost', 'http://127.0.0.1'];
var checkForvalidIp = (req, callback)=>{
    const Options = {
        methods: ["GET", "PUT", "POST", "DELETE", "HEAD", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    };
  
    const currentIpAddress = req.connection.remoteAddress; 
    Options.origin = whitelist.includes(currentIpAddress)?true:false;
     callback(null,Options)
  }
  
app.use(cors(checkForvalidIp));
app.use("/api", apiRoute);

module.exports = app;

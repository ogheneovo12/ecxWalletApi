const mongoose = require("mongoose");
module.exports = function (config) {
  mongoose
    .connect(dbUrl, { useUnifiedTopology: true }) //{ useUnifiedTopology: true } was passed to monitor mongo server, you can remove it
    .then(() => console.log("DATABASE CONNECTED"))
    .catch((err) => console.log("DB connection error!"));
  mongoose.connection.on("error", (err) =>
    console.error.bind(console, "DB connection error!")
  );
  mongoose.connection.on(
    "disconected",
    console.error.bind(console, "DATABASE DISCONNECTED")
  );
  process.on("SIGINT", () => {
    console.log(
      "mongoose default connection is disconnected due to application termination"
    );
    process.exit(0);
  });
};

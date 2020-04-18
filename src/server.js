const http = require("http");
const app = require("./app");
const config = require("./config/index.config");
const dbConnect = require("./db/mongoConnect");
const server = http.createServer(app);

server.listen(config.PORT, () => {
  console.log(`server is connected`);
  console.log(`connecting to db...`);
  dbConnect(config);
});

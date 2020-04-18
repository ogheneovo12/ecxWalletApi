module.exports = {
  VERSION: 1,
  BUILD: 1,
  URL: "http://127.0.0.1",
  API_PATH: "/api",
  PORT: process.env.PORT || 3000,
  saltRounds: parseInt(process.env.SALTROUNDS) || 12,
  SECRET: process.env.SECRET || "30_DAYSOF_CODE@_DSC_@2020",
  MONGODB_URL: process.env.MONGODB_URL || `mongodb://localhost:27017/ecx`,
  DB: {
    //MongoDB configuration
    HOST: "localhost",
    PORT: "27017",
    DATABASE: "ecx",
  },
};

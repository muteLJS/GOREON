const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 8080,
  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017",
  mongodbDbName: process.env.MONGODB_DB_NAME || "goreon",
  dnsServers: (process.env.DNS_SERVERS || "1.1.1.1,8.8.8.8")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean),
  clientOrigin: process.env.CLIENT_ORIGIN || true,
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
};

module.exports = env;

const path = require("node:path");
const dns = require("node:dns");

const dotenv = require("dotenv");
const mongoose = require("mongoose");

const { syncAllProductRatings } = require("../src/utils/syncProductRatings");

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

async function run() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  dns.setServers(
    (process.env.DNS_SERVERS || "1.1.1.1,8.8.8.8")
      .split(",")
      .map((server) => server.trim())
      .filter(Boolean),
  );

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB_NAME,
  });

  const result = await syncAllProductRatings();

  console.log(`Updated ratings for ${result.matchedProducts} products`);
}

run()
  .catch((error) => {
    console.error("Failed to sync product ratings:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

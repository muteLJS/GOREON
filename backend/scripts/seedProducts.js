const fs = require("node:fs");
const path = require("node:path");
const dns = require("node:dns");

const dotenv = require("dotenv");
const mongoose = require("mongoose");

const Product = require("../src/models/Product");

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const DATA_SOURCE = "backend/data/products_list.json";
const dataPath = path.resolve(__dirname, "../data/products_list.json");

const seedProducts = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  dns.setServers(
    (process.env.DNS_SERVERS || "1.1.1.1,8.8.8.8")
      .split(",")
      .map((server) => server.trim())
      .filter(Boolean),
  );

  const rawData = fs.readFileSync(dataPath, "utf8").replace(/^\uFEFF/, "");
  const products = JSON.parse(rawData);

  if (!Array.isArray(products)) {
    throw new Error(`${DATA_SOURCE} must contain a JSON array`);
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB_NAME,
  });

  const deleteResult = await Product.deleteMany({});
  const insertedProducts = await Product.collection.insertMany(products, { ordered: false });

  console.log(`Seeded products from ${DATA_SOURCE}`);
  console.log(`Deleted ${deleteResult.deletedCount}, inserted ${insertedProducts.insertedCount}`);
};

seedProducts()
  .catch((error) => {
    console.error("Failed to seed products:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

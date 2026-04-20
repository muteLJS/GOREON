const fs = require("node:fs");
const path = require("node:path");
const dns = require("node:dns");

const dotenv = require("dotenv");
const mongoose = require("mongoose");

const Product = require("../src/models/Product");

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const DATA_SOURCE = "products_list.json";
const dataPath = path.resolve(__dirname, "../../frontend/src/data/products_list.json");

const parsePrice = (value) => {
  if (typeof value === "number") {
    return value;
  }

  const parsed = Number(String(value || "").replace(/[^\d]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeProduct = (product) => {
  const tags = Array.isArray(product.tag) ? product.tag : [];
  const [brand = "", category = ""] = tags;

  return {
    name: product.name,
    brand,
    category,
    description: product.url || "",
    price: parsePrice(product.price),
    stock: 100,
    image: product.image || "",
    averageRating: Number(product.rating) || 0,
    specs: {
      source: DATA_SOURCE,
      sourceId: product.id,
      url: product.url || "",
      tags,
      priceOptions: Array.isArray(product.priceOptions)
        ? product.priceOptions.map((option) => ({
            optionName: option.optionName || "",
            price: parsePrice(option.price),
          }))
        : [],
      detailImages: Array.isArray(product.detailImages) ? product.detailImages : [],
    },
  };
};

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
  const products = JSON.parse(rawData).map(normalizeProduct);

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB_NAME,
  });

  const deleteResult = await Product.deleteMany({ "specs.source": DATA_SOURCE });
  const insertedProducts = await Product.insertMany(products, { ordered: false });

  console.log(
    `Seeded products: deleted ${deleteResult.deletedCount}, inserted ${insertedProducts.length}`,
  );
};

seedProducts()
  .catch((error) => {
    console.error("Failed to seed products:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

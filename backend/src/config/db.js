const mongoose = require("mongoose");

const env = require("./env");

async function connectDb() {
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.mongodbUri, {
    dbName: env.mongodbDbName,
  });

  console.log(`MongoDB connected: ${env.mongodbDbName}`);
}

module.exports = { connectDb };

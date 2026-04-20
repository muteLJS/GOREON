require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 8081;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
  });
};

startServer();

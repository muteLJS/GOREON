const env = require("./config/env");
const { connectDb } = require("./config/db");
const { createApp } = require("./app");

async function startServer() {
  await connectDb();

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`Backend server listening on port ${env.port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start backend server", error);
  process.exit(1);
});

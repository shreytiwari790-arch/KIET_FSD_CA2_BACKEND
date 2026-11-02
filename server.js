require("dotenv").config();

const mongoose = require("mongoose");
const createApp = require("./app");

const port = Number(process.env.PORT) || 3000;
const mongoUri = process.env.MONGODB_URI;

async function startServer() {
  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable is required");
  }

  await mongoose.connect(mongoUri);
  createApp().listen(port, () => {
    console.log(`Student Feedback API listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start Student Feedback API:", error);
  process.exitCode = 1;
});

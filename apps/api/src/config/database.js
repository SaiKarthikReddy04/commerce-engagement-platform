import mongoose from "mongoose";

export async function connectDatabase() {
  const { MONGO_URI } = process.env;

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is missing from the API environment.");
  }

  await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  console.log(`Connected to MongoDB database: ${mongoose.connection.name}`);
}
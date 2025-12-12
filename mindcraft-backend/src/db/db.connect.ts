import mongoose from "mongoose";

export default async function initDB() {
  try {
    await mongoose.connect(process.env.DB_URI as string);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    return;
  }
}

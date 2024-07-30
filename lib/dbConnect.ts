import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function dbConnect() {
  try {
    console.log("Connected to: ", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI!);
  } catch (error) {
    console.log("Connection error");
    throw new Error("Connection Failed!");
  }
}

export default dbConnect;

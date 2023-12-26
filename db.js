import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_DB_URI);
  console.log("MongoDB Connected");
};

export default connectDB;

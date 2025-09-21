import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
    process.exit(1);
  }
};

export default connectDB;

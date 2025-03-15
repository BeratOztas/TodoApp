import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB'ye başarıyla bağlandı!");
  } catch (error: any) {
    console.error("❌ MongoDB bağlantı hatası:", error.message);
    process.exit(1);
  }
};

export default connectDB;

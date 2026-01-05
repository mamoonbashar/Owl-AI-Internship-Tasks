import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new error("Mongo Url is missing ");
    }
    const connect = await mongoose.connect(process.env.MONGO_URL);
    console.log(`✅ MongoDB connected,${connect.connection.host}`);
  } catch (error) {
    process.exit(1);
  }
};
export default connectDB;

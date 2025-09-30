import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const db = process.env.MONGO_URI as string;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(db);
    const hostPort = `${conn.connection.host}:${conn.connection.port}`;
    const dbName = conn.connection.name;
    console.log(`MongoDB is Connected: ${hostPort}/${dbName}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;

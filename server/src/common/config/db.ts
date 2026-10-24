import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

// Fix for Windows DNS resolution with mongodb+srv
// Many local ISP DNS servers reject SRV queries; setting public DNS fixes ECONNREFUSED
dns.setServers(['8.8.8.8', '1.1.1.1']);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pigopiops';

export async function connectDB(): Promise<void> {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`✅ MongoDB Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    console.error('👉 TIP: Ensure MongoDB is running locally, or verify your MONGODB_URI in server/.env.');
    process.exit(1);
  }
}

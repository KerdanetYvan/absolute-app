import mongoose from 'mongoose';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGO_URI; // Correct variable name
const DB_NAME = process.env.DB_NAME;

if (!MONGODB_URI) {
  throw new Error('Veuillez définir MONGO_URI dans votre fichier .env');
}

let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null; } = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: DB_NAME, // Force the database name
    };

    console.log(`🔄 Connecting to MongoDB database: ${DB_NAME}`);
    cached.promise = mongoose.connect(MONGODB_URI as string, opts);
  }

  try {
    cached.conn = await cached.promise;
    console.log(`📦 Connected to MongoDB database: ${DB_NAME}`);
  } catch (e) {
    cached.promise = null;
    console.error(`❌ Failed to connect to MongoDB database: ${DB_NAME}`, e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
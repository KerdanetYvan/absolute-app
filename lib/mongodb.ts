import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/absolute_app';

if (!MONGODB_URI) {
  throw new Error('Veuillez définir l\'URI MongoDB');
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
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/absolute-app';

// Cache connection to avoid multiple connections during development
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log('📦 Connected to MongoDB');
        return cached.conn;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
}

import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  uri: string | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
  uri: null,
};
global.mongooseCache = cached;

function getMongoUri() {
  const uri = process.env.MONGODB_URI?.trim();

  if (uri) return uri;

  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    throw new Error(
      "MONGODB_URI belum dikonfigurasi. Tambahkan di Vercel → Settings → Environment Variables."
    );
  }

  return "mongodb://127.0.0.1:27017/katar11-lomba";
}

export async function connectDB() {
  const uri = getMongoUri();

  if (cached.uri && cached.uri !== uri) {
    if (cached.conn) await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
  }

  cached.uri = uri;

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 1,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    throw error;
  }

  return cached.conn;
}

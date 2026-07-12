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
  return process.env.MONGODB_URI || "mongodb://localhost:27017/katar11-lomba";
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

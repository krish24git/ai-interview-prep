import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

const MONGODB_URI_STRING = MONGODB_URI;

declare global {
  var mongooseGlobal: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  } | undefined;
}

const cached =
  globalThis.mongooseGlobal ??
  (globalThis.mongooseGlobal = {
    conn: null,
    promise: null,
  });

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
  .connect(MONGODB_URI_STRING, {
    dbName: "ai-interview-prep",
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:");
    console.error(err);
    throw err;
  });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
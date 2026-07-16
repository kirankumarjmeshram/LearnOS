// import "server-only";

// import mongoose from "mongoose";

// import { getMongoEnv } from "@/lib/env";

// const globalForMongoose = global;
// const cached = globalForMongoose.mongoose || { connection: null, promise: null };

// export async function connectToDatabase() {
//   if (cached.connection) return cached.connection;
//   if (!cached.promise) cached.promise = mongoose.connect(getMongoEnv().MONGODB_URI, { bufferCommands: false });
//   cached.connection = await cached.promise;
//   globalForMongoose.mongoose = cached;
//   return cached.connection;
// }
import "server-only";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {

    cached.promise = mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.promise;

  return cached.conn;
}
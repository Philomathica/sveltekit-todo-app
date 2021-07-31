import { config } from 'dotenv';
config();
import { Db, MongoClient } from 'mongodb';

const { MONGODB_URI, MONGODB_DB } = process.env;
type MongoConnection = { client: MongoClient; db: Db };

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached: { conn: MongoConnection; promise: Promise<MongoConnection> } = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<MongoConnection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = MongoClient.connect(MONGODB_URI).then(client => ({ client, db: client.db(MONGODB_DB) }));
  }
  cached.conn = await cached.promise;

  return cached.conn;
}

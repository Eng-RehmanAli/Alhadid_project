import { MongoClient, type Db } from "mongodb";
import mongoose from "mongoose";

const DB_NAME = "alhadid";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _mongoosePromise: Promise<typeof mongoose> | undefined;
}

function getMongoUri() {
  const uri = process.env.mongodb_url;
  if (!uri) {
    throw new Error("Missing mongodb_url environment variable");
  }
  return uri;
}

function getClientPromise() {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(getMongoUri()).connect();
  }
  return global._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(DB_NAME);
}

export async function connectMongo(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!global._mongoosePromise) {
    global._mongoosePromise = mongoose.connect(getMongoUri(), {
      dbName: DB_NAME,
    });
  }

  try {
    await global._mongoosePromise;
  } catch (error) {
    global._mongoosePromise = undefined;
    throw error;
  }

  return mongoose;
}

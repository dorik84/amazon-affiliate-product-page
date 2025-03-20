// keep it in case i need to use it in the future
import { MongoClient } from "mongodb";
import "@/lib/envConfig";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}
if (!process.env.MONGODB_DB) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_DB"');
}

const uri = process.env.MONGODB_URI;
const options = {
  dbName: process.env.MONGODB_DB,
};

let client;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

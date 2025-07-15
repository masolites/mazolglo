import { MongoClient } from "mongodb";
const uri = process.env.MONGODB_URI;
let client;
export async function connectToDatabase() {
  if (!client) client = new MongoClient(uri);
  if (!client.topology?.isConnected()) await client.connect();
  const db = client.db();
  return { db };
}

import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const { db } = await connectToDatabase();
  const deposits = await db.collection("manual_deposits").find({ status: "pending" }).toArray();
  res.status(200).json({ deposits });
}

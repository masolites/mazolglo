import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const { wallet, amount, date, time, proof } = req.body;
    if (!wallet || !amount || !date || !time) return res.status(400).json({ error: "Missing fields" });

    const { db } = await connectToDatabase();
    await db.collection("manual_deposits").insertOne({
      wallet, amount, date, time, proof: proof || null, status: "pending", createdAt: new Date()
    });
    return res.status(200).json({ message: "Deposit submitted, pending admin approval." });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}

import { connectToDatabase } from '../../lib/mongodb';
import { sendMazolTokens } from '../../lib/thirdweb';

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { email, wallet, amount, txHash } = req.body;
  if (!email || !wallet || !amount || !txHash) return res.status(400).json({ error: "Missing fields" });

  // Optionally: verify txHash on-chain for USDT payment (not implemented here)
  const { db } = await connectToDatabase();
  await db.collection("flexible_purchases").insertOne({
    email, wallet, amount, txHash, status: "completed", createdAt: new Date()
  });

  await sendMazolTokens(wallet, amount);

  // TODO: Add affiliate reward logic here

  return res.status(200).json({ message: "USDT purchase successful, tokens sent." });

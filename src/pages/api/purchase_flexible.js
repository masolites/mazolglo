import { connectToDatabase } from '../../lib/mongodb';
import { sendMazolTokens } from '../../lib/thirdweb';

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { email, wallet, amount, referrerEmail, txHash } = req.body;
  if (!email || !wallet || !amount || !referrerEmail || !txHash) return res.status(400).json({ error: "Missing fields" });

  const { db } = await connectToDatabase();

  await db.collection("flexible_purchases").insertOne({
    email, wallet, amount, referrerEmail, txHash, createdAt: new Date()
  });

  await sendMazolTokens(wallet, amount);

  // TODO: Affiliate reward logic

  return res.status(200).json({ message: "Flexible price purchase successful, tokens sent." });
}

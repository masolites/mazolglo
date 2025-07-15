 import { connectToDatabase } from '../../lib/mongodb';
import { sendMazolTokens } from '../../lib/thirdweb';
import { handleAffiliateRewards } from '../../lib/affiliate';

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { email, wallet, amount, referrerEmail, txHash } = req.body;
  if (!email || !wallet || !amount || !referrerEmail || !txHash) return res.status(400).json({ error: "Missing fields" });

  const { db } = await connectToDatabase();

  // Save purchase
  await db.collection("flexible_purchases").insertOne({
    email, wallet, amount, referrerEmail, txHash, createdAt: new Date()
  });

  // Send Mazol tokens to user
  await sendMazolTokens(wallet, amount);

  // Affiliate reward logic
  await handleAffiliateRewards(db, email, referrerEmail, wallet, amount);

  return res.status(200).json({ message: "Flexible price purchase successful, tokens sent." });
}

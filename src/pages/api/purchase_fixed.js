import { connectToDatabase } from '../../lib/mongodb';
import { sendMazolTokens } from '../../lib/thirdweb';

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { email, wallet, amount, referrerEmail } = req.body;
  if (!email || !wallet || !amount) return res.status(400).json({ error: "Missing fields" });

  const { db } = await connectToDatabase();

  await db.collection("fixed_purchases").insertOne({
    email, wallet, amount, referrerEmail: referrerEmail || null, createdAt: new Date()
  });

  await sendMazolTokens(wallet, amount);

  // TODO: MLM reward logic

  return res.status(200).json({ message: "Fixed price purchase successful, tokens sent." });
}

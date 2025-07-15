import { connectToDatabase } from '../../lib/mongodb';
import { sendMazolTokens } from '../../lib/thirdweb';
import { handleMLMRewards } from '../../lib/mlm';

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { email, wallet, amount, referrerEmail } = req.body;
  if (!email || !wallet || !amount) return res.status(400).json({ error: "Missing fields" });

  const { db } = await connectToDatabase();

  // Save purchase
  await db.collection("fixed_purchases").insertOne({
    email, wallet, amount, referrerEmail: referrerEmail || null, createdAt: new Date()
  });

  // Send Mazol tokens to user
  await sendMazolTokens(wallet, amount);

  // MLM reward logic
  await handleMLMRewards(db, email, amount, referrerEmail);

  return res.status(200).json({ message: "Fixed price purchase successful, tokens sent." });
}

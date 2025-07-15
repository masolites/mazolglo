import { connectToDatabase } from '../../lib/mongodb';
import { sendMazolTokens } from '../../lib/thirdweb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { fromEmail, pin, toWallet, amount } = req.body;
  if (!fromEmail || !pin || !toWallet || !amount) return res.status(400).json({ error: "Missing fields" });

  const { db } = await connectToDatabase();
  const user = await db.collection("users").findOne({ email: fromEmail });
  if (!user) return res.status(404).json({ error: "Sender not found" });
  const valid = await bcrypt.compare(pin, user.pin);
  if (!valid) return res.status(400).json({ error: "Invalid PIN" });

  // TODO: Check sender balance, deduct, log transfer

  await sendMazolTokens(toWallet, amount);

  await db.collection("transfers").insertOne({
    from: fromEmail,
    to: toWallet,
    amount,
    createdAt: new Date()
  });

  return res.status(200).json({ message: "Transfer successful." });
}

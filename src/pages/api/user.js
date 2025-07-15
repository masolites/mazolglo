 import { connectToDatabase } from '../../lib/mongodb';
import { createPlatformWallet } from '../../lib/thirdweb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  const { action, email, pin, backupEmail } = req.body;
  const { db } = await connectToDatabase();

  if (req.method === "POST") {
    if (action === "register") {
      if (!email || !pin) return res.status(400).json({ error: "Missing fields" });
      const user = await db.collection("users").findOne({ email });
      if (user) return res.status(400).json({ error: "User exists" });

      const hashedPin = await bcrypt.hash(pin, 10);
      const wallet = await createPlatformWallet(email);
      await db.collection("users").insertOne({
        email,
        pin: hashedPin,
        wallet,
        backupEmail: backupEmail || null,
        createdAt: new Date(),
      });
      return res.status(200).json({ wallet });
    }
    if (action === "login") {
      const user = await db.collection("users").findOne({ email });
      if (!user) return res.status(400).json({ error: "User not found" });
      const valid = await bcrypt.compare(pin, user.pin);
      if (!valid) return res.status(400).json({ error: "Invalid PIN" });
      return res.status(200).json({ wallet: user.wallet });
    }
  }
  res.status(405).json({ error: "Method not allowed" });
}

import { connectToDatabase } from '../../lib/mongodb';
import { sendMazolTokens } from '../../lib/thirdweb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { depositId, approve } = req.body;
  const { db } = await connectToDatabase();
  const deposit = await db.collection("manual_deposits").findOne({ _id: new ObjectId(depositId) });
  if (!deposit) return res.status(404).json({ error: "Deposit not found" });

  if (approve) {
    await sendMazolTokens(deposit.wallet, deposit.amount);
    await db.collection("manual_deposits").updateOne({ _id: new ObjectId(depositId) }, { $set: { status: "approved" } });
    // TODO: MLM or affiliate logic here
    return res.status(200).json({ message: "Deposit approved and tokens sent." });
  } else {
    await db.collection("manual_deposits").updateOne({ _id: new ObjectId(depositId) }, { $set: { status: "rejected" } });
    return res.status(200).json({ message: "Deposit rejected." });
  }
}

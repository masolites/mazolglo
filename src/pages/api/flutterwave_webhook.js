import { connectToDatabase } from '../../lib/mongodb';
import { sendMazolTokens } from '../../lib/thirdweb';

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const event = req.body;
  if (event.event === "charge.completed" && event.data.status === "successful") {
    const { db } = await connectToDatabase();
    const payment = await db.collection("flutterwave_payments").findOne({ tx_ref: event.data.tx_ref });
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    await sendMazolTokens(payment.wallet, payment.amount);
    await db.collection("flutterwave_payments").updateOne({ tx_ref: payment.tx_ref }, { $set: { status: "approved" } });
    // TODO: MLM or affiliate logic here
    return res.status(200).json({ status: "success" });
  }
  return res.status(400).json({ error: "Invalid event" });
}

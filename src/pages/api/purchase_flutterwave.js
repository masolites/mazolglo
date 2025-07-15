import axios from "axios";
import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const { wallet, amount } = req.body;
    if (!wallet || !amount) return res.status(400).json({ error: "Missing fields" });

    const FLW_SECRET = process.env.FLUTTERWAVE_SECRET_KEY;
    if (!FLW_SECRET) return res.status(500).json({ error: "Flutterwave secret key not set" });

    const callback_url = "https://mazolglo.com/api/flutterwave_webhook";

    const response = await axios.post("https://api.flutterwave.com/v3/payments", {
      tx_ref: `mazolglo_${Date.now()}`,
      amount,
      currency: "NGN",
      redirect_url: callback_url,
      customer: { email: "test@mazolglo.com" }, // Dummy email for Flutterwave
      customizations: { title: "Mazolglo Token Purchase" }
    }, {
      headers: { Authorization: `Bearer ${FLW_SECRET}` }
    });

    const { db } = await connectToDatabase();
    await db.collection("flutterwave_payments").insertOne({
      wallet, amount, tx_ref: response.data.data.tx_ref, status: "pending", createdAt: new Date()
    });

    return res.status(200).json({ paymentLink: response.data.data.link });
  } catch (err) {
    console.error("Flutterwave error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}

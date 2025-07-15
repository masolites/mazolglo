import { useState } from "react";
import { ethers } from "ethers";

export default function BuyDepositModal({ open, mode, onClose, user }) {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("flutterwave");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  // Handle file upload for proof
  const handleProofChange = (e) => {
    setProof(e.target.files[0]);
  };

  // Handle Buy/Deposit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    setError("");
    try {
      let endpoint = "";
      let body = {
        email: user.email,
        wallet: user.wallet,
        amount,
      };
      if (paymentMethod === "manual") {
        endpoint = "/api/purchase_manual";
        body.date = date;
        body.time = time;
        if (proof) {
          const reader = new FileReader();
          reader.onload = async function (evt) {
            body.proof = evt.target.result;
            const res = await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed");
            setResult("Deposit submitted! Await admin approval.");
            setLoading(false);
          };
          reader.readAsDataURL(proof);
          return;
        }
      } else if (paymentMethod === "flutterwave") {
        endpoint = "/api/purchase_flutterwave";
      } else if (paymentMethod === "usdt") {
        // USDT/MetaMask handled separately
        return;
      }
      // For non-manual, just send request
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      if (paymentMethod === "flutterwave" && data.paymentLink) {
        window.location.href = data.paymentLink;
        return;
      }
      setResult(data.message || "Success!");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // USDT/MetaMask
  const handleMetaMaskUSDT = async () => {
    setLoading(true);
    setError("");
    setResult("");
    try {
      if (!window.ethereum) throw new Error("MetaMask not available");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const USDT_ADDRESS = "0x..."; // <-- Your USDT contract address
      const ABI = [
        "function transfer(address to, uint256 value) public returns (bool)",
        "function decimals() view returns (uint8)"
      ];
      const contract = new ethers.Contract(USDT_ADDRESS, ABI, signer);
      const decimals = await contract.decimals();
      const value = ethers.utils.parseUnits(amount, decimals);
      const tx = await contract.transfer(process.env.NEXT_PUBLIC_PLATFORM_WALLET, value);
      await tx.wait();
      // Call backend to complete purchase
      const res = await fetch("/api/purchase_flexible", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          wallet: user.wallet,
          amount,
          txHash: tx.hash,
          referrerEmail: user.referrerEmail || "", // if you have this
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setResult(data.message || "Success!");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 1000,
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(26,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff5e1",
          color: "#4d0000",
          borderRadius: "18px",
          padding: "36px 32px",
          minWidth: 340,
          maxWidth: 400,
          boxShadow: "0 8px 32px #80000088",
          position: "relative",
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            right: 18,
            top: 18,
            background: "none",
            border: "none",
            fontSize: "1.5em",
            color: "#4d0000",
            cursor: "pointer",
          }}
        >
          ×
        </button>
        <div style={{ fontWeight: "bold", fontSize: "1.2em", marginBottom: 18 }}>
          {mode === "buy" ? "Buy Mazol Tokens" : "Deposit Funds"}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Amount (₦ or USDT)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            min={mode === "buy" ? 200 : 100}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #FFA726",
              marginBottom: 14,
              fontSize: "1em",
            }}
          />
          <select
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #FFA726",
              marginBottom: 14,
              fontSize: "1em",
            }}
          >
            <option value="flutterwave">Flutterwave (Naira)</option>
            <option value="manual">Manual Bank Deposit</option>
            <option value="usdt">USDT (MetaMask)</option>
          </select>
          {paymentMethod === "manual" && (
            <>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #FFA726",
                  marginBottom: 10,
                  fontSize: "1em",
                }}
              />
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #FFA726",
                  marginBottom: 10,
                  fontSize: "1em",
                }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleProofChange}
                style={{
                  width: "100%",
                  marginBottom: 10,
                }}
              />
            </>
          )}
          {paymentMethod === "usdt" && (
            <button
              type="button"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                background: "linear-gradient(90deg, #1DE9B6, #FFA726)",
                color: "#4d0000",
                fontWeight: "bold",
                fontSize: "1.1em",
                border: "none",
                marginBottom: 8,
                cursor: "pointer",
              }}
              onClick={handleMetaMaskUSDT}
              disabled={loading}
            >
              Pay with MetaMask (USDT)
            </button>
          )}
          {paymentMethod !== "usdt" && (
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                background: "linear-gradient(90deg, #FFA726, #4d0000)",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1.1em",
                border: "none",
                marginBottom: 8,
                cursor: "pointer",
              }}
              disabled={loading}
            >
              {loading ? "Processing..." : mode === "buy" ? "Buy Tokens" : "Deposit"}
            </button>
          )}
          {error && (
            <div style={{ color: "#b00020", marginTop: 10, fontWeight: "bold" }}>{error}</div>
          )}
          {result && (
            <div style={{ color: "#1DE9B6", marginTop: 10, fontWeight: "bold" }}>{result}</div>
          )}
        </form>
      </div>
    </div>
  );
}

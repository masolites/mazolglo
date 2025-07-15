import { useState } from "react";

export default function CreateConnectWalletModal({ open, onClose, onWalletCreated }) {
  const [step, setStep] = useState("choose"); // choose | create | connect
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!open) return null;

  // Platform wallet creation
  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", email, pin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create wallet");
      setSuccess("Wallet created successfully!");
      onWalletCreated({ email, wallet: data.wallet });
      setTimeout(onClose, 1200);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // MetaMask connect
  const handleMetaMask = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (!window.ethereum) throw new Error("MetaMask not available");
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (!accounts || !accounts[0]) throw new Error("No wallet found");
      setSuccess("MetaMask connected!");
      onWalletCreated({ wallet: accounts[0], email: null });
      setTimeout(onClose, 1200);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const isMetaMaskAvailable = typeof window !== "undefined" && window.ethereum;

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
          maxWidth: 380,
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
        {step === "choose" && (
          <>
            <div style={{ fontWeight: "bold", fontSize: "1.2em", marginBottom: 18 }}>
              Get Started
            </div>
            <button
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                background: "linear-gradient(90deg, #FFA726, #4d0000)",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1.1em",
                border: "none",
                marginBottom: 18,
                cursor: "pointer",
              }}
              onClick={() => setStep("create")}
            >
              Create Platform Wallet
            </button>
            <button
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                background: isMetaMaskAvailable
                  ? "linear-gradient(90deg, #1DE9B6, #FFA726)"
                  : "#ccc",
                color: "#4d0000",
                fontWeight: "bold",
                fontSize: "1.1em",
                border: "none",
                marginBottom: 8,
                cursor: isMetaMaskAvailable ? "pointer" : "not-allowed",
              }}
              onClick={isMetaMaskAvailable ? handleMetaMask : undefined}
              disabled={!isMetaMaskAvailable}
            >
              Connect MetaMask Wallet
            </button>
            <div style={{ fontSize: "0.95em", color: "#4d0000", marginTop: 12 }}>
              <b>Note:</b> Platform wallet is required for mining, fiat deposit, and all platform features. MetaMask is for direct USDT/crypto purchases only.
            </div>
          </>
        )}
        {step === "create" && (
          <form onSubmit={handleCreate}>
            <div style={{ fontWeight: "bold", fontSize: "1.1em", marginBottom: 12 }}>
              Create Platform Wallet
            </div>
            <input
              type="email"
              placeholder="Email (for backup)"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #FFA726",
                marginBottom: 14,
                fontSize: "1em",
              }}
            />
            <input
              type="password"
              placeholder="4-digit PIN"
              value={pin}
              onChange={e => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              required
              minLength={4}
              maxLength={4}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #FFA726",
                marginBottom: 18,
                fontSize: "1em",
                letterSpacing: "0.3em",
              }}
            />
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
              {loading ? "Creating..." : "Create Wallet"}
            </button>
            <button
              type="button"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                background: "#fff5e1",
                color: "#4d0000",
                fontWeight: "bold",
                border: "1px solid #FFA726",
                marginTop: 4,
                cursor: "pointer",
              }}
              onClick={() => setStep("choose")}
              disabled={loading}
            >
              Back
            </button>
            {error && (
              <div style={{ color: "#b00020", marginTop: 10, fontWeight: "bold" }}>{error}</div>
            )}
            {success && (
              <div style={{ color: "#1DE9B6", marginTop: 10, fontWeight: "bold" }}>{success}</div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

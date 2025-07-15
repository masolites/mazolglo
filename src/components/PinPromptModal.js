import { useState } from "react";

export default function PinPromptModal({ open, onClose, onSubmit }) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await onSubmit(pin);
      onClose();
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
          minWidth: 320,
          maxWidth: 360,
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
        <form onSubmit={handleSubmit}>
          <div style={{ fontWeight: "bold", fontSize: "1.1em", marginBottom: 12 }}>
            Enter your 4-digit PIN
          </div>
          <input
            type="password"
            placeholder="PIN"
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
            {loading ? "Verifying..." : "Confirm"}
          </button>
          {error && (
            <div style={{ color: "#b00020", marginTop: 10, fontWeight: "bold" }}>{error}</div>
          )}
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import CreateConnectWalletModal from "../components/CreateConnectWalletModal";
import BuyDepositModal from "../components/BuyDepositModal";

function Countdown({ endTime }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  function getTimeLeft() {
    const now = new Date();
    const end = new Date(endTime);
    let diff = Math.max(0, end - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);
    const secs = Math.floor(diff / 1000);
    return { days, hours, mins, secs };
  }
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [endTime]);
  return (
    <span>
      {timeLeft.days}d {timeLeft.hours}h {timeLeft.mins}m {timeLeft.secs}s
    </span>
  );
}

export default function Home() {
  const [walletModal, setWalletModal] = useState(false);
  const [buyModal, setBuyModal] = useState(null); // "fixed" | "flex"
  const [user, setUser] = useState(null);
  const [mining, setMining] = useState(false);
  const [miningTime, setMiningTime] = useState(0);

  // Mining counter
  useEffect(() => {
    let interval;
    if (mining) {
      interval = setInterval(() => setMiningTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [mining]);

  // Private Sale end time (e.g., 90 days from now)
  const privateSaleEnd = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

  // Mining time formatting
  const hours = String(Math.floor(miningTime / 3600)).padStart(2, "0");
  const mins = String(Math.floor((miningTime % 3600) / 60)).padStart(2, "0");
  const secs = String(miningTime % 60).padStart(2, "0");

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        background: "linear-gradient(135deg, #3a001a 70%, #e9d5ff 100%)",
        color: "#fff5e1",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          background: "#2a0010",
          color: "#1DE9B6",
          padding: "18px 0",
          fontWeight: "bold",
          fontSize: "1.5em",
          textAlign: "center",
          letterSpacing: "1px",
          boxShadow: "0 2px 8px #1DE9B655",
        }}
      >
        Mazolglo: Private Sale, Mining & E-commerce Platform
      </div>

      {/* Main Feature Grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "stretch",
          gap: "32px",
          marginTop: "32px",
          marginBottom: "32px",
        }}
      >
        {/* Private Sale Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #4d0000, #FFA726)",
            color: "#fff5e1",
            padding: "32px 28px",
            borderRadius: "22px",
            minWidth: "320px",
            maxWidth: "340px",
            boxShadow: "0 8px 32px #80000088",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: "1.2em", color: "#1DE9B6", marginBottom: 8 }}>
            Private Sale: MAZOL MZLx
          </div>
          <div style={{ color: "#fff5e1", marginBottom: 8 }}>
            <b>Token Price:</b> $0.001 (₦1.5) <br />
            <b>Countdown:</b> <span style={{ color: "#FF69B4" }}><Countdown endTime={privateSaleEnd} /></span>
          </div>
          <div style={{ display: "flex", gap: 8, margin: "8px 0" }}>
            <div style={{
              background: "#fff5e1",
              color: "#4d0000",
              borderRadius: "10px",
              padding: "8px 16px",
              fontWeight: "bold",
              fontSize: "1.1em",
              boxShadow: "0 2px 8px #1DE9B655",
            }}>
              Tokens Sold: <span style={{ color: "#1DE9B6" }}>0</span>
            </div>
            <div style={{
              background: "#d8b4fe",
              color: "#4d0000",
              borderRadius: "10px",
              padding: "8px 16px",
              fontWeight: "bold",
              fontSize: "1.1em",
              boxShadow: "0 2px 8px #FF69B455",
            }}>
              Goal: <span style={{ color: "#FF69B4" }}>1,000,000</span>
            </div>
          </div>
          <div style={{ width: "100%", marginTop: 16 }}>
            <button
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                background: "linear-gradient(90deg, #1DE9B6, #4d0000)",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1.1em",
                border: "none",
                marginBottom: 12,
                cursor: "pointer",
                boxShadow: "0 2px 8px #1DE9B655",
              }}
              onClick={() => setBuyModal("fixed")}
            >
              Buy & Earn: Gear 2 (Fixed)
            </button>
            <button
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                background: "linear-gradient(90deg, #FF69B4, #FFA726)",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1.1em",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 8px #FF69B455",
              }}
              onClick={() => setBuyModal("flex")}
            >
              Buy & Earn: Gear 1 (Flex)
            </button>
          </div>
        </div>

        {/* Mining Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #4d0000, #1DE9B6)",
            color: "#fff5e1",
            padding: "32px 28px",
            borderRadius: "22px",
            minWidth: "260px",
            maxWidth: "280px",
            boxShadow: "0 8px 32px #80000088",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: "1.2em", color: "#d8b4fe", marginBottom: 8 }}>
            Mining
          </div>
          <div style={{
            fontSize: "2em",
            fontWeight: "bold",
            color: "#FFA726",
            marginBottom: 8,
            letterSpacing: "2px",
          }}>
            {hours}:{mins}:{secs}
          </div>
          <button
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              background: mining ? "#1DE9B6" : "#FFA726",
              color: mining ? "#4d0000" : "#fff",
              fontWeight: "bold",
              fontSize: "1.1em",
              border: "none",
              marginTop: 8,
              cursor: "pointer",
              boxShadow: "0 2px 8px #1DE9B655",
            }}
            onClick={() => setMining(m => !m)}
          >
            {mining ? "Mining ON 💚" : "Start Mining"}
          </button>
        </div>

        {/* Voting Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #4d0000, #FF69B4)",
            color: "#fff5e1",
            padding: "32px 28px",
            borderRadius: "22px",
            minWidth: "260px",
            maxWidth: "280px",
            boxShadow: "0 8px 32px #80000088",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: "1.2em", color: "#FFA726", marginBottom: 8 }}>
            Price Voting
          </div>
          <div style={{ color: "#fff5e1", marginBottom: 8, fontSize: "1em" }}>
            Voting opens 6PM–11PM daily (Nigeria time)
          </div>
          <button
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              background: "linear-gradient(90deg, #FF69B4, #1DE9B6)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1.1em",
              border: "none",
              marginTop: 8,
              cursor: "pointer",
              boxShadow: "0 2px 8px #FF69B455",
            }}
          >
            View Voting
          </button>
        </div>

        {/* Escrow Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #4d0000, #d8b4fe)",
            color: "#fff5e1",
            padding: "32px 28px",
            borderRadius: "22px",
            minWidth: "260px",
            maxWidth: "280px",
            boxShadow: "0 8px 32px #80000088",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: "1.2em", color: "#1DE9B6", marginBottom: 8 }}>
            Escrow
          </div>
          <div style={{ color: "#fff5e1", marginBottom: 8, fontSize: "1em" }}>
            Buy or sell securely with Mazol escrow.
          </div>
          <div style={{ display: "flex", gap: 8, width: "100%" }}>
            <button
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "10px",
                background: "linear-gradient(90deg, #1DE9B6, #FFA726)",
                color: "#4d0000",
                fontWeight: "bold",
                fontSize: "1em",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 8px #1DE9B655",
              }}
            >
              Escrow Buy
            </button>
            <button
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "10px",
                background: "linear-gradient(90deg, #FF69B4, #d8b4fe)",
                color: "#4d0000",
                fontWeight: "bold",
                fontSize: "1em",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 2px 8px #FF69B455",
              }}
            >
              Escrow Sell
            </button>
          </div>
        </div>
      </div>

      {/* Wallet Status & Connect/Create Button */}
      <div style={{
        marginTop: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}>
        {!user && (
          <button
            style={{
              background: "linear-gradient(90deg, #1DE9B6, #4d0000)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1.2em",
              border: "none",
              borderRadius: "16px",
              padding: "16px 48px",
              boxShadow: "0 4px 24px #80000088",
              cursor: "pointer",
              letterSpacing: "1px",
            }}
            onClick={() => setWalletModal(true)}
          >
            Create / Connect Wallet
          </button>
        )}
        {user && (
          <div
            style={{
              background: "#fff5e1",
              color: "#4d0000",
              borderRadius: "12px",
              padding: "10px 24px",
              fontWeight: "bold",
              fontSize: "1.1em",
              boxShadow: "0 2px 8px #FFA72655",
            }}
          >
            Wallet Connected: <span style={{ color: "#1DE9B6" }}>{user.wallet}</span>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateConnectWalletModal
        open={walletModal}
        onClose={() => setWalletModal(false)}
        onWalletCreated={setUser}
      />
      <BuyDepositModal
        open={!!buyModal}
        mode={buyModal}
        onClose={() => setBuyModal(null)}
        user={user}
      />

      {/* Footer */}
      <div
        style={{
          width: "100%",
          background: "#2a0010",
          color: "#fff5e1",
          textAlign: "center",
          padding: "18px",
          fontSize: "1em",
          marginTop: "32px",
          letterSpacing: "1px",
        }}
      >
        &copy; {new Date().getFullYear()} Mazolglo | Private Sale, Mining, and E-commerce Platform
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [deposits, setDeposits] = useState([]);

  useEffect(() => {
    fetch("/api/get_pending_deposits")
      .then(res => res.json())
      .then(data => setDeposits(data.deposits || []));
  }, []);

  const handleApprove = async (id, approve) => {
    await fetch("/api/admin_approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ depositId: id, approve }),
    });
    setDeposits(deposits.filter(d => d._id !== id));
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>Pending Manual Deposits</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th><th>Wallet</th><th>Amount</th><th>Date</th><th>Time</th><th>Proof</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {deposits.map(d => (
            <tr key={d._id}>
              <td>{d.email}</td>
              <td>{d.wallet}</td>
              <td>{d.amount}</td>
              <td>{d.date}</td>
              <td>{d.time}</td>
              <td>
                {d.proof && <a href={d.proof} target="_blank" rel="noopener noreferrer">View</a>}
              </td>
              <td>
                <button onClick={() => handleApprove(d._id, true)}>Approve</button>
                <button onClick={() => handleApprove(d._id, false)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  }

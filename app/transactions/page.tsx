// app/transactions/page.tsx
"use client";
import { useEffect, useState } from "react";
import { transactionAPI, accountAPI, Transaction } from "../lib/api";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      accountAPI.getAccount(),
      transactionAPI.getMyTransactions(),
    ])
      .then(([accountRes, txRes]) => {
        setCurrentUserId(accountRes.user._id);
        setTransactions(txRes.transactions);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', sans-serif; background: #0f1923; }
        .tx-wrap { min-height: 100vh; padding: 40px 24px; }
        .tx-card { background: #1a2332; border: 1px solid #2a3a4a; border-radius: 16px; padding: 32px; max-width: 900px; margin: 0 auto; }
        .tx-title { font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 6px; }
        .tx-sub { font-size: 13px; color: #8899aa; margin-bottom: 24px; }
        .tx-table { width: 100%; border-collapse: collapse; }
        .tx-table th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #8899aa; padding: 10px 12px; border-bottom: 1px solid #2a3a4a; }
        .tx-table td { padding: 14px 12px; font-size: 14px; color: #cdd8e3; border-bottom: 1px solid #22303f; }
        .tx-empty { text-align: center; padding: 40px; color: #8899aa; font-size: 14px; }
        .tx-error { background: rgba(255,80,80,0.1); border: 1px solid rgba(255,80,80,0.3); color: #ff6b6b; font-size: 12px; padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; }
        .badge { padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
        .badge-sent { background: rgba(255,107,107,0.15); color: #ff6b6b; }
        .badge-received { background: rgba(45,206,137,0.15); color: #2dce89; }
        .badge-status { background: rgba(255,255,255,0.08); color: #8899aa; }
      `}</style>
      <div className="tx-wrap">
        <div className="tx-card">
          <h1 className="tx-title">Transaction History</h1>
          <p className="tx-sub">All transfers to and from your account</p>

          {error && <div className="tx-error">{error}</div>}

          {loading ? (
            <p style={{ color: "#8899aa", fontSize: 13 }}>Loading...</p>
          ) : transactions.length === 0 ? (
            <div className="tx-empty">No transactions yet.</div>
          ) : (
            <table className="tx-table">
              <thead>
                <tr>
                  <th scope="col">Direction</th>
                  <th scope="col">Counterparty</th>
                  <th scope="col">Description</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Status</th>
                  <th scope="col">Reference</th>
                  <th scope="col">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const isSender = tx.sender?._id === currentUserId;

                  return (
                    <tr key={tx._id}>
                      <td>
                        <span className={`badge ${isSender ? "badge-sent" : "badge-received"}`}>
                          {isSender ? "Sent" : "Received"}
                        </span>
                      </td>
                      <td>
                        {isSender
                          ? `${tx.receiver?.fullName} (${tx.receiver?.accountNumber})`
                          : `${tx.sender?.fullName} (${tx.sender?.accountNumber})`}
                      </td>
                      <td>{tx.description || "—"}</td>
                      <td style={{ color: isSender ? "#ff6b6b" : "#2dce89", fontWeight: 700 }}>
                        {isSender ? "-" : "+"}Rs {tx.amount.toLocaleString()}
                      </td>
                      <td><span className="badge badge-status">{tx.status}</span></td>
                      <td style={{ fontFamily: "monospace", fontSize: 12 }}>{tx.reference.slice(0, 8)}...</td>
                      <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
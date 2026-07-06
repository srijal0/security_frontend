// app/admin/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminAPI, accountAPI, User, Transaction, ActivityLog } from "../lib/api";

type Tab = "users" | "transactions" | "logs";

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("users");
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    // ✅ Confirm the logged-in user is actually an admin before showing anything.
    // The backend enforces this regardless, but this avoids flashing admin UI
    // to a non-admin who happens to hit /admin directly.
    accountAPI.getAccount()
      .then((res) => {
        if (res.user.role !== "admin") {
          router.push("/dashboard");
          return;
        }
        loadTab(tab);
      })
      .catch(() => router.push("/login"));
  }, []);

  const loadTab = async (t: Tab) => {
    setLoading(true);
    setError("");
    try {
      if (t === "users") {
        const res = await adminAPI.getAllUsers();
        setUsers(res.users);
      } else if (t === "transactions") {
        const res = await adminAPI.getAllTransactions();
        setTransactions(res.transactions);
      } else if (t === "logs") {
        const res = await adminAPI.getActivityLogs();
        setLogs(res.logs);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    loadTab(t);
  };

  const handleLock = async (id: string) => {
    setActionMsg("");
    try {
      const res = await adminAPI.lockUser(id);
      setActionMsg(res.message);
      loadTab("users");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUnlock = async (id: string) => {
    setActionMsg("");
    try {
      const res = await adminAPI.unlockUser(id);
      setActionMsg(res.message);
      loadTab("users");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', sans-serif; background: #0f1923; }
        .admin-wrap { min-height: 100vh; padding: 40px 24px; }
        .admin-card { background: #1a2332; border: 1px solid #2a3a4a; border-radius: 16px; padding: 32px; max-width: 1100px; margin: 0 auto; }
        .admin-title { font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 6px; }
        .admin-sub { font-size: 13px; color: #8899aa; margin-bottom: 24px; }
        .tabs { display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 1px solid #2a3a4a; }
        .tab-btn { padding: 10px 16px; background: none; border: none; color: #8899aa; font-size: 13px; font-weight: 600; cursor: pointer; border-bottom: 2px solid transparent; }
        .tab-btn.active { color: #2dce89; border-bottom-color: #2dce89; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #8899aa; padding: 10px 12px; border-bottom: 1px solid #2a3a4a; }
        td { padding: 12px; font-size: 13px; color: #cdd8e3; border-bottom: 1px solid #22303f; }
        .badge { padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
        .badge-locked { background: rgba(255,107,107,0.15); color: #ff6b6b; }
        .badge-active { background: rgba(45,206,137,0.15); color: #2dce89; }
        .badge-neutral { background: rgba(255,255,255,0.08); color: #8899aa; }
        .action-btn { padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; border: none; }
        .btn-lock { background: rgba(255,107,107,0.15); color: #ff6b6b; }
        .btn-unlock { background: rgba(45,206,137,0.15); color: #2dce89; }
        .msg-success { background: rgba(45,206,137,0.1); border: 1px solid rgba(45,206,137,0.3); color: #2dce89; font-size: 12px; padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; }
        .msg-error { background: rgba(255,80,80,0.1); border: 1px solid rgba(255,80,80,0.3); color: #ff6b6b; font-size: 12px; padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; }
        .empty { text-align: center; padding: 40px; color: #8899aa; font-size: 13px; }

        /* Accessibility: visible focus indicator (WCAG 2.1 SC 2.4.7) */
        .tab-btn:focus,
        .action-btn:focus {
          outline: 2px solid #2dce89;
          outline-offset: 2px;
        }
      `}</style>
      <div className="admin-wrap">
        <div className="admin-card">
          <h1 className="admin-title">Admin Panel</h1>
          <p className="admin-sub">Manage users, monitor transactions, and review activity logs</p>

          <div className="tabs">
            <button className={`tab-btn ${tab === "users" ? "active" : ""}`} onClick={() => switchTab("users")}>Users</button>
            <button className={`tab-btn ${tab === "transactions" ? "active" : ""}`} onClick={() => switchTab("transactions")}>All Transactions</button>
            <button className={`tab-btn ${tab === "logs" ? "active" : ""}`} onClick={() => switchTab("logs")}>Activity Logs</button>
          </div>

          {actionMsg && <div className="msg-success">{actionMsg}</div>}
          {error && <div className="msg-error">{error}</div>}

          {loading ? (
            <p style={{ color: "#8899aa", fontSize: 13 }}>Loading...</p>
          ) : tab === "users" ? (
            users.length === 0 ? <div className="empty">No customer accounts found.</div> : (
              <table>
                <thead>
                  <tr>
                    <th scope="col">Name</th><th scope="col">Email</th><th scope="col">Account #</th><th scope="col">Balance</th><th scope="col">Status</th><th scope="col">Verified</th><th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.fullName}</td>
                      <td>{u.email}</td>
                      <td>{u.accountNumber}</td>
                      <td>Rs {u.balance.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${u.isLocked ? "badge-locked" : "badge-active"}`}>
                          {u.isLocked ? "Locked" : "Active"}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${u.isVerified ? "badge-active" : "badge-neutral"}`}>
                          {u.isVerified ? "Yes" : "No"}
                        </span>
                      </td>
                      <td>
                        {u.isLocked ? (
                          <button className="action-btn btn-unlock" onClick={() => handleUnlock(u._id)}>Unlock</button>
                        ) : (
                          <button className="action-btn btn-lock" onClick={() => handleLock(u._id)}>Lock</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : tab === "transactions" ? (
            transactions.length === 0 ? <div className="empty">No transactions found.</div> : (
              <table>
                <thead>
                  <tr>
                    <th scope="col">Sender</th><th scope="col">Receiver</th><th scope="col">Amount</th><th scope="col">Status</th><th scope="col">Reference</th><th scope="col">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx._id}>
                      <td>{tx.sender?.fullName} ({tx.sender?.accountNumber})</td>
                      <td>{tx.receiver?.fullName} ({tx.receiver?.accountNumber})</td>
                      <td>Rs {tx.amount.toLocaleString()}</td>
                      <td><span className="badge badge-neutral">{tx.status}</span></td>
                      <td style={{ fontFamily: "monospace", fontSize: 12 }}>{tx.reference.slice(0, 8)}...</td>
                      <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            logs.length === 0 ? <div className="empty">No activity logs found.</div> : (
              <table>
                <thead>
                  <tr>
                    <th scope="col">User</th><th scope="col">Action</th><th scope="col">Status</th><th scope="col">Details</th><th scope="col">IP</th><th scope="col">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id}>
                      <td>{log.user?.fullName || "Unknown"}</td>
                      <td>{log.action}</td>
                      <td><span className="badge badge-neutral">{log.status}</span></td>
                      <td>{log.details}</td>
                      <td style={{ fontFamily: "monospace", fontSize: 12 }}>{log.ipAddress}</td>
                      <td>{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>
    </>
  );
}
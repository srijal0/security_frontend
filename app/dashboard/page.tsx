"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/auth-context";
import { transactionAPI, accountAPI, Transaction } from "../lib/api";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [txLoading, setTxLoading] = useState(true);
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferForm, setTransferForm] = useState({ toAccountNumber: "", amount: "", description: "" });
  const [transferError, setTransferError] = useState("");
  const [transferSuccess, setTransferSuccess] = useState("");
  const [transferLoading, setTransferLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (!loading && user?.role === "admin") router.push("/admin");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setBalance(user.balance);
      transactionAPI.getMyTransactions()
        .then(res => setTransactions(res.transactions))
        .catch(() => {})
        .finally(() => setTxLoading(false));
    }
  }, [user]);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError("");
    setTransferSuccess("");
    if (!transferForm.toAccountNumber || !transferForm.amount)
      return setTransferError("Account number and amount are required.");
    setTransferLoading(true);
    try {
      const res = await transactionAPI.transfer(
        transferForm.toAccountNumber,
        Number(transferForm.amount),
        transferForm.description
      );
      setBalance(res.newBalance);
      setTransferSuccess(`Rs${transferForm.amount} transferred successfully!`);
      setTransferForm({ toAccountNumber: "", amount: "", description: "" });
      // Refresh transactions
      const txRes = await transactionAPI.getMyTransactions();
      setTransactions(txRes.transactions);
      setTimeout(() => { setShowTransfer(false); setTransferSuccess(""); }, 2000);
    } catch (err: any) {
      setTransferError(err.message);
    } finally {
      setTransferLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f1923", display: "flex", alignItems: "center", justifyContent: "center", color: "#2dce89", fontFamily: "Segoe UI, sans-serif", fontSize: 16 }}>
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', sans-serif; background: #0f1923; color: #fff; }
        .dash-layout { display: flex; min-height: 100vh; }

        /* Sidebar */
        .sidebar { width: 240px; background: #1a2332; border-right: 1px solid #2a3a4a; padding: 24px 16px; flex-shrink: 0; display: flex; flex-direction: column; }
        .sidebar-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 32px; padding: 0 8px; }
        .sidebar-logo-icon { width: 36px; height: 36px; background: #1a6b3a; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
        .sidebar-logo-text { font-size: 16px; font-weight: 800; color: #fff; }
        .sidebar-logo-text span { color: #2dce89; }
        .sidebar-nav { flex: 1; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; color: #8899aa; transition: all 0.15s; margin-bottom: 4px; border: none; background: none; width: 100%; text-align: left; }
        .nav-item:hover { background: #0f1923; color: #fff; }
        .nav-item.active { background: rgba(45,206,137,0.1); color: #2dce89; }
        .nav-icon { font-size: 16px; width: 20px; text-align: center; }
        .sidebar-user { border-top: 1px solid #2a3a4a; padding-top: 16px; margin-top: 16px; }
        .sidebar-user-name { font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 2px; }
        .sidebar-user-role { font-size: 11px; color: #2dce89; margin-bottom: 12px; }
        .logout-btn { width: 100%; padding: 9px; background: rgba(255,80,80,0.1); color: #ff6b6b; border: 1px solid rgba(255,80,80,0.2); border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; }
        .logout-btn:hover { background: rgba(255,80,80,0.2); }

        /* Main */
        .dash-main { flex: 1; padding: 32px; overflow-y: auto; }
        .dash-header { margin-bottom: 28px; }
        .dash-title { font-size: 24px; font-weight: 700; color: #fff; }
        .dash-sub { font-size: 13px; color: #8899aa; margin-top: 4px; }

        /* Cards */
        .cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }
        .card { background: #1a2332; border: 1px solid #2a3a4a; border-radius: 12px; padding: 20px; }
        .card-label { font-size: 11px; font-weight: 600; color: #8899aa; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
        .card-value { font-size: 26px; font-weight: 800; color: #fff; margin-bottom: 4px; }
        .card-value.green { color: #2dce89; }
        .card-sub { font-size: 12px; color: #8899aa; }
        .balance-card { background: linear-gradient(135deg, #1a4a2a 0%, #1a2332 100%); border-color: #2a5a3a; }

        /* Transfer Button */
        .transfer-btn { display: flex; align-items: center; gap: 8px; padding: 12px 24px; background: #1a6b3a; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; margin-bottom: 28px; }
        .transfer-btn:hover { background: #22854a; }

        /* Transfer Modal */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 24px; }
        .modal { background: #1a2332; border: 1px solid #2a3a4a; border-radius: 16px; padding: 32px; width: 100%; max-width: 420px; }
        .modal-title { font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 20px; }
        .form-field { margin-bottom: 16px; }
        .form-label { display: block; font-size: 12px; font-weight: 600; color: #8899aa; margin-bottom: 6px; text-transform: uppercase; }
        .form-input { width: 100%; padding: 11px 14px; background: #0f1923; border: 1px solid #2a3a4a; border-radius: 8px; color: #fff; font-size: 14px; outline: none; }
        .form-input:focus { border-color: #2dce89; }
        .form-input::placeholder { color: #4a5a6a; }
        .modal-btns { display: flex; gap: 10px; margin-top: 8px; }
        .btn-green { flex: 1; padding: 12px; background: #1a6b3a; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; }
        .btn-green:hover { background: #22854a; }
        .btn-green:disabled { opacity: 0.6; cursor: default; }
        .btn-cancel { flex: 1; padding: 12px; background: transparent; color: #8899aa; border: 1px solid #2a3a4a; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
        .error-msg { background: rgba(255,80,80,0.1); border: 1px solid rgba(255,80,80,0.3); color: #ff6b6b; font-size: 12px; padding: 10px 14px; border-radius: 8px; margin-bottom: 12px; }
        .success-msg { background: rgba(45,206,137,0.1); border: 1px solid rgba(45,206,137,0.3); color: #2dce89; font-size: 12px; padding: 10px 14px; border-radius: 8px; margin-bottom: 12px; }

        /* Transactions */
        .section-title { font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 16px; }
        .tx-table { background: #1a2332; border: 1px solid #2a3a4a; border-radius: 12px; overflow: hidden; }
        .tx-header { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; padding: 12px 20px; background: #0f1923; font-size: 11px; font-weight: 600; color: #8899aa; text-transform: uppercase; letter-spacing: 0.5px; }
        .tx-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; padding: 14px 20px; border-top: 1px solid #2a3a4a; font-size: 13px; align-items: center; }
        .tx-row:hover { background: rgba(255,255,255,0.02); }
        .tx-name { font-weight: 600; color: #fff; }
        .tx-desc { font-size: 11px; color: #8899aa; margin-top: 2px; }
        .tx-amount.debit { color: #ff6b6b; font-weight: 700; }
        .tx-amount.credit { color: #2dce89; font-weight: 700; }
        .tx-date { color: #8899aa; font-size: 12px; }
        .tx-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; }
        .tx-badge.completed { background: rgba(45,206,137,0.15); color: #2dce89; }
        .tx-badge.pending { background: rgba(255,200,0,0.15); color: #ffc800; }
        .tx-empty { padding: 40px; text-align: center; color: #8899aa; font-size: 13px; }

        @media (max-width: 900px) {
          .sidebar { display: none; }
          .cards-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="dash-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">🏦</div>
            <div className="sidebar-logo-text">Bank<span>Secure</span></div>
          </div>
          <nav className="sidebar-nav">
            <button className="nav-item active">
              <span className="nav-icon">🏠</span> Dashboard
            </button>
            <button className="nav-item" onClick={() => router.push("/profile")}>
              <span className="nav-icon">👤</span> Profile
            </button>
            <button className="nav-item" onClick={() => setShowTransfer(true)}>
              <span className="nav-icon">💸</span> Transfer
            </button>
            <button className="nav-item" onClick={() => router.push("/transactions")}>
              <span className="nav-icon">📋</span> Transactions
            </button>
          </nav>
          <div className="sidebar-user">
            <div className="sidebar-user-name">{user.fullName}</div>
            <div className="sidebar-user-role">● {user.role}</div>
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dash-main">
          <div className="dash-header">
            <h1 className="dash-title">Welcome back, {user.fullName.split(" ")[0]}! 👋</h1>
            <p className="dash-sub">Account: {user.accountNumber} · Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "First login"}</p>
          </div>

          {/* Stats Cards */}
          <div className="cards-grid">
            <div className="card balance-card">
              <div className="card-label">💰 Available Balance</div>
              <div className="card-value green">Rs {balance.toLocaleString()}</div>
              <div className="card-sub">Account: {user.accountNumber}</div>
            </div>
            <div className="card">
              <div className="card-label">📤 Total Sent</div>
              <div className="card-value">
                Rs {transactions
                  .filter(t => t.sender?._id === user._id)
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()}
              </div>
              <div className="card-sub">{transactions.filter(t => t.sender?._id === user._id).length} transactions</div>
            </div>
            <div className="card">
              <div className="card-label">📥 Total Received</div>
              <div className="card-value">
                Rs {transactions
                  .filter(t => t.receiver?._id === user._id)
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()}
              </div>
              <div className="card-sub">{transactions.filter(t => t.receiver?._id === user._id).length} transactions</div>
            </div>
          </div>

          {/* Transfer Button */}
          <button className="transfer-btn" onClick={() => setShowTransfer(true)}>
            💸 Transfer Money
          </button>

          {/* Recent Transactions */}
          <div className="section-title">Recent Transactions</div>
          <div className="tx-table">
            <div className="tx-header">
              <span>Description</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Date</span>
            </div>
            {txLoading ? (
              <div className="tx-empty">Loading transactions...</div>
            ) : transactions.length === 0 ? (
              <div className="tx-empty">No transactions yet. Make your first transfer!</div>
            ) : (
              transactions.slice(0, 10).map(tx => {
                const isDebit = tx.sender?._id === user._id;
                const other = isDebit ? tx.receiver : tx.sender;
                return (
                  <div key={tx._id} className="tx-row">
                    <div>
                      <div className="tx-name">
                        {isDebit ? `To: ${other?.fullName}` : `From: ${other?.fullName}`}
                      </div>
                      <div className="tx-desc">{tx.description || "Transfer"}</div>
                    </div>
                    <div className={`tx-amount ${isDebit ? "debit" : "credit"}`}>
                      {isDebit ? "-" : "+"}Rs{tx.amount.toLocaleString()}
                    </div>
                    <div>
                      <span className={`tx-badge ${tx.status}`}>{tx.status}</span>
                    </div>
                    <div className="tx-date">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>

      {/* Transfer Modal */}
      {showTransfer && (
        <div className="modal-overlay" onClick={() => setShowTransfer(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">💸 Transfer Money</div>
            {transferError && <div className="error-msg">{transferError}</div>}
            {transferSuccess && <div className="success-msg">{transferSuccess}</div>}
            <form onSubmit={handleTransfer}>
              <div className="form-field">
                <label className="form-label">Recipient Account Number</label>
                <input className="form-input" type="text" placeholder="e.g. BS12345678"
                  value={transferForm.toAccountNumber}
                  onChange={e => setTransferForm({ ...transferForm, toAccountNumber: e.target.value })} />
              </div>
              <div className="form-field">
                <label className="form-label">Amount (Rs)</label>
                <input className="form-input" type="number" placeholder="Enter amount"
                  value={transferForm.amount}
                  onChange={e => setTransferForm({ ...transferForm, amount: e.target.value })} />
              </div>
              <div className="form-field">
                <label className="form-label">Description (optional)</label>
                <input className="form-input" type="text" placeholder="e.g. Rent payment"
                  value={transferForm.description}
                  onChange={e => setTransferForm({ ...transferForm, description: e.target.value })} />
              </div>
              <div className="modal-btns">
                <button type="button" className="btn-cancel" onClick={() => setShowTransfer(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-green" disabled={transferLoading}>
                  {transferLoading ? "Sending..." : "Send Money →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
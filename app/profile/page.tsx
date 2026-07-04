// app/profile/page.tsx
"use client";
import { useEffect, useState } from "react";
import { accountAPI } from "../lib/api";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    accountAPI.getAccount()
      .then((res) => {
        setFullName(res.user.fullName);
        setPhone(res.user.phone || "");
        setEmail(res.user.email);
        setAccountNumber(res.user.accountNumber);
      })
      .catch((err) => setError(err.message))
      .finally(() => setPageLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await accountAPI.updateProfile({ fullName, phone });
      setMessage(res.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', sans-serif; background: #0f1923; }
        .profile-wrap { min-height: 100vh; display: flex; align-items: flex-start; justify-content: center; padding: 60px 24px; }
        .profile-card { background: #1a2332; border: 1px solid #2a3a4a; border-radius: 16px; padding: 40px; width: 100%; max-width: 480px; }
        .profile-title { font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 6px; }
        .profile-sub { font-size: 13px; color: #8899aa; margin-bottom: 28px; }
        .profile-readonly { background: #0f1923; border: 1px solid #2a3a4a; border-radius: 8px; padding: 14px; margin-bottom: 20px; }
        .profile-readonly-row { display: flex; justify-content: space-between; font-size: 13px; color: #8899aa; padding: 4px 0; }
        .profile-readonly-row span:last-child { color: #cdd8e3; font-weight: 600; }
        .profile-field { margin-bottom: 16px; }
        .profile-label { display: block; font-size: 12px; font-weight: 600; color: #8899aa; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
        .profile-input { width: 100%; padding: 12px 14px; background: #0f1923; border: 1px solid #2a3a4a; border-radius: 8px; color: #fff; font-size: 14px; outline: none; transition: border-color 0.15s; }
        .profile-input:focus { border-color: #2dce89; }
        .profile-error { background: rgba(255,80,80,0.1); border: 1px solid rgba(255,80,80,0.3); color: #ff6b6b; font-size: 12px; padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; }
        .profile-success { background: rgba(45,206,137,0.1); border: 1px solid rgba(45,206,137,0.3); color: #2dce89; font-size: 12px; padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; }
        .profile-btn { width: 100%; padding: 13px; background: #1a6b3a; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: background 0.15s; margin-top: 8px; }
        .profile-btn:hover { background: #22854a; }
        .profile-btn:disabled { opacity: 0.6; cursor: default; }
      `}</style>
      <div className="profile-wrap">
        <div className="profile-card">
          <h1 className="profile-title">Profile</h1>
          <p className="profile-sub">Manage your account information</p>

          {pageLoading ? (
            <p style={{ color: "#8899aa", fontSize: 13 }}>Loading...</p>
          ) : (
            <>
              {error && <div className="profile-error">{error}</div>}
              {message && <div className="profile-success">{message}</div>}

              <div className="profile-readonly">
                <div className="profile-readonly-row">
                  <span>Email</span>
                  <span>{email}</span>
                </div>
                <div className="profile-readonly-row">
                  <span>Account Number</span>
                  <span>{accountNumber}</span>
                </div>
              </div>

              <form onSubmit={handleSave}>
                <div className="profile-field">
                  <label className="profile-label">Full Name</label>
                  <input
                    className="profile-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="profile-field">
                  <label className="profile-label">Phone</label>
                  <input
                    className="profile-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <button className="profile-btn" disabled={loading} type="submit">
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
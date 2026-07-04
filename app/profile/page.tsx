// app/profile/page.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { accountAPI } from "../lib/api";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Change password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMessage, setPwMessage] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    accountAPI.getAccount()
      .then((res) => {
        setFullName(res.user.fullName);
        setPhone(res.user.phone || "");
        setEmail(res.user.email);
        setAccountNumber(res.user.accountNumber);
        setProfilePicture(res.user.profilePicture || "");
      })
      .catch((err) => setError(err.message))
      .finally(() => setPageLoading(false));
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type)) {
      setError("Only PNG, JPEG, or WEBP images are allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB.");
      return;
    }

    setError("");
    setMessage("");
    try {
      const res = await accountAPI.uploadProfilePicture(file);
      setProfilePicture(res.profilePicture);
      setMessage(res.message);
    } catch (err: any) {
      setError(err.message);
    }
  };

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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwMessage("");
    setPwLoading(true);
    try {
      const res = await accountAPI.changePassword(currentPassword, newPassword);
      setPwMessage(res.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setPwError(err.message);
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', sans-serif; background: #0f1923; }
        .profile-wrap { min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 60px 24px; gap: 24px; }
        .profile-card { background: #1a2332; border: 1px solid #2a3a4a; border-radius: 16px; padding: 40px; width: 100%; max-width: 480px; }
        .profile-title { font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 6px; }
        .profile-sub { font-size: 13px; color: #8899aa; margin-bottom: 28px; }
        .avatar-row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
        .avatar { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; background: #0f1923; border: 2px solid #2a3a4a; display: flex; align-items: center; justify-content: center; color: #8899aa; font-size: 24px; font-weight: 700; }
        .avatar-btn { padding: 8px 14px; background: #0f1923; border: 1px solid #2a3a4a; color: #cdd8e3; border-radius: 8px; font-size: 12px; cursor: pointer; }
        .avatar-btn:hover { border-color: #2dce89; }
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

              <div className="avatar-row">
                {profilePicture ? (
                  <img
                    src={`http://localhost:5001${profilePicture}`}
                    alt="Profile"
                    className="avatar"
                  />
                ) : (
                  <div className="avatar">{fullName?.[0]?.toUpperCase() || "U"}</div>
                )}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    className="avatar-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change Photo
                  </button>
                </div>
              </div>

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

        <div className="profile-card">
          <h1 className="profile-title">Change Password</h1>
          <p className="profile-sub">Choose a strong, unique password</p>

          {pwError && <div className="profile-error">{pwError}</div>}
          {pwMessage && <div className="profile-success">{pwMessage}</div>}

          <form onSubmit={handleChangePassword}>
            <div className="profile-field">
              <label className="profile-label">Current Password</label>
              <input
                className="profile-input"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="profile-field">
              <label className="profile-label">New Password</label>
              <input
                className="profile-input"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button className="profile-btn" disabled={pwLoading} type="submit">
              {pwLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
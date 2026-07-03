"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI } from "../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Both fields required.");
    setLoading(true);
    try {
      const res = await authAPI.login(email, password);
      if (res.requiresOTP || res.requiresVerification) {
        router.push(`/verify-otp?userId=${res.userId}&type=login`);
      }
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
        .auth-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .auth-card { background: #1a2332; border: 1px solid #2a3a4a; border-radius: 16px; padding: 40px; width: 100%; max-width: 420px; }
        .auth-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
        .auth-logo-icon { width: 40px; height: 40px; background: #1a6b3a; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .auth-logo-text { font-size: 20px; font-weight: 800; color: #fff; }
        .auth-logo-text span { color: #2dce89; }
        .auth-title { font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 6px; }
        .auth-sub { font-size: 13px; color: #8899aa; margin-bottom: 28px; }
        .auth-field { margin-bottom: 16px; }
        .auth-label { display: block; font-size: 12px; font-weight: 600; color: #8899aa; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
        .auth-input { width: 100%; padding: 12px 14px; background: #0f1923; border: 1px solid #2a3a4a; border-radius: 8px; color: #fff; font-size: 14px; outline: none; transition: border-color 0.15s; }
        .auth-input:focus { border-color: #2dce89; }
        .auth-input::placeholder { color: #4a5a6a; }
        .auth-error { background: rgba(255,80,80,0.1); border: 1px solid rgba(255,80,80,0.3); color: #ff6b6b; font-size: 12px; padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; }
        .auth-btn { width: 100%; padding: 13px; background: #1a6b3a; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: background 0.15s; margin-top: 8px; }
        .auth-btn:hover { background: #22854a; }
        .auth-btn:disabled { opacity: 0.6; cursor: default; }
        .auth-footer { text-align: center; margin-top: 20px; font-size: 13px; color: #8899aa; }
        .auth-link { color: #2dce89; text-decoration: none; font-weight: 600; }
        .auth-link:hover { text-decoration: underline; }
        .security-badge { display: flex; align-items: center; gap: 8px; background: rgba(45,206,137,0.08); border: 1px solid rgba(45,206,137,0.2); border-radius: 8px; padding: 10px 14px; margin-bottom: 20px; font-size: 12px; color: #2dce89; }
      `}</style>
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon">🏦</div>
            <div className="auth-logo-text">Bank<span>Secure</span></div>
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-sub">Sign in to your secure banking account</p>
          <div className="security-badge">
            🔒 Protected by 256-bit encryption & MFA
          </div>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <input className="auth-input" type="email" placeholder="john@example.com"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input className="auth-input" type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>
          <p className="auth-footer">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="auth-link">Create Account</Link>
          </p>
        </div>
      </div>
    </>
  );
}
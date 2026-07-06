"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI } from "../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.fullName || !form.email || !form.password)
      return setError("All fields are required.");
    setLoading(true);
    try {
      const res = await authAPI.register(form.fullName, form.email, form.password, form.phone);
      router.push(`/verify-otp?userId=${res.userId}&type=verify`);
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
        .password-hint { font-size: 11px; color: #6a7a8a; margin-top: 4px; }

        /* Accessibility: visible focus indicator (WCAG 2.1 SC 2.4.7) */
        .auth-input:focus,
        .auth-btn:focus,
        .auth-link:focus {
          outline: 2px solid #2dce89;
          outline-offset: 2px;
        }
      `}</style>
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon">🏦</div>
            <div className="auth-logo-text">Bank<span>Secure</span></div>
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-sub">Open your secure digital banking account</p>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="register-fullname">Full Name</label>
              <input id="register-fullname" className="auth-input" type="text" placeholder="John Doe"
                value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="register-email">Email Address</label>
              <input id="register-email" className="auth-input" type="email" placeholder="john@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="register-phone">Phone Number</label>
              <input id="register-phone" className="auth-input" type="text" placeholder="+977 98XXXXXXXX"
                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="register-password">Password</label>
              <input id="register-password" className="auth-input" type="password" placeholder="Min 8 chars"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              <p className="password-hint">Must include uppercase, lowercase, number & special character</p>
            </div>
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>
          <p className="auth-footer">
            Already have an account?{" "}
            <Link href="/login" className="auth-link">Sign In</Link>
          </p>
        </div>
      </div>
    </>
  );
}
"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authAPI } from "../lib/api";
import { useAuth } from "../context/auth-context";

function OTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUserAndToken } = useAuth();

  const userId = searchParams.get("userId") || "";
  const type = searchParams.get("type") || "login";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!otp || otp.length !== 6) return setError("Please enter the 6-digit OTP.");
    setLoading(true);
    try {
      const res = await authAPI.verifyOTP(userId, otp);
      setUserAndToken(res.user, res.token);
      setSuccess("Verified! Redirecting...");
      setTimeout(() => {
        if (res.user.role === "admin") router.push("/admin");
        else router.push("/dashboard");
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      await authAPI.resendOTP(userId);
      setSuccess("New OTP sent to your email!");
      setCountdown(60);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', sans-serif; background: #0f1923; }
        .auth-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .auth-card { background: #1a2332; border: 1px solid #2a3a4a; border-radius: 16px; padding: 40px; width: 100%; max-width: 420px; text-align: center; }
        .otp-icon { font-size: 48px; margin-bottom: 16px; }
        .auth-title { font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 8px; }
        .auth-sub { font-size: 13px; color: #8899aa; margin-bottom: 28px; line-height: 1.6; }
        .otp-input { width: 100%; padding: 16px; background: #0f1923; border: 2px solid #2a3a4a; border-radius: 10px; color: #fff; font-size: 28px; font-weight: 700; outline: none; text-align: center; letter-spacing: 12px; transition: border-color 0.15s; margin-bottom: 16px; }
        .otp-input:focus { border-color: #2dce89; }
        .auth-error { background: rgba(255,80,80,0.1); border: 1px solid rgba(255,80,80,0.3); color: #ff6b6b; font-size: 12px; padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; }
        .auth-success { background: rgba(45,206,137,0.1); border: 1px solid rgba(45,206,137,0.3); color: #2dce89; font-size: 12px; padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; }
        .auth-btn { width: 100%; padding: 13px; background: #1a6b3a; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: background 0.15s; }
        .auth-btn:hover { background: #22854a; }
        .auth-btn:disabled { opacity: 0.6; cursor: default; }
        .resend-btn { background: none; border: none; color: #2dce89; font-size: 13px; cursor: pointer; margin-top: 16px; text-decoration: underline; }
        .resend-btn:disabled { color: #8899aa; text-decoration: none; cursor: default; }
        .countdown { color: #8899aa; font-size: 13px; margin-top: 16px; }
        .security-info { display: flex; align-items: center; gap: 8px; background: rgba(45,206,137,0.08); border: 1px solid rgba(45,206,137,0.2); border-radius: 8px; padding: 10px 14px; margin-bottom: 20px; font-size: 12px; color: #2dce89; text-align: left; }
      `}</style>
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="otp-icon">📧</div>
          <h1 className="auth-title">
            {type === "verify" ? "Verify Your Email" : "Two-Factor Authentication"}
          </h1>
          <p className="auth-sub">
            We sent a 6-digit OTP to your registered email address.<br />
            It expires in <strong style={{ color: "#2dce89" }}>10 minutes</strong>.
          </p>
          <div className="security-info">
            🔐 Never share your OTP with anyone, including BankSecure staff.
          </div>
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}
          <form onSubmit={handleVerify}>
            <input
              className="otp-input"
              type="text"
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
              autoFocus
            />
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP →"}
            </button>
          </form>
          {countdown > 0 ? (
            <p className="countdown">Resend OTP in {countdown}s</p>
          ) : (
            <button className="resend-btn" onClick={handleResend} disabled={resending}>
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default function OTPPage() {
  return (
    <Suspense fallback={null}>
      <OTPForm />
    </Suspense>
  );
}
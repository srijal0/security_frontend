"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', sans-serif; background: #0f1923; color: #fff; }
        .hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; text-align: center; }
        .logo { display: flex; align-items: center; gap: 12px; margin-bottom: 48px; }
        .logo-icon { width: 56px; height: 56px; background: #1a6b3a; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 28px; }
        .logo-text { font-size: 28px; font-weight: 800; color: #fff; }
        .logo-text span { color: #2dce89; }
        .hero-title { font-size: 48px; font-weight: 900; color: #fff; margin-bottom: 16px; line-height: 1.1; }
        .hero-title span { color: #2dce89; }
        .hero-sub { font-size: 16px; color: #8899aa; max-width: 480px; line-height: 1.7; margin-bottom: 40px; }
        .hero-btns { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; margin-bottom: 60px; }
        .btn-primary { padding: 14px 32px; background: #1a6b3a; color: #fff; border: none; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; transition: background 0.15s; }
        .btn-primary:hover { background: #22854a; }
        .btn-secondary { padding: 14px 32px; background: transparent; color: #fff; border: 1.5px solid #2a3a4a; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; transition: border-color 0.15s; }
        .btn-secondary:hover { border-color: #2dce89; color: #2dce89; }
        .features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 800px; width: 100%; }
        .feature { background: #1a2332; border: 1px solid #2a3a4a; border-radius: 12px; padding: 24px; text-align: center; }
        .feature-icon { font-size: 32px; margin-bottom: 12px; }
        .feature-title { font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 6px; }
        .feature-desc { font-size: 12px; color: #8899aa; line-height: 1.6; }
        @media (max-width: 600px) { .features { grid-template-columns: 1fr; } .hero-title { font-size: 32px; } }
      `}</style>
      <div className="hero">
        <div className="logo">
          <div className="logo-icon">🏦</div>
          <div className="logo-text">Bank<span>Secure</span></div>
        </div>
        <h1 className="hero-title">Banking that puts<br /><span>security first</span></h1>
        <p className="hero-sub">
          Experience next-generation digital banking with military-grade encryption,
          multi-factor authentication, and real-time fraud protection.
        </p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={() => router.push("/register")}>
            Open Account →
          </button>
          <button className="btn-secondary" onClick={() => router.push("/login")}>
            Sign In
          </button>
        </div>
        <div className="features">
          <div className="feature">
            <div className="feature-icon">🔐</div>
            <div className="feature-title">MFA Protected</div>
            <div className="feature-desc">Every login secured with OTP-based two-factor authentication</div>
          </div>
          <div className="feature">
            <div className="feature-icon">🛡️</div>
            <div className="feature-title">Brute-Force Protection</div>
            <div className="feature-desc">Account auto-locks after 5 failed attempts with rate limiting</div>
          </div>
          <div className="feature">
            <div className="feature-icon">🔒</div>
            <div className="feature-title">256-bit Encryption</div>
            <div className="feature-desc">All data encrypted in transit and at rest using industry standards</div>
          </div>
        </div>
      </div>
    </>
  );
}
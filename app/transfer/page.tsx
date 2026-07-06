"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { transactionAPI } from "../lib/api";

export default function TransferPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "confirm" | "done">("form");
  const [toAccountNumber, setToAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ newBalance: number; reference: string } | null>(null);

  const validate = () => {
    if (!/^BS\d{8}$/.test(toAccountNumber.trim()))
      return "Enter a valid account number (e.g. BS12345678).";
    const amt = Number(amount);
    if (!amount || isNaN(amt) || amt <= 0) return "Enter a valid amount greater than 0.";
    if (amt > 100000) return "Transfer limit is Rs 100,000 per transaction.";
    return "";
  };

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);
    setError("");
    setStep("confirm");
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await transactionAPI.transfer(
        toAccountNumber.trim(),
        Number(amount),
        description.trim()
      );
      setResult({ newBalance: res.newBalance, reference: res.transaction.reference });
      setStep("done");
    } catch (err: any) {
      setError(err.message);
      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", padding: 24 }}>
      <style>{`
        /* Accessibility: visible focus indicator (WCAG 2.1 SC 2.4.7) */
        input:focus, button:focus {
          outline: 2px solid #2dce89;
          outline-offset: 2px;
        }
        label { display: block; margin-top: 12px; margin-bottom: 4px; font-size: 13px; font-weight: 600; }
      `}</style>
      <h1>Transfer Money</h1>

      {error && <div style={{ color: "#ff6b6b", margin: "12px 0" }}>{error}</div>}

      {step === "form" && (
        <form onSubmit={handleReview}>
          <label htmlFor="transfer-account">Recipient Account Number</label>
          <input
            id="transfer-account"
            value={toAccountNumber}
            onChange={(e) => setToAccountNumber(e.target.value)}
            placeholder="BS12345678"
          />
          <label htmlFor="transfer-amount">Amount (Rs)</label>
          <input
            id="transfer-amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1000"
          />
          <label htmlFor="transfer-description">Description (optional)</label>
          <input
            id="transfer-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Rent, gift, etc."
          />
          <button type="submit">Review Transfer →</button>
        </form>
      )}

      {step === "confirm" && (
        <div>
          <p>You're about to send <strong>Rs {amount}</strong> to <strong>{toAccountNumber}</strong>.</p>
          {description && <p>Note: {description}</p>}
          <button disabled={loading} onClick={handleConfirm}>
            {loading ? "Processing..." : "Confirm Transfer"}
          </button>
          <button disabled={loading} onClick={() => setStep("form")}>
            Back
          </button>
        </div>
      )}

      {step === "done" && result && (
        <div>
          <h2>✅ Transfer Successful</h2>
          <p>New balance: Rs {result.newBalance}</p>
          <p>Reference: {result.reference}</p>
          <button onClick={() => router.push("/dashboard")}>Back to Dashboard</button>
        </div>
      )}
    </div>
  );
}
"use client";
import { useRouter } from "next/navigation";

export default function Cancel() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #00296B 0%, #003F88 40%, #0a3d7a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{
        background: "white", borderRadius: 24, padding: "3rem",
        textAlign: "center", maxWidth: 440,
        boxShadow: "0 30px 80px rgba(0,0,0,0.3)"
      }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>😕</div>
        <h1 style={{ color: "#00296B", fontWeight: 800, fontSize: "1.5rem", margin: "0 0 0.5rem" }}>
          Payment Cancelled
        </h1>
        <p style={{ color: "#64748b", margin: "0 0 1.5rem" }}>
          No worries — you can upgrade anytime.
        </p>
        <button onClick={() => router.push("/")} style={{
          background: "linear-gradient(135deg, #00509D, #00296B)",
          color: "white", border: "none", borderRadius: 12,
          padding: "0.85rem 2rem", fontSize: "1rem", fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit"
        }}>
          ← Back to Resumind
        </button>
      </div>
    </div>
  );
}
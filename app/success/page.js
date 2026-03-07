"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Success() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => router.push("/"), 4000);
  }, []);

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
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
        <h1 style={{ color: "#00296B", fontWeight: 800, fontSize: "1.5rem", margin: "0 0 0.5rem" }}>
          Payment Successful!
        </h1>
        <p style={{ color: "#64748b", margin: "0 0 1.5rem" }}>
          Welcome to Resumind Premium. You now have unlimited access.
        </p>
        <div style={{
          background: "#DCFCE7", border: "1px solid #BBF7D0",
          borderRadius: 10, padding: "0.75rem", color: "#16A34A",
          fontSize: "0.85rem"
        }}>
          ✅ Redirecting you back in a few seconds...
        </div>
      </div>
    </div>
  );
}
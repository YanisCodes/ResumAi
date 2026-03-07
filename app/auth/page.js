"use client";
import { useState } from "react";
import { createClient } from "../../lib/supabase";
import { useRouter } from "next/navigation";

const colors = {
  gold1: "#FFD500", gold2: "#FDC500",
  blue1: "#00509D", blue2: "#003F88", blue3: "#00296B",
};

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      });
      if (error) setError(error.message);
      else setMessage("Check your email to confirm your account ✅");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push("/");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg, ${colors.blue3} 0%, ${colors.blue2} 40%, #0a3d7a 100%)`,
      fontFamily: "'DM Sans', sans-serif",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; }
        input:focus { outline: none !important; border-color: #00509D !important; box-shadow: 0 0 0 3px #00509D22 !important; background: white !important; }
        input::placeholder { color: #aab4c8; }
        .auth-btn { transition: all 0.2s ease; }
        .auth-btn:hover { transform: translateY(-2px); }
      `}</style>

      {/* Decorative circles */}
      <div style={{ position: "fixed", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: `${colors.gold1}18`, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -150, left: -100, width: 500, height: 500, borderRadius: "50%", background: `${colors.blue1}30`, pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 440, position: "relative" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: `${colors.gold1}22`, border: `1px solid ${colors.gold1}44`,
            borderRadius: 30, padding: "0.4rem 1.2rem", marginBottom: "1rem"
          }}>
            <span style={{ fontSize: "1.1rem" }}>🤖</span>
            <span style={{ color: colors.gold1, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.1em" }}>RESUMIND</span>
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.8rem", color: "white", margin: "0 0 0.5rem"
          }}>
            {mode === "login" ? "Welcome back 👋" : "Create your account ✨"}
          </h1>
          <p style={{ color: "#8aafd4", fontSize: "0.9rem", margin: 0 }}>
            {mode === "login" ? "Sign in to access your CVs" : "Start generating professional CVs for free"}
          </p>
        </div>

        {/* Card */}
        <div style={{ background: "white", borderRadius: 24, boxShadow: "0 30px 80px rgba(0,0,0,0.3)", overflow: "hidden" }}>
          <div style={{ height: 6, background: `linear-gradient(90deg, ${colors.gold1}, ${colors.gold2}, ${colors.blue1})` }} />
          <div style={{ padding: "2rem" }}>

            {/* Toggle */}
            <div style={{
              display: "flex", background: "#f1f5f9",
              borderRadius: 12, padding: 4, marginBottom: "1.5rem"
            }}>
              {["login", "signup"].map((m) => (
                <button key={m} onClick={() => { setMode(m); setError(null); setMessage(null); }} style={{
                  flex: 1, padding: "0.6rem", borderRadius: 10, border: "none",
                  background: mode === m ? "white" : "transparent",
                  color: mode === m ? colors.blue3 : "#94a3b8",
                  fontWeight: mode === m ? 700 : 500,
                  fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit",
                  boxShadow: mode === m ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.2s"
                }}>
                  {m === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            {/* Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {mode === "signup" && (
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: colors.blue3, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Full Name</label>
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Yacine Bouazza"
                    style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "0.7rem 0.9rem", fontSize: "0.9rem", background: "#f8fafc", color: "#1a1a2e", transition: "all 0.2s" }}
                  />
                </div>
              )}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: colors.blue3, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="yacine@gmail.com"
                  style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "0.7rem 0.9rem", fontSize: "0.9rem", background: "#f8fafc", color: "#1a1a2e", transition: "all 0.2s" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: colors.blue3, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Password</label>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "0.7rem 0.9rem", fontSize: "0.9rem", background: "#f8fafc", color: "#1a1a2e", transition: "all 0.2s" }}
                />
              </div>
            </div>

            {/* Error / Message */}
            {error && (
              <div style={{ marginTop: "1rem", background: "#FEE2E2", border: "1px solid #FECACA", borderRadius: 10, padding: "0.75rem 1rem", fontSize: "0.85rem", color: "#DC2626" }}>
                ❌ {error}
              </div>
            )}
            {message && (
              <div style={{ marginTop: "1rem", background: "#DCFCE7", border: "1px solid #BBF7D0", borderRadius: 10, padding: "0.75rem 1rem", fontSize: "0.85rem", color: "#16A34A" }}>
                ✅ {message}
              </div>
            )}

            {/* Submit */}
            <button onClick={handleSubmit} disabled={loading} className="auth-btn" style={{
              width: "100%", marginTop: "1.5rem",
              background: loading ? "#94a3b8" : `linear-gradient(135deg, ${colors.gold1}, ${colors.gold2})`,
              color: loading ? "white" : colors.blue3,
              border: "none", borderRadius: 12, padding: "0.9rem",
              fontSize: "1rem", fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              boxShadow: loading ? "none" : `0 4px 20px ${colors.gold1}66`
            }}>
              {loading ? "⏳ Loading..." : mode === "login" ? "Sign In →" : "Create Account →"}
            </button>

            <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "0.8rem", marginTop: "1rem" }}>
              {mode === "login" ? "No account yet? " : "Already have an account? "}
              <span onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }}
                style={{ color: colors.blue1, fontWeight: 600, cursor: "pointer" }}>
                {mode === "login" ? "Sign up for free" : "Sign in"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
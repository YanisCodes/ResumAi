"use client";
export const dynamic = 'force-dynamic'
import { useState, useEffect } from "react";
import { createClient } from "../../lib/supabase";
import { useRouter } from "next/navigation";

const themes = {
  light: {
    bg: "#FDF6EC",
    bgAlt: "#F5ECD7",
    card: "#FFFFFF",
    border: "#E8E4DF",
    muted: "#C8C4BE",
    accent: "#4A7C6F",
    accentAlt: "#2D5A4E",
    text: "#1A3A2E",
    inputBg: "#FDF6EC",
    inputFocusBg: "#FFFFFF",
    focusRing: "rgba(74,124,111,0.12)",
    shadow: "rgba(26,58,46,",
    pillBg: "#FFFFFF",
    pillShadow: "0 1px 4px rgba(26,58,46,0.08)",
    errorBg: "#fef2f2", errorBorder: "#fecaca", errorText: "#b91c1c",
    successBg: "#f0fdf4", successBorder: "#bbf7d0", successText: "#15803d",
  },
  dark: {
    bg: "#212C28",
    bgAlt: "#2A3632",
    card: "#313E3A",
    border: "#3F4E48",
    muted: "#6E8078",
    accent: "#5EA393",
    accentAlt: "#4A7C6F",
    text: "#E4DED6",
    inputBg: "#28332F",
    inputFocusBg: "#313E3A",
    focusRing: "rgba(94,163,147,0.18)",
    shadow: "rgba(0,0,0,",
    pillBg: "#3A4842",
    pillShadow: "0 1px 4px rgba(0,0,0,0.2)",
    errorBg: "#2E2222", errorBorder: "#4A3030", errorText: "#F0A0A0",
    successBg: "#1E2E24", successBorder: "#2A4A38", successText: "#80D4A0",
  },
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

  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const saved = localStorage.getItem("resumind-theme");
    if (saved === "dark") setTheme("dark");
  }, []);
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("resumind-theme", next);
  };
  const t = themes[theme];

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
  else router.push("/");
}
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(180deg, ${t.bgAlt} 0%, ${t.bg} 40%, ${t.bgAlt} 100%)`,
      fontFamily: "'Inter', sans-serif",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem",
      transition: "background 0.3s",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input:focus { outline: none !important; border-color: ${t.accent} !important; box-shadow: 0 0 0 3px ${t.focusRing} !important; background: ${t.inputFocusBg} !important; }
        input::placeholder { color: ${t.muted}; }
        .auth-btn { transition: all 0.2s ease; }
        .auth-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px ${t.shadow}0.2) !important; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>

        {/* Theme toggle */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
          <button onClick={toggleTheme} title={theme === "light" ? "Dark mode" : "Light mode"} style={{
            width: 38, height: 22, borderRadius: 12, padding: 0,
            background: theme === "dark" ? t.accent : t.border,
            border: "none", cursor: "pointer", position: "relative",
            transition: "background 0.3s",
          }}>
            <div style={{
              width: 16, height: 16, borderRadius: "50%",
              background: theme === "dark" ? t.bg : "#FFFFFF",
              position: "absolute", top: 3,
              left: theme === "dark" ? 19 : 3,
              transition: "left 0.3s, background 0.3s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
            }} />
          </button>
        </div>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p style={{
            color: t.accent, fontSize: "0.78rem", fontWeight: 600,
            letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.8rem"
          }}>Resumind</p>
          <h1 style={{
            fontFamily: "'Lora', serif",
            fontSize: "1.7rem", color: t.text, margin: "0 0 0.5rem",
            fontWeight: 700,
          }}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p style={{ color: t.muted, fontSize: "0.88rem", margin: 0 }}>
            {mode === "login" ? "Sign in to access your CVs" : "Start generating professional CVs for free"}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: t.card, borderRadius: 16,
          boxShadow: `0 1px 3px ${t.shadow}0.05), 0 10px 40px ${t.shadow}0.04)`,
          border: `1px solid ${t.border}`,
          overflow: "hidden",
          transition: "background 0.3s, border-color 0.3s",
        }}>
          <div style={{ height: 2, background: t.accent }} />
          <div style={{ padding: "2rem" }}>

            {/* Toggle */}
            <div style={{
              display: "flex", background: t.bgAlt,
              borderRadius: 10, padding: 4, marginBottom: "1.5rem",
              border: `1px solid ${t.border}`,
            }}>
              {["login", "signup"].map((m) => (
                <button key={m} onClick={() => { setMode(m); setError(null); setMessage(null); }} style={{
                  flex: 1, padding: "0.6rem", borderRadius: 8, border: "none",
                  background: mode === m ? t.pillBg : "transparent",
                  color: mode === m ? t.text : t.muted,
                  fontWeight: mode === m ? 700 : 500,
                  fontSize: "0.88rem", cursor: "pointer", fontFamily: "inherit",
                  boxShadow: mode === m ? t.pillShadow : "none",
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
                  <label style={{ display: "block", fontSize: "0.73rem", fontWeight: 600, color: t.text, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Full Name</label>
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Yacine Bouazza"
                    style={{ width: "100%", border: `1.5px solid ${t.border}`, borderRadius: 8, padding: "0.7rem 0.9rem", fontSize: "0.88rem", background: t.inputBg, color: t.text, transition: "all 0.2s" }}
                  />
                </div>
              )}
              <div>
                <label style={{ display: "block", fontSize: "0.73rem", fontWeight: 600, color: t.text, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="yacine@gmail.com"
                  style={{ width: "100%", border: `1.5px solid ${t.border}`, borderRadius: 8, padding: "0.7rem 0.9rem", fontSize: "0.88rem", background: t.inputBg, color: t.text, transition: "all 0.2s" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.73rem", fontWeight: 600, color: t.text, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Password</label>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: "100%", border: `1.5px solid ${t.border}`, borderRadius: 8, padding: "0.7rem 0.9rem", fontSize: "0.88rem", background: t.inputBg, color: t.text, transition: "all 0.2s" }}
                />
              </div>
            </div>

            {/* Error / Message */}
            {error && (
              <div style={{
                marginTop: "1rem", background: t.errorBg, border: `1px solid ${t.errorBorder}`,
                borderRadius: 8, padding: "0.75rem 1rem", fontSize: "0.84rem", color: t.errorText
              }}>
                {error}
              </div>
            )}
            {message && (
              <div style={{
                marginTop: "1rem", background: t.successBg, border: `1px solid ${t.successBorder}`,
                borderRadius: 8, padding: "0.75rem 1rem", fontSize: "0.84rem", color: t.successText
              }}>
                {message}
              </div>
            )}

            {/* Submit */}
            <button onClick={handleSubmit} disabled={loading} className="auth-btn" style={{
              width: "100%", marginTop: "1.5rem",
              background: loading ? t.muted : t.accent,
              color: "white",
              border: "none", borderRadius: 10, padding: "0.9rem",
              fontSize: "0.95rem", fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              boxShadow: loading ? "none" : `0 4px 16px ${t.shadow}0.2)`
            }}>
              {loading ? "Loading..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>

            <p style={{ textAlign: "center", color: t.muted, fontSize: "0.8rem", marginTop: "1.2rem" }}>
              {mode === "login" ? "No account yet? " : "Already have an account? "}
              <span onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }}
                style={{ color: t.accent, fontWeight: 600, cursor: "pointer" }}>
                {mode === "login" ? "Sign up for free" : "Sign in"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

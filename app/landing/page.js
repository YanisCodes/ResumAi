"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const themes = {
  light: {
    bg: "#FDF6EC", bgAlt: "#F5ECD7", card: "#FFFFFF",
    nav: "rgba(253,246,236,0.88)", border: "#E8E4DF", muted: "#C8C4BE",
    accent: "#4A7C6F", accentAlt: "#2D5A4E", text: "#1A3A2E",
    shadow: "rgba(26,58,46,", pillBg: "#FFFFFF",
    pillShadow: "0 1px 4px rgba(26,58,46,0.08)",
    problemBg: "#1A3A2E", problemText: "#E4DED6",
    problemMuted: "#8FA89E", problemAccent: "#5EA393",
    ctaBg: "#2D5A4E", ctaText: "#FDF6EC", ctaMuted: "rgba(253,246,236,0.6)",
    ctaBtn: "#F5ECD7", ctaBtnText: "#1A3A2E",
    heroBadgeBg: "rgba(74,124,111,0.08)", heroBadgeBorder: "rgba(74,124,111,0.15)",
    featureHover: "rgba(74,124,111,0.04)", pricingPopBg: "rgba(74,124,111,0.03)",
    grainOpacity: 0.03,
  },
  dark: {
    bg: "#212C28", bgAlt: "#2A3632", card: "#313E3A",
    nav: "rgba(33,44,40,0.88)", border: "#3F4E48", muted: "#6E8078",
    accent: "#5EA393", accentAlt: "#4A7C6F", text: "#E4DED6",
    shadow: "rgba(0,0,0,", pillBg: "#3A4842",
    pillShadow: "0 1px 4px rgba(0,0,0,0.2)",
    problemBg: "#161E1B", problemText: "#E4DED6",
    problemMuted: "#8FA89E", problemAccent: "#5EA393",
    ctaBg: "#2A3632", ctaText: "#E4DED6", ctaMuted: "rgba(228,222,214,0.5)",
    ctaBtn: "#5EA393", ctaBtnText: "#FFFFFF",
    heroBadgeBg: "rgba(94,163,147,0.1)", heroBadgeBorder: "rgba(94,163,147,0.2)",
    featureHover: "rgba(94,163,147,0.06)", pricingPopBg: "rgba(94,163,147,0.06)",
    grainOpacity: 0.04,
  },
};

export default function LandingPage() {
  const [theme, setTheme] = useState("light");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("resumind-theme");
    if (saved === "dark") setTheme("dark");
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("revealed"); observer.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("resumind-theme", next);
  };

  const t = themes[theme];

  const smoothScroll = (e) => {
    e.preventDefault();
    const id = e.currentTarget.getAttribute("href").slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const features = [
    { num: "01", title: "Build from scratch", desc: "Enter your education, skills, and experience. Our AI organizes them into a clean, well-structured CV. No templates to wrestle with." },
    { num: "02", title: "Tailor to any offer", desc: "Paste a job or internship description. Resumind rewrites your CV to match — right keywords, right tone, right emphasis." },
    { num: "03", title: "Export clean PDF", desc: "Download an ATS-friendly PDF that passes automated screening. Proper formatting, no watermarks, no decorative noise." },
  ];

  const steps = [
    { num: "I", title: "Describe yourself", desc: "Fill in your details — name, university, skills, experience. Just the raw material, no formatting needed." },
    { num: "II", title: "AI generates your CV", desc: "Llama 3.3 70B structures everything into a polished, professional document in seconds." },
    { num: "III", title: "Download and apply", desc: "Export as PDF. Submit to internships, jobs, or graduate programs with confidence." },
  ];

  const freePerks = ["Build from scratch", "Tailor to job offers", "PDF export", "AI-powered generation"];
  const premiumPerks = ["Everything in Free", "Unlimited CVs per day", "Priority generation", "Support the project"];

  return (
    <div className="landing-grain" style={{ minHeight: "100vh", fontFamily: "'Inter', sans-serif", background: t.bg, color: t.text, transition: "background 0.4s, color 0.4s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; }

        /* Grain overlay */
        .landing-grain::before {
          content: ""; position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none; z-index: 9999; opacity: ${t.grainOpacity};
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat; background-size: 256px 256px;
        }

        /* Scroll reveal */
        [data-reveal] { opacity: 0; transform: translateY(28px); transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1); }
        [data-reveal].revealed { opacity: 1; transform: translateY(0); }
        [data-reveal-child] { opacity: 0; transform: translateY(20px); transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1); }
        .revealed [data-reveal-child] { opacity: 1; transform: translateY(0); }
        .revealed [data-reveal-child]:nth-child(1) { transition-delay: 0.05s; }
        .revealed [data-reveal-child]:nth-child(2) { transition-delay: 0.15s; }
        .revealed [data-reveal-child]:nth-child(3) { transition-delay: 0.25s; }

        /* Hero entrance */
        .h-fade-1 { animation: fadeInUp 0.55s 0s ease both; }
        .h-fade-2 { animation: fadeInUp 0.6s 0.1s ease both; }
        .h-fade-3 { animation: fadeInUp 0.6s 0.2s ease both; }
        .h-fade-4 { animation: fadeInUp 0.55s 0.32s ease both; }

        /* Buttons */
        .btn-p { transition: transform 0.2s ease, box-shadow 0.2s ease; text-decoration: none; }
        .btn-p:hover { transform: translateY(-2px); box-shadow: 0 8px 24px ${t.shadow}0.22) !important; }
        .btn-s { transition: border-color 0.2s, color 0.2s; text-decoration: none; }
        .btn-s:hover { border-color: ${t.accent} !important; color: ${t.accent} !important; }
        .btn-cta { transition: transform 0.2s ease, box-shadow 0.2s ease; text-decoration: none; }
        .btn-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2) !important; }

        /* Cards */
        .f-card { transition: border-color 0.3s, background 0.3s, transform 0.3s; }
        .f-card:hover { border-color: ${t.accent} !important; background: ${t.featureHover} !important; transform: translateY(-4px); }

        /* Nav */
        .nav-lnk { color: ${t.muted}; text-decoration: none; font-size: 0.88rem; font-weight: 500; transition: color 0.2s; font-family: 'Inter', sans-serif; }
        .nav-lnk:hover { color: ${t.text}; }

        /* Scroll target offset */
        #features, #how-it-works, #pricing { scroll-margin-top: 72px; }

        /* Grids */
        .g-features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .g-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; }
        .g-pricing { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

        @media (max-width: 768px) {
          .g-features, .g-steps, .g-pricing { grid-template-columns: 1fr !important; }
          .hero-ctas { flex-direction: column !important; align-items: center !important; }
          .hero-ctas a { width: 100%; max-width: 340px; text-align: center; }
          .nav-mid { display: none !important; }
          .footer-row { flex-direction: column; text-align: center; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .g-features { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: t.nav, backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${t.border}`,
        boxShadow: scrolled ? `0 1px 12px ${t.shadow}0.08)` : "none",
        transition: "box-shadow 0.3s, background 0.3s",
      }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.7rem 2rem", position: "relative" }}>
          <span style={{ color: t.text, fontWeight: 700, fontSize: "1.05rem", fontFamily: "'Lora', serif", letterSpacing: "0.02em" }}>Resumind</span>
          <div className="nav-mid" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "2rem" }}>
            <a href="#features" onClick={smoothScroll} className="nav-lnk">Features</a>
            <a href="#pricing" onClick={smoothScroll} className="nav-lnk">Pricing</a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button onClick={toggleTheme} title={theme === "light" ? "Dark mode" : "Light mode"} style={{
              width: 38, height: 22, borderRadius: 12, padding: 0, background: theme === "dark" ? t.accent : t.border,
              border: "none", cursor: "pointer", position: "relative", transition: "background 0.3s",
            }}>
              <div style={{
                width: 16, height: 16, borderRadius: "50%", background: theme === "dark" ? t.bg : "#FFF",
                position: "absolute", top: 3, left: theme === "dark" ? 19 : 3,
                transition: "left 0.3s, background 0.3s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
              }} />
            </button>
            <Link href="/auth" className="btn-p" style={{
              background: t.accent, color: "#FFF", padding: "0.45rem 1.2rem",
              borderRadius: 8, fontWeight: 600, fontSize: "0.85rem", display: "inline-block",
              fontFamily: "'Inter', sans-serif", boxShadow: `0 2px 8px ${t.shadow}0.15)`,
            }}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop: "clamp(7rem, 14vw, 11rem)", paddingBottom: "clamp(4rem, 8vw, 7rem)", textAlign: "center", position: "relative" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 1.5rem" }}>
          <div className="h-fade-1" style={{
            display: "inline-block", padding: "0.4rem 1.1rem", borderRadius: 20,
            background: t.heroBadgeBg, border: `1px solid ${t.heroBadgeBorder}`,
            fontSize: "0.75rem", fontWeight: 600, color: t.accent,
            letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.8rem",
          }}>AI-Powered CV Generator</div>
          <h1 className="h-fade-2" style={{
            fontFamily: "'Lora', serif", fontWeight: 700,
            fontSize: "clamp(2.1rem, 5vw, 3.4rem)", lineHeight: 1.14,
            color: t.text, margin: "0 0 1.3rem",
          }}>
            Your career deserves<br />more than a blank page
          </h1>
          <p className="h-fade-3" style={{
            color: t.muted, fontSize: "clamp(1rem, 2vw, 1.12rem)",
            lineHeight: 1.7, margin: "0 auto 2.8rem", maxWidth: 520,
          }}>
            Resumind builds polished, ATS-ready CVs in seconds.<br />
            Designed for Algerian students entering the job market.
          </p>
          <div className="h-fade-4 hero-ctas" style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/auth" className="btn-p" style={{
              display: "inline-block", background: t.accent, color: "#FFF",
              padding: "0.9rem 2.4rem", borderRadius: 10, fontWeight: 700,
              fontSize: "1rem", fontFamily: "'Inter', sans-serif",
              boxShadow: `0 4px 16px ${t.shadow}0.18)`,
            }}>Get Started — it's free</Link>
            <a href="#how-it-works" onClick={smoothScroll} className="btn-s" style={{
              display: "inline-block", background: "transparent",
              color: t.text, border: `1.5px solid ${t.border}`,
              padding: "0.9rem 2.4rem", borderRadius: 10, fontWeight: 600,
              fontSize: "1rem", fontFamily: "'Inter', sans-serif", cursor: "pointer",
            }}>See how it works</a>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ width: 48, height: 1, background: t.border, margin: "0 auto" }} />

      {/* ── PROBLEM ── */}
      <section style={{ background: t.problemBg, padding: "clamp(4rem, 8vw, 6.5rem) clamp(1.5rem, 5vw, 4rem)", transition: "background 0.4s" }}>
        <div data-reveal style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: t.problemAccent, fontSize: "0.76rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1rem" }}>The problem</p>
          <h2 style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)", lineHeight: 1.25, color: t.problemText, marginBottom: "1.5rem" }}>
            CV tools weren't built for us
          </h2>
          <p style={{ color: t.problemMuted, fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)", lineHeight: 1.8, maxWidth: 580, margin: "0 auto" }}>
            Generic CV builders recycle the same American templates.
            They miss the nuances — your university abbreviations, your bilingual profile,
            the specific formats Algerian employers actually expect.
            <br /><br />
            And the moment your CV starts looking decent, you hit a paywall.
            Students shouldn't need a subscription to apply for an internship.
          </p>
          <div style={{ width: 36, height: 2, background: t.problemAccent, margin: "2.5rem auto 0", borderRadius: 1, opacity: 0.5 }} />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ background: t.bg, padding: "clamp(4rem, 8vw, 6.5rem) clamp(1.5rem, 5vw, 4rem)", transition: "background 0.4s" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div data-reveal style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ color: t.accent, fontSize: "0.76rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.8rem" }}>Features</p>
            <h2 style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.2rem)", color: t.text }}>
              Everything you need, nothing you don't
            </h2>
          </div>
          <div data-reveal className="g-features">
            {features.map((f, i) => (
              <div key={i} data-reveal-child className="f-card" style={{
                background: t.card, border: `1px solid ${t.border}`,
                borderRadius: 14, padding: "2rem 1.8rem", cursor: "default",
              }}>
                <span style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: "1.8rem", color: t.accent, display: "block", marginBottom: "1rem", lineHeight: 1 }}>{f.num}</span>
                <h3 style={{ fontFamily: "'Lora', serif", fontWeight: 600, fontSize: "1.08rem", color: t.text, marginBottom: "0.7rem" }}>{f.title}</h3>
                <p style={{ color: t.muted, fontSize: "0.9rem", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ background: t.bgAlt, padding: "clamp(4rem, 8vw, 6.5rem) clamp(1.5rem, 5vw, 4rem)", transition: "background 0.4s" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div data-reveal style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p style={{ color: t.accent, fontSize: "0.76rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.8rem" }}>How it works</p>
            <h2 style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.2rem)", color: t.text }}>
              Three steps to a polished CV
            </h2>
          </div>
          <div data-reveal className="g-steps">
            {steps.map((s, i) => (
              <div key={i} data-reveal-child style={{ textAlign: "center" }}>
                <span style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: "clamp(2.5rem, 4vw, 3.2rem)", color: t.accent, display: "block", marginBottom: "1rem", lineHeight: 1, opacity: 0.75 }}>{s.num}</span>
                <h3 style={{ fontFamily: "'Lora', serif", fontWeight: 600, fontSize: "1.05rem", color: t.text, marginBottom: "0.6rem" }}>{s.title}</h3>
                <p style={{ color: t.muted, fontSize: "0.9rem", lineHeight: 1.65, maxWidth: 280, margin: "0 auto" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ background: t.bg, padding: "clamp(4rem, 8vw, 6.5rem) clamp(1.5rem, 5vw, 4rem)", transition: "background 0.4s" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div data-reveal style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ color: t.accent, fontSize: "0.76rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.8rem" }}>Pricing</p>
            <h2 style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.2rem)", color: t.text, marginBottom: "0.5rem" }}>
              Start free, upgrade when ready
            </h2>
            <p style={{ color: t.muted, fontSize: "0.92rem" }}>No credit card required. Pay with Chargily when you need more.</p>
          </div>
          <div data-reveal className="g-pricing">
            {/* Free */}
            <div data-reveal-child style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: "2.2rem 2rem", transition: "border-color 0.3s" }}>
              <p style={{ color: t.muted, fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Free</p>
              <p style={{ fontFamily: "'Lora', serif", fontSize: "2.2rem", fontWeight: 700, color: t.text, marginBottom: "0.2rem" }}>
                0 <span style={{ fontSize: "1rem", fontWeight: 500, color: t.muted }}>DZD</span>
              </p>
              <p style={{ color: t.muted, fontSize: "0.87rem", marginBottom: "1.5rem" }}>5 CVs per day, forever</p>
              <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: "1.5rem" }}>
                {freePerks.map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", marginBottom: "0.7rem", fontSize: "0.9rem", color: t.text }}>
                    <span style={{ color: t.accent, fontWeight: 700, fontSize: "0.82rem", lineHeight: "1.5" }}>&#10003;</span>{p}
                  </div>
                ))}
              </div>
              <Link href="/auth" className="btn-s" style={{
                display: "block", textAlign: "center", marginTop: "1.5rem",
                padding: "0.75rem", borderRadius: 10, border: `1.5px solid ${t.border}`,
                color: t.text, fontWeight: 600, fontSize: "0.9rem",
                fontFamily: "'Inter', sans-serif",
              }}>Get Started</Link>
            </div>
            {/* Premium */}
            <div data-reveal-child style={{ background: t.pricingPopBg, border: `2px solid ${t.accent}`, borderRadius: 14, padding: "2.2rem 2rem", position: "relative", transition: "border-color 0.3s" }}>
              <div style={{
                position: "absolute", top: "-0.7rem", left: "50%", transform: "translateX(-50%)",
                background: t.accent, color: "#FFF", padding: "0.22rem 0.9rem", borderRadius: 20,
                fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
              }}>Best value</div>
              <p style={{ color: t.accent, fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Premium</p>
              <p style={{ fontFamily: "'Lora', serif", fontSize: "2.2rem", fontWeight: 700, color: t.text, marginBottom: "0.2rem" }}>
                200 <span style={{ fontSize: "1rem", fontWeight: 500, color: t.muted }}>DZD</span>
              </p>
              <p style={{ color: t.muted, fontSize: "0.87rem", marginBottom: "1.5rem" }}>One-time payment, unlimited forever</p>
              <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: "1.5rem" }}>
                {premiumPerks.map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", marginBottom: "0.7rem", fontSize: "0.9rem", color: t.text }}>
                    <span style={{ color: t.accent, fontWeight: 700, fontSize: "0.82rem", lineHeight: "1.5" }}>&#10003;</span>{p}
                  </div>
                ))}
              </div>
              <Link href="/auth" className="btn-p" style={{
                display: "block", textAlign: "center", marginTop: "1.5rem",
                padding: "0.75rem", borderRadius: 10, background: t.accent,
                color: "#FFF", fontWeight: 600, fontSize: "0.9rem",
                fontFamily: "'Inter', sans-serif",
                boxShadow: `0 4px 16px ${t.shadow}0.18)`,
              }}>Upgrade to Premium</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: t.ctaBg, padding: "clamp(4rem, 8vw, 5.5rem) clamp(1.5rem, 5vw, 4rem)", textAlign: "center", transition: "background 0.4s" }}>
        <div data-reveal style={{ maxWidth: 580, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)", lineHeight: 1.3, color: t.ctaText, marginBottom: "1rem" }}>
            Your next opportunity<br />won't wait
          </h2>
          <p style={{ color: t.ctaMuted, fontSize: "1rem", lineHeight: 1.7, marginBottom: "2.2rem" }}>
            Join Algerian students already building better CVs with Resumind.
          </p>
          <Link href="/auth" className="btn-cta" style={{
            display: "inline-block", background: t.ctaBtn, color: t.ctaBtnText,
            padding: "0.9rem 2.6rem", borderRadius: 10, fontWeight: 700,
            fontSize: "1rem", fontFamily: "'Inter', sans-serif",
          }}>Create your CV now</Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: t.bgAlt, borderTop: `1px solid ${t.border}`, padding: "2rem clamp(1.5rem, 5vw, 4rem)", transition: "background 0.4s" }}>
        <div className="footer-row" style={{ maxWidth: 1080, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'Lora', serif", fontWeight: 600, color: t.text, fontSize: "0.92rem" }}>Resumind</span>
          <p style={{ color: t.muted, fontSize: "0.8rem" }}>Built in Algeria, for Algeria.</p>
        </div>
      </footer>
    </div>
  );
}

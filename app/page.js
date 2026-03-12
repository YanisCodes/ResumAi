"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { createClient } from "../lib/supabase";
import { useRouter } from "next/navigation";

const themes = {
  light: {
    bg: "#FDF6EC",
    bgAlt: "#F5ECD7",
    card: "#FFFFFF",
    nav: "rgba(253,246,236,0.92)",
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
  },
  dark: {
    bg: "#212C28",
    bgAlt: "#2A3632",
    card: "#313E3A",
    nav: "rgba(33,44,40,0.92)",
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
  },
};

const ThemeContext = createContext();

function Navbar() {
  const { t, theme, toggleTheme } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      console.log("[Navbar] getUser result:", { user: data?.user?.id, email: data?.user?.email, error: error?.message ?? null });
      if (data.user) {
        setUser(data.user);
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_premium")
          .eq("id", data.user.id)
          .single();
        setIsPremium(profile?.is_premium || false);
      }
    };
    getUser();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const upgradeToPremium = async () => {
    setLoadingPayment(true);
    try {
      console.log("[upgradeToPremium] user state at call time:", {
        userId: user?.id,
        userEmail: user?.email,
        userIsNull: user === null,
      });
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.error === "Unauthorized") {
        alert("Please log in to upgrade.");
        return;
      }
      if (data.checkout_url) window.location.href = data.checkout_url;
    } catch (err) {
      alert("Payment error");
    }
    setLoadingPayment(false);
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: t.nav, backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${t.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0.75rem 2rem"
    }}>
      <span style={{ color: t.text, fontWeight: 700, fontSize: "1.05rem", fontFamily: "'Lora', serif", letterSpacing: "0.02em" }}>
        Resumind
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Theme toggle */}
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
        {isPremium ? (
          <span style={{
            background: t.accentAlt, color: themes.light.bg,
            padding: "0.3rem 0.9rem", borderRadius: 20,
            fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.03em"
          }}>Premium</span>
        ) : (
          <button onClick={upgradeToPremium} disabled={loadingPayment} style={{
            background: t.accent, color: "white",
            border: "none", borderRadius: 6,
            padding: "0.4rem 1rem", fontSize: "0.82rem", fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit"
          }}>
            {loadingPayment ? "..." : "Upgrade — 200 DZD"}
          </button>
        )}
        <span style={{ color: t.muted, fontSize: "0.82rem" }}>{user?.email}</span>
        <button onClick={logout} style={{
          background: "transparent", color: t.text,
          border: `1px solid ${t.border}`, borderRadius: 6,
          padding: "0.4rem 1rem", fontSize: "0.82rem", cursor: "pointer",
          fontFamily: "inherit", fontWeight: 600
        }}>Sign out</button>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title }) {
  const { t } = useContext(ThemeContext);
  return (
    <div style={{ marginBottom: "1.2rem" }}>
      <span style={{
        fontFamily: "'Lora', serif", fontWeight: 600,
        color: t.text, fontSize: "0.95rem", letterSpacing: "0.01em"
      }}>{title}</span>
      <div style={{ height: 1, background: t.border, marginTop: "0.45rem" }} />
    </div>
  );
}

function CVDisplay({ cv, onBack, mode }) {
  const { t } = useContext(ThemeContext);

  const downloadPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const html2canvas = (await import("html2canvas")).default;
    const element = document.getElementById("cv-content");
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`CV-${cv.nom_complet || "resumind"}.pdf`);
  };

  return (
    <div className="cv-page-enter" style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${t.bgAlt} 0%, ${t.bg} 40%, ${t.bgAlt} 100%)`, padding: "2rem", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        #cv-content { font-family: 'Times New Roman', serif; }
        .cv-page-enter { animation: fadeIn 0.4s ease both; }
        .cv-card-enter { animation: fadeInUp 0.5s 0.1s ease both; }
        .cv-actions-enter { animation: fadeIn 0.45s 0.05s ease both; }
        .cv-section-title {
          font-size: 11pt; font-weight: bold; text-transform: uppercase;
          letter-spacing: 0.05em; color: #000;
          border-bottom: 1.5px solid #000;
          padding-bottom: 2px; margin: 14px 0 8px;
        }
        .cv-bullet { display: flex; gap: 6px; margin: 3px 0; font-size: 9.5pt; line-height: 1.4; }
        .cv-bullet::before { content: "•"; flex-shrink: 0; margin-top: 1px; }
      `}</style>

      <Navbar />

      <div style={{ maxWidth: 860, margin: "0 auto", paddingTop: "4rem" }}>
        {mode === "tailor" && (
          <div style={{
            background: t.bgAlt, border: `1px solid ${t.accent}`,
            borderRadius: 8, padding: "0.8rem 1.2rem", marginBottom: "1rem",
            fontSize: "0.88rem", color: t.text, fontFamily: "'Inter', sans-serif"
          }}>
            <strong>Tailored CV</strong> — This CV has been optimized to match the job description you provided.
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }} className="cv-actions-enter">
          <button onClick={onBack} style={{
            background: t.card, color: t.text,
            border: `1.5px solid ${t.border}`,
            padding: "0.6rem 1.4rem", borderRadius: 8, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit", fontSize: "0.88rem"
          }}>← Edit</button>
          <button onClick={downloadPDF} style={{
            background: t.accent, color: "white",
            border: "none", padding: "0.6rem 1.8rem",
            borderRadius: 8, fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit", fontSize: "0.88rem",
            boxShadow: `0 2px 8px ${t.shadow}0.2)`
          }}>Download PDF</button>
        </div>

        <div id="cv-content" className="cv-card-enter" style={{
          background: "white", padding: "2.2cm 2cm",
          boxShadow: `0 1px 3px ${t.shadow}0.06), 0 8px 30px ${t.shadow}0.05)`,
          borderRadius: 3, color: "#000"
        }}>
          <div style={{ textAlign: "center", marginBottom: "0.4cm" }}>
            <h1 style={{ fontSize: "18pt", fontWeight: "bold", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {cv.nom_complet}
            </h1>
            <p style={{ fontSize: "9pt", margin: 0, color: "#222" }}>
              {[cv.telephone, cv.email, cv.ville, cv.linkedin, cv.github].filter(Boolean).join(" • ")}
            </p>
          </div>

          {cv.objectif && (
            <>
              <div className="cv-section-title">Professional Objective</div>
              <p style={{ fontSize: "9.5pt", margin: "4px 0", lineHeight: 1.5 }}>{cv.objectif}</p>
            </>
          )}

          {cv.formation && (
            <>
              <div className="cv-section-title">Education</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ fontWeight: "bold", fontSize: "10pt" }}>{cv.formation.ecole}</span>
                  <span style={{ fontSize: "9pt", color: "#444" }}> — {cv.formation.lieu}</span>
                  <div style={{ fontSize: "9.5pt", fontStyle: "italic" }}>{cv.formation.diplome}</div>
                </div>
                <span style={{ fontSize: "9pt", fontWeight: "bold", whiteSpace: "nowrap" }}>{cv.formation.periode}</span>
              </div>
              {cv.formation.mentions?.map((m, i) => (
                <div key={i} className="cv-bullet">{m}</div>
              ))}
            </>
          )}

          {cv.experiences?.length > 0 && (
            <>
              <div className="cv-section-title">Work Experience</div>
              {cv.experiences.map((exp, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: "bold", fontSize: "10pt" }}>{exp.entreprise}</span>
                    <span style={{ fontSize: "9pt", fontWeight: "bold" }}>{exp.periode}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontStyle: "italic", fontSize: "9.5pt" }}>{exp.poste}</span>
                    <span style={{ fontStyle: "italic", fontSize: "9pt" }}>{exp.lieu}</span>
                  </div>
                  {exp.points?.map((p, j) => (
                    <div key={j} className="cv-bullet">{p}</div>
                  ))}
                </div>
              ))}
            </>
          )}

          {cv.projets?.length > 0 && (
            <>
              <div className="cv-section-title">Projects</div>
              {cv.projets.map((proj, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: "9.5pt" }}>
                    <span style={{ fontWeight: "bold" }}>{proj.nom}</span>
                    {proj.tech && <span style={{ fontStyle: "italic", color: "#444" }}> | {proj.tech}</span>}
                  </div>
                  {proj.points?.map((p, j) => (
                    <div key={j} className="cv-bullet">{p}</div>
                  ))}
                </div>
              ))}
            </>
          )}

          {cv.competences && (
            <>
              <div className="cv-section-title">Technical Skills</div>
              <div style={{ fontSize: "9.5pt", lineHeight: 1.7 }}>
                {cv.competences.langages && <div><strong>Languages:</strong> {cv.competences.langages}</div>}
                {cv.competences.frameworks && <div><strong>Frameworks:</strong> {cv.competences.frameworks}</div>}
                {cv.competences.outils && <div><strong>Tools:</strong> {cv.competences.outils}</div>}
              </div>
            </>
          )}

          {cv.langues?.length > 0 && (
            <>
              <div className="cv-section-title">Languages</div>
              <div style={{ fontSize: "9.5pt" }}>{cv.langues.join(" • ")}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState("scratch");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [cvData, setCvData] = useState(null);
  const [limitError, setLimitError] = useState(false);
  const [form, setForm] = useState({
    nom: "", prenom: "", email: "", telephone: "",
    ville: "", formation: "", ecole: "", annee: "",
    experiences: "", competences: "", langues: "", objectif: "",
    jobDescription: "",
  });

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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const upgradeToPremium = async () => {
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.error === "Unauthorized") { alert("Please log in to upgrade."); return; }
      if (data.checkout_url) window.location.href = data.checkout_url;
    } catch {
      alert("Payment error");
    }
  };

  const generateCV = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, mode }),
      });
      const data = await res.json();

      if (data.error === "LIMIT_REACHED") {
        setLimitError(true);
        setLoading(false);
        return;
      }

      if (data.error) throw new Error(data.error);
      setCvData(data.cv);
      setStep(2);
    } catch (err) {
      alert("Error generating CV: " + err.message);
    }
    setLoading(false);
  };

  if (step === 2 && cvData) {
    return (
      <ThemeContext.Provider value={{ t, theme, toggleTheme }}>
        <CVDisplay cv={cvData} onBack={() => setStep(1)} mode={mode} />
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ t, theme, toggleTheme }}>
      <div style={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${t.bgAlt} 0%, ${t.bg} 40%, ${t.bgAlt} 100%)`,
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        transition: "background 0.3s",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:wght@400;500;600;700&display=swap');
          * { box-sizing: border-box; }
          input, textarea { transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease; }
          input:focus, textarea:focus {
            outline: none !important;
            border-color: ${t.accent} !important;
            box-shadow: 0 0 0 3px ${t.focusRing} !important;
            background: ${t.inputFocusBg} !important;
          }
          input::placeholder, textarea::placeholder { color: ${t.muted}; }
          .field-group label {
            display: block; font-size: 0.73rem; font-weight: 600;
            color: ${t.text}; margin-bottom: 0.4rem;
            text-transform: uppercase; letter-spacing: 0.06em;
          }
          .generate-btn { transition: all 0.2s ease; }
          .generate-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px ${t.shadow}0.25) !important; }
          .mode-btn { transition: all 0.2s ease; cursor: pointer; border: none; font-family: inherit; }
          .mode-btn:hover { opacity: 0.85; }

          .anim-hero-label { animation: fadeInUp 0.5s 0s ease both; }
          .anim-hero-h1    { animation: fadeInUp 0.55s 0.08s ease both; }
          .anim-hero-sub   { animation: fadeInUp 0.55s 0.18s ease both; }
          .anim-mode-bar   { animation: fadeInUp 0.5s 0.28s ease both; }
          .anim-info-banner{ animation: fadeIn 0.45s 0.35s ease both; }
          .anim-form-card  { animation: fadeInUp 0.6s 0.38s ease both; }
          .anim-tailor-box { animation: slideDown 0.3s ease both; }
          .anim-limit-banner { animation: slideDown 0.25s ease both; }
          .anim-spinner {
            display: inline-block; width: 13px; height: 13px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top-color: #fff; border-radius: 50%;
            animation: spin 0.7s linear infinite;
            vertical-align: middle; margin-right: 8px; margin-bottom: 1px;
          }
        `}</style>

        <Navbar />

        <div style={{ maxWidth: 720, margin: "0 auto", padding: "2.5rem 1.5rem", paddingTop: "5.5rem", position: "relative" }}>

          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p className="anim-hero-label" style={{
              color: t.accent, fontSize: "0.78rem", fontWeight: 600,
              letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.8rem"
            }}>Resumind</p>
            <h1 className="anim-hero-h1" style={{
              fontFamily: "'Lora', serif",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              color: t.text, margin: "0 0 0.75rem", lineHeight: 1.25,
              fontWeight: 700,
            }}>
              Your professional CV,<br />
              <span style={{ color: t.accent }}>generated by AI</span>
            </h1>
            <p className="anim-hero-sub" style={{ color: t.muted, fontSize: "0.9rem", margin: 0 }}>
              Powered by Llama 3.3 70B — free to use
            </p>
          </div>

          <div className="anim-mode-bar" style={{
            display: "flex", background: t.bgAlt,
            borderRadius: 10, padding: 4, marginBottom: "1.5rem",
            border: `1px solid ${t.border}`,
          }}>
            <button className="mode-btn" onClick={() => setMode("scratch")} style={{
              flex: 1, padding: "0.8rem 1rem", borderRadius: 8,
              background: mode === "scratch" ? t.pillBg : "transparent",
              color: mode === "scratch" ? t.text : t.muted,
              fontWeight: mode === "scratch" ? 700 : 500, fontSize: "0.9rem",
              boxShadow: mode === "scratch" ? t.pillShadow : "none",
            }}>Build from scratch</button>
            <button className="mode-btn" onClick={() => setMode("tailor")} style={{
              flex: 1, padding: "0.8rem 1rem", borderRadius: 8,
              background: mode === "tailor" ? t.pillBg : "transparent",
              color: mode === "tailor" ? t.text : t.muted,
              fontWeight: mode === "tailor" ? 700 : 500, fontSize: "0.9rem",
              boxShadow: mode === "tailor" ? t.pillShadow : "none",
            }}>Tailor to a job offer</button>
          </div>

          <div className="anim-info-banner" style={{
            background: t.bgAlt, borderRadius: 8,
            padding: "0.85rem 1.2rem", marginBottom: "1.5rem",
            border: `1px solid ${t.border}`,
          }}>
            <p style={{ color: t.accentAlt, margin: 0, fontSize: "0.87rem", lineHeight: 1.6 }}>
              {mode === "scratch"
                ? "Fill in your details and AI will generate a clean, professional CV tailored to your profile."
                : "Paste a job description and AI will craft a CV specifically optimized to match that offer — keywords, skills, and tone included."}
            </p>
          </div>

          <div className="anim-form-card" style={{
            background: t.card, borderRadius: 16,
            boxShadow: `0 1px 3px ${t.shadow}0.05), 0 10px 40px ${t.shadow}0.04)`,
            border: `1px solid ${t.border}`,
            overflow: "hidden",
            transition: "background 0.3s, border-color 0.3s",
          }}>
            <div style={{ height: 2, background: t.accent }} />
            <div style={{ padding: "2.2rem" }}>

              {mode === "tailor" && (
                <div style={{ marginBottom: "2rem" }}>
                  <div className="anim-tailor-box" style={{
                    background: t.bgAlt, border: `1.5px solid ${t.accent}`,
                    borderRadius: 10, padding: "1.2rem 1.4rem"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                      <span style={{ fontWeight: 700, color: t.text, fontSize: "0.88rem", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'Lora', serif" }}>Job / Internship Description</span>
                    </div>
                    <textarea name="jobDescription" value={form.jobDescription} onChange={handleChange}
                      placeholder="Paste the full job or internship description here..."
                      rows={5} style={{
                        width: "100%", border: `1.5px solid ${t.border}`, borderRadius: 8,
                        padding: "0.75rem 1rem", fontSize: "0.88rem",
                        background: t.inputFocusBg, color: t.text,
                        resize: "vertical", fontFamily: "inherit", lineHeight: 1.6
                      }} />
                  </div>
                </div>
              )}

              <SectionTitle icon="👤" title="Personal Information" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                {[
                  { name: "prenom", label: "First Name", placeholder: "Yacine" },
                  { name: "nom", label: "Last Name", placeholder: "Bouazza" },
                  { name: "email", label: "Email", placeholder: "yacine@gmail.com" },
                  { name: "telephone", label: "Phone", placeholder: "0555 12 34 56" },
                  { name: "ville", label: "City", placeholder: "Béjaïa" },
                  { name: "annee", label: "Study Year", placeholder: "2nd year" },
                ].map(f => (
                  <div key={f.name} className="field-group">
                    <label>{f.label}</label>
                    <input name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder}
                      style={{ width: "100%", border: `1.5px solid ${t.border}`, borderRadius: 8, padding: "0.65rem 0.9rem", fontSize: "0.88rem", background: t.inputBg, color: t.text }} />
                  </div>
                ))}
              </div>

              <SectionTitle icon="🎓" title="Education" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                {[
                  { name: "ecole", label: "School / University", placeholder: "ESTIN Béjaïa" },
                  { name: "formation", label: "Major / Field", placeholder: "Software Engineering" },
                ].map(f => (
                  <div key={f.name} className="field-group">
                    <label>{f.label}</label>
                    <input name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder}
                      style={{ width: "100%", border: `1.5px solid ${t.border}`, borderRadius: 8, padding: "0.65rem 0.9rem", fontSize: "0.88rem", background: t.inputBg, color: t.text }} />
                  </div>
                ))}
              </div>

              <SectionTitle icon="✨" title="Your Profile" />
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                {[
                  { name: "objectif", label: "Professional Objective", placeholder: "Ex: Seeking an internship in web development...", rows: 2 },
                  { name: "experiences", label: "Experiences & Projects", placeholder: "Ex: E-commerce project in Next.js (2024)\nWeb dev internship - Summer 2024", rows: 3 },
                  { name: "competences", label: "Technical Skills", placeholder: "Ex: JavaScript, React, Next.js, Python, SQL, Git...", rows: 2 },
                  { name: "langues", label: "Languages", placeholder: "Ex: Arabic (native), French (fluent), English (intermediate)", rows: 2 },
                ].map(f => (
                  <div key={f.name} className="field-group">
                    <label>{f.label}</label>
                    <textarea name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} rows={f.rows}
                      style={{ width: "100%", border: `1.5px solid ${t.border}`, borderRadius: 8, padding: "0.65rem 0.9rem", fontSize: "0.88rem", background: t.inputBg, color: t.text, resize: "vertical", fontFamily: "inherit" }} />
                  </div>
                ))}
              </div>

              {limitError && (
                <div className="anim-limit-banner" style={{
                  background: t.bgAlt,
                  border: `1.5px solid ${t.accent}`,
                  borderRadius: 10,
                  padding: "1rem 1.2rem",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: t.text, fontSize: "0.92rem" }}>
                      Daily limit reached
                    </p>
                    <p style={{ margin: "0.25rem 0 0", color: t.accentAlt, fontSize: "0.82rem", lineHeight: 1.5 }}>
                      You've used your 5 free CVs for today. Upgrade for unlimited access.
                    </p>
                  </div>
                  <button onClick={upgradeToPremium} style={{
                    background: t.accent, color: "white",
                    border: "none", borderRadius: 6,
                    padding: "0.55rem 1.2rem", fontSize: "0.85rem", fontWeight: 600,
                    cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit",
                  }}>
                    Upgrade to Premium
                  </button>
                </div>
              )}

              <button onClick={generateCV} disabled={loading} className="generate-btn" style={{
                width: "100%",
                background: loading ? t.muted : t.accent,
                color: "white",
                border: "none", borderRadius: 10, padding: "1rem",
                fontSize: "1rem", fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit", letterSpacing: "0.01em",
                boxShadow: loading ? "none" : `0 4px 16px ${t.shadow}0.2)`
              }}>
                {loading ? <><span className="anim-spinner" />Generating your CV...</> : mode === "tailor" ? "Generate tailored CV" : "Generate my CV"}
              </button>

              <p style={{ textAlign: "center", color: t.muted, fontSize: "0.76rem", marginTop: "1.2rem" }}>
                Powered by Llama 3.3 70B · Your data is never saved
              </p>
            </div>
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

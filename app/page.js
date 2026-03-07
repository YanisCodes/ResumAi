"use client";
import { useState, useEffect } from "react";
import { createClient } from "../lib/supabase";
import { useRouter } from "next/navigation";

const colors = {
  gold1: "#FFD500", gold2: "#FDC500",
  blue1: "#00509D", blue2: "#003F88", blue3: "#00296B",
};

function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(0,41,107,0.85)", backdropFilter: "blur(10px)",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0.75rem 2rem"
    }}>
      <span style={{ color: "#FFD500", fontWeight: 700, fontSize: "1rem" }}>🤖 Resumind</span>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>{user?.email}</span>
        <button onClick={logout} style={{
          background: "rgba(255,255,255,0.1)", color: "white",
          border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8,
          padding: "0.4rem 1rem", fontSize: "0.85rem", cursor: "pointer",
          fontFamily: "inherit", fontWeight: 600
        }}>Logout</button>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
      <span style={{ fontSize: "1.1rem" }}>{icon}</span>
      <span style={{ fontWeight: 700, color: "#00296B", fontSize: "0.95rem", letterSpacing: "0.02em" }}>{title}</span>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #e2e8f0, transparent)" }} />
    </div>
  );
}

function CVDisplay({ cv, onBack, mode }) {
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
    <div style={{ minHeight: "100vh", background: "#e8edf5", padding: "2rem", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        #cv-content { font-family: 'Times New Roman', serif; }
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
            background: "#FFF9E6", border: "2px solid #FFD500",
            borderRadius: 12, padding: "0.8rem 1.2rem", marginBottom: "1rem",
            fontSize: "0.88rem", color: "#00296B", fontFamily: "'DM Sans', sans-serif"
          }}>
            🎯 <strong>Tailored CV</strong> — This CV has been optimized to match the job description you provided.
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
          <button onClick={onBack} style={{
            background: "white", color: "#003F88", border: "2px solid #003F88",
            padding: "0.6rem 1.4rem", borderRadius: 10, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem"
          }}>← Edit</button>
          <button onClick={downloadPDF} style={{
            background: "linear-gradient(135deg, #00509D, #00296B)",
            color: "white", border: "none", padding: "0.6rem 1.8rem",
            borderRadius: 10, fontWeight: 700, cursor: "pointer",
            fontFamily: "inherit", fontSize: "0.9rem",
            boxShadow: "0 4px 15px #00296B55"
          }}>⬇ Download PDF</button>
        </div>

        <div id="cv-content" style={{
          background: "white", padding: "2.2cm 2cm",
          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          borderRadius: 4, color: "#000"
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
  const [form, setForm] = useState({
    nom: "", prenom: "", email: "", telephone: "",
    ville: "", formation: "", ecole: "", annee: "",
    experiences: "", competences: "", langues: "", objectif: "",
    jobDescription: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const generateCV = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, mode }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCvData(data.cv);
      setStep(2);
    } catch (err) {
      alert("Erreur lors de la génération du CV: " + err.message);
    }
    setLoading(false);
  };

  if (step === 2 && cvData) {
    return <CVDisplay cv={cvData} onBack={() => setStep(1)} mode={mode} />;
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg, ${colors.blue3} 0%, ${colors.blue2} 40%, #0a3d7a 100%)`,
      fontFamily: "'DM Sans', sans-serif",
      position: "relative", overflow: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; }
        input, textarea { transition: all 0.2s ease; }
        input:focus, textarea:focus {
          outline: none !important;
          border-color: #00509D !important;
          box-shadow: 0 0 0 3px #00509D22 !important;
          background: white !important;
        }
        input::placeholder, textarea::placeholder { color: #aab4c8; }
        .field-group label {
          display: block; font-size: 0.78rem; font-weight: 600;
          color: #00296B; margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.05em;
        }
        .generate-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px #00296B88 !important; }
        .generate-btn { transition: all 0.2s ease; }
        .mode-btn { transition: all 0.25s ease; cursor: pointer; border: none; font-family: inherit; }
      `}</style>

      <Navbar />

      <div style={{ position: "fixed", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: `${colors.gold1}18`, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -150, left: -100, width: 500, height: 500, borderRadius: "50%", background: `${colors.blue1}30`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "2.5rem 1.5rem", paddingTop: "5rem", position: "relative" }}>

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
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            color: "white", margin: "0 0 0.75rem", lineHeight: 1.2
          }}>Your professional CV,<br />
            <span style={{ color: colors.gold1 }}>generated by AI</span>
          </h1>
          <p style={{ color: "#8aafd4", fontSize: "0.95rem", margin: 0 }}>
            100% free • Powered by Llama 3.3 70B
          </p>
        </div>

        <div style={{
          display: "flex", background: "rgba(255,255,255,0.1)",
          borderRadius: 16, padding: 6, marginBottom: "1.5rem",
          backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)"
        }}>
          <button className="mode-btn" onClick={() => setMode("scratch")} style={{
            flex: 1, padding: "0.85rem 1rem", borderRadius: 12,
            background: mode === "scratch" ? "white" : "transparent",
            color: mode === "scratch" ? colors.blue3 : "rgba(255,255,255,0.7)",
            fontWeight: mode === "scratch" ? 700 : 500, fontSize: "0.95rem",
          }}>✏️ Build from scratch</button>
          <button className="mode-btn" onClick={() => setMode("tailor")} style={{
            flex: 1, padding: "0.85rem 1rem", borderRadius: 12,
            background: mode === "tailor" ? colors.gold1 : "transparent",
            color: mode === "tailor" ? colors.blue3 : "rgba(255,255,255,0.7)",
            fontWeight: mode === "tailor" ? 700 : 500, fontSize: "0.95rem",
          }}>🎯 Tailor to a job offer</button>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.08)", borderRadius: 12,
          padding: "0.85rem 1.2rem", marginBottom: "1.5rem",
          border: `1px solid ${mode === "tailor" ? colors.gold1 + "44" : "rgba(255,255,255,0.1)"}`,
        }}>
          <p style={{ color: "rgba(255,255,255,0.85)", margin: 0, fontSize: "0.88rem", lineHeight: 1.5 }}>
            {mode === "scratch"
              ? "📄 Fill in your details and AI will generate a clean, professional CV tailored to your profile."
              : "🎯 Paste a job description and AI will craft a CV specifically optimized to match that offer — keywords, skills, and tone included."}
          </p>
        </div>

        <div style={{ background: "white", borderRadius: 24, boxShadow: "0 30px 80px rgba(0,0,0,0.3)", overflow: "hidden" }}>
          <div style={{ height: 6, background: mode === "tailor" ? `linear-gradient(90deg, ${colors.gold1}, ${colors.gold2}, ${colors.blue1})` : `linear-gradient(90deg, ${colors.blue1}, ${colors.blue2}, ${colors.blue3})` }} />
          <div style={{ padding: "2.5rem" }}>

            {mode === "tailor" && (
              <div style={{ marginBottom: "2rem" }}>
                <div style={{
                  background: `${colors.gold1}15`, border: `2px solid ${colors.gold1}`,
                  borderRadius: 14, padding: "1.2rem 1.5rem"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "1.2rem" }}>🎯</span>
                    <span style={{ fontWeight: 700, color: colors.blue3, fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Job / Internship Description</span>
                  </div>
                  <textarea name="jobDescription" value={form.jobDescription} onChange={handleChange}
                    placeholder="Paste the full job or internship description here..."
                    rows={5} style={{
                      width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 10,
                      padding: "0.75rem 1rem", fontSize: "0.9rem",
                      background: "white", color: "#1a1a2e",
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
                    style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "0.65rem 0.9rem", fontSize: "0.9rem", background: "#f8fafc", color: "#1a1a2e" }} />
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
                    style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "0.65rem 0.9rem", fontSize: "0.9rem", background: "#f8fafc", color: "#1a1a2e" }} />
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
                    style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "0.65rem 0.9rem", fontSize: "0.9rem", background: "#f8fafc", color: "#1a1a2e", resize: "vertical", fontFamily: "inherit" }} />
                </div>
              ))}
            </div>

            <button onClick={generateCV} disabled={loading} className="generate-btn" style={{
              width: "100%",
              background: loading ? "#94a3b8" : mode === "tailor"
                ? `linear-gradient(135deg, ${colors.gold1} 0%, ${colors.gold2} 50%, #e6b800 100%)`
                : `linear-gradient(135deg, ${colors.blue1} 0%, ${colors.blue3} 100%)`,
              color: loading ? "white" : mode === "tailor" ? colors.blue3 : "white",
              border: "none", borderRadius: 14, padding: "1.1rem",
              fontSize: "1.05rem", fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit", letterSpacing: "0.02em",
              boxShadow: loading ? "none" : mode === "tailor" ? `0 4px 20px ${colors.gold1}66` : `0 4px 20px ${colors.blue2}66`
            }}>
              {loading ? "⏳ Generating your CV..." : mode === "tailor" ? "🎯 Generate tailored CV" : "✨ Generate my CV"}
            </button>

            <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "0.78rem", marginTop: "1rem" }}>
              Powered by Llama 3.3 70B • 100% free • Your data is never saved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
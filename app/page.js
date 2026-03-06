"use client";
import { useState } from "react";

const colors = {
  gold1: "#FFD500", gold2: "#FDC500",
  blue1: "#00509D", blue2: "#003F88", blue3: "#00296B",
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [cvData, setCvData] = useState(null);
  const [form, setForm] = useState({
    nom: "", prenom: "", email: "", telephone: "",
    ville: "", formation: "", ecole: "", annee: "",
    experiences: "", competences: "", langues: "", objectif: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const generateCV = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
    return <CVDisplay cv={cvData} onBack={() => setStep(1)} />;
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
      `}</style>

      <div style={{ position: "fixed", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: `${colors.gold1}18`, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -150, left: -100, width: 500, height: 500, borderRadius: "50%", background: `${colors.blue1}30`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "2.5rem 1.5rem", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: `${colors.gold1}22`, border: `1px solid ${colors.gold1}44`,
            borderRadius: 30, padding: "0.4rem 1.2rem", marginBottom: "1rem"
          }}>
            <span style={{ fontSize: "1.1rem" }}>🇩🇿</span>
            <span style={{ color: colors.gold1, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.1em" }}>CV GENERATOR DZ</span>
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            color: "white", margin: "0 0 0.75rem", lineHeight: 1.2
          }}>Crée ton CV professionnel<br />
            <span style={{ color: colors.gold1 }}>en quelques secondes</span>
          </h1>
          <p style={{ color: "#8aafd4", fontSize: "0.95rem", margin: 0 }}>
            Adapté au marché algérien • Propulsé par l'IA
          </p>
        </div>

        <div style={{ background: "white", borderRadius: 24, boxShadow: "0 30px 80px rgba(0,0,0,0.3)", overflow: "hidden" }}>
          <div style={{ height: 6, background: `linear-gradient(90deg, ${colors.gold1}, ${colors.gold2}, ${colors.blue1})` }} />
          <div style={{ padding: "2.5rem" }}>

            <SectionTitle icon="👤" title="Informations personnelles" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              {[
                { name: "prenom", label: "Prénom", placeholder: "Yacine" },
                { name: "nom", label: "Nom", placeholder: "Bouazza" },
                { name: "email", label: "Email", placeholder: "yacine@gmail.com" },
                { name: "telephone", label: "Téléphone", placeholder: "0555 12 34 56" },
                { name: "ville", label: "Ville", placeholder: "Béjaïa" },
                { name: "annee", label: "Année d'études", placeholder: "2ème année" },
              ].map(f => (
                <div key={f.name} className="field-group">
                  <label>{f.label}</label>
                  <input name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder}
                    style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "0.65rem 0.9rem", fontSize: "0.9rem", background: "#f8fafc", color: "#1a1a2e" }} />
                </div>
              ))}
            </div>

            <SectionTitle icon="🎓" title="Formation" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              {[
                { name: "ecole", label: "École / Université", placeholder: "ESTIN Béjaïa" },
                { name: "formation", label: "Spécialité", placeholder: "Ingénierie des SI" },
              ].map(f => (
                <div key={f.name} className="field-group">
                  <label>{f.label}</label>
                  <input name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder}
                    style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "0.65rem 0.9rem", fontSize: "0.9rem", background: "#f8fafc", color: "#1a1a2e" }} />
                </div>
              ))}
            </div>

            <SectionTitle icon="✨" title="Ton profil" />
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
              {[
                { name: "objectif", label: "Objectif professionnel", placeholder: "Ex: Obtenir un stage en développement web...", rows: 2 },
                { name: "experiences", label: "Expériences & Projets", placeholder: "Ex: Projet e-commerce Next.js (2024)\nStage développement web - Été 2024", rows: 3 },
                { name: "competences", label: "Compétences techniques", placeholder: "Ex: JavaScript, React, Next.js, Python, SQL, Git...", rows: 2 },
                { name: "langues", label: "Langues", placeholder: "Ex: Arabe (natif), Français (courant), Anglais (intermédiaire)", rows: 2 },
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
              background: loading ? "#94a3b8" : `linear-gradient(135deg, ${colors.gold1} 0%, ${colors.gold2} 50%, #e6b800 100%)`,
              color: loading ? "white" : colors.blue3,
              border: "none", borderRadius: 14, padding: "1.1rem",
              fontSize: "1.05rem", fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit", letterSpacing: "0.02em",
              boxShadow: loading ? "none" : `0 4px 20px ${colors.gold1}66`
            }}>
              {loading ? "⏳ Génération en cours..." : "✨ Générer mon CV professionnel"}
            </button>

            <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "0.78rem", marginTop: "1rem" }}>
              Propulsé par Llama 3.3 70B • 100% gratuit • Tes données ne sont pas sauvegardées
            </p>
          </div>
        </div>
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

function CVDisplay({ cv, onBack }) {
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
    pdf.save(`CV-${cv.nom_complet || "mon-cv"}.pdf`);
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

      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        {/* Action buttons */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
          <button onClick={onBack} style={{
            background: "white", color: "#003F88", border: "2px solid #003F88",
            padding: "0.6rem 1.4rem", borderRadius: 10, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem"
          }}>← Modifier</button>
          <button onClick={downloadPDF} style={{
            background: "linear-gradient(135deg, #00509D, #00296B)",
            color: "white", border: "none", padding: "0.6rem 1.8rem",
            borderRadius: 10, fontWeight: 700, cursor: "pointer",
            fontFamily: "inherit", fontSize: "0.9rem",
            boxShadow: "0 4px 15px #00296B55"
          }}>⬇ Télécharger PDF</button>
        </div>

        {/* CV Paper */}
        <div id="cv-content" style={{
          background: "white", padding: "2.2cm 2cm",
          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          borderRadius: 4, color: "#000"
        }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "0.4cm" }}>
            <h1 style={{ fontSize: "18pt", fontWeight: "bold", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {cv.nom_complet}
            </h1>
            <p style={{ fontSize: "9pt", margin: 0, color: "#222" }}>
              {[cv.telephone, cv.email, cv.ville, cv.linkedin, cv.github].filter(Boolean).join(" • ")}
            </p>
          </div>

          {/* Objectif */}
          {cv.objectif && (
            <>
              <div className="cv-section-title">Objectif Professionnel</div>
              <p style={{ fontSize: "9.5pt", margin: "4px 0", lineHeight: 1.5 }}>{cv.objectif}</p>
            </>
          )}

          {/* Formation */}
          {cv.formation && (
            <>
              <div className="cv-section-title">Formation</div>
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

          {/* Expériences */}
          {cv.experiences?.length > 0 && (
            <>
              <div className="cv-section-title">Expériences Professionnelles</div>
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

          {/* Projets */}
          {cv.projets?.length > 0 && (
            <>
              <div className="cv-section-title">Projets</div>
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

          {/* Compétences */}
          {cv.competences && (
            <>
              <div className="cv-section-title">Compétences Techniques</div>
              <div style={{ fontSize: "9.5pt", lineHeight: 1.7 }}>
                {cv.competences.langages && <div><strong>Langages :</strong> {cv.competences.langages}</div>}
                {cv.competences.frameworks && <div><strong>Frameworks :</strong> {cv.competences.frameworks}</div>}
                {cv.competences.outils && <div><strong>Outils :</strong> {cv.competences.outils}</div>}
              </div>
            </>
          )}

          {/* Langues */}
          {cv.langues?.length > 0 && (
            <>
              <div className="cv-section-title">Langues</div>
              <div style={{ fontSize: "9.5pt" }}>{cv.langues.join(" • ")}</div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
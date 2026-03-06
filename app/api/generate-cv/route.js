import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const form = await request.json();
    const isTailor = form.mode === "tailor";

    const systemPrompt = `You are an expert CV writer. You generate ONLY valid JSON, no text before or after, no backticks, no markdown. The JSON must be perfectly parseable.`;

    const tailorExtra = isTailor && form.jobDescription
      ? `\n\nJOB DESCRIPTION TO MATCH:\n${form.jobDescription}\n\nIMPORTANT: Tailor the CV specifically to match this job offer. Use relevant keywords from the job description. Reframe experiences and skills to align with what the employer is looking for. Optimize the professional objective to directly address the role.`
      : "";

    const userPrompt = `Generate a professional CV in JSON for this candidate:

Name: ${form.prenom} ${form.nom}
Email: ${form.email}
Phone: ${form.telephone}
City: ${form.ville}
School: ${form.ecole}
Field: ${form.formation}
Year: ${form.annee}
Objective: ${form.objectif}
Experiences: ${form.experiences}
Skills: ${form.competences}
Languages: ${form.langues}
${tailorExtra}

Return ONLY this JSON (nothing else, no backticks):
{
  "nom_complet": "First Last",
  "email": "email",
  "telephone": "phone",
  "ville": "city",
  "linkedin": "",
  "github": "",
  "objectif": "A compelling 2-3 sentence professional objective${isTailor ? " tailored to the job description" : ""}",
  "formation": {
    "ecole": "school name",
    "diplome": "degree title",
    "periode": "2023 - 2026",
    "lieu": "city",
    "mentions": ["relevant academic achievement", "relevant coursework"]
  },
  "experiences": [
    {
      "poste": "job title",
      "entreprise": "company name",
      "periode": "dates",
      "lieu": "city",
      "points": ["achievement 1 with numbers if possible", "achievement 2", "achievement 3"]
    }
  ],
  "projets": [
    {
      "nom": "project name",
      "tech": "technologies used",
      "points": ["project description", "impact or result"]
    }
  ],
  "competences": {
    "langages": "list of languages",
    "frameworks": "list of frameworks",
    "outils": "list of tools"
  },
  "langues": ["Arabic (native)", "French (fluent)"]
}

If information is missing, generate plausible professional content based on the student context.${isTailor ? " Prioritize skills and experiences that match the job description." : ""}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 2000,
    });

    const raw = completion.choices[0].message.content;
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const cv = JSON.parse(cleaned);

    return Response.json({ cv });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "CV generation failed" }, { status: 500 });
  }
}
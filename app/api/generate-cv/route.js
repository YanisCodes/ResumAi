import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    // Get user from session
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {}
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get profile
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("is_premium, cv_count, last_reset")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    const today = new Date().toISOString().split("T")[0];
    const lastReset = profile.last_reset;

    // Reset count if it's a new day
    if (lastReset !== today) {
      await supabaseAdmin
        .from("profiles")
        .update({ cv_count: 0, last_reset: today })
        .eq("id", user.id);
      profile.cv_count = 0;
    }

    // Check freemium limit
    if (!profile.is_premium && profile.cv_count >= 5) {
      return Response.json({
        error: "LIMIT_REACHED",
        message: "You've reached your daily limit of 5 CVs. Upgrade to Premium for unlimited CVs."
      }, { status: 403 });
    }

    const form = await request.json();
    const isTailor = form.mode === "tailor";

    const systemPrompt = `You are an expert CV writer. You generate ONLY valid JSON, no text before or after, no backticks, no markdown. The JSON must be perfectly parseable.`;

    const tailorExtra = isTailor && form.jobDescription
      ? `\n\nJOB DESCRIPTION TO MATCH:\n${form.jobDescription}\n\nIMPORTANT: Tailor the CV specifically to match this job offer. Use relevant keywords from the job description.`
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
      "points": ["achievement 1", "achievement 2", "achievement 3"]
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
}`;

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

    // Increment cv_count
    await supabaseAdmin
      .from("profiles")
      .update({ cv_count: profile.cv_count + 1 })
      .eq("id", user.id);

    return Response.json({ 
      cv,
      remaining: profile.is_premium ? null : 5 - (profile.cv_count + 1)
    });

  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "CV generation failed" }, { status: 500 });
  }
}
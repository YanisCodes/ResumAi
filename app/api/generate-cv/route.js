import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const form = await request.json();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `Tu es un expert en rédaction de CV pour le marché algérien. 
Tu génères UNIQUEMENT du JSON valide, sans aucun texte avant ou après, sans backticks, sans markdown.
Le JSON doit être parfaitement parseable.`,
        },
        {
          role: "user",
          content: `Génère un CV professionnel en JSON pour cet étudiant algérien :

Nom : ${form.nom}
Prénom : ${form.prenom}
Email : ${form.email}
Téléphone : ${form.telephone}
Ville : ${form.ville}
École : ${form.ecole}
Formation : ${form.formation}
Année : ${form.annee}
Objectif : ${form.objectif}
Expériences : ${form.experiences}
Compétences : ${form.competences}
Langues : ${form.langues}

Retourne UNIQUEMENT ce JSON (rien d'autre, pas de texte, pas de backticks) :
{
  "nom_complet": "Prénom Nom",
  "email": "email",
  "telephone": "telephone",
  "ville": "ville",
  "linkedin": "",
  "github": "",
  "objectif": "Un objectif professionnel percutant en 2-3 phrases",
  "formation": {
    "ecole": "nom école",
    "diplome": "intitulé du diplôme",
    "periode": "2023 - 2026",
    "lieu": "ville",
    "mentions": ["mention ou GPA si pertinent", "cours pertinents séparés par virgule"]
  },
  "experiences": [
    {
      "poste": "titre du poste",
      "entreprise": "nom entreprise",
      "periode": "dates",
      "lieu": "ville",
      "points": ["accomplissement 1 avec chiffres si possible", "accomplissement 2", "accomplissement 3"]
    }
  ],
  "projets": [
    {
      "nom": "nom du projet",
      "tech": "technologies utilisées",
      "points": ["description du projet", "impact ou résultat"]
    }
  ],
  "competences": {
    "langages": "liste des langages",
    "frameworks": "liste des frameworks",
    "outils": "liste des outils"
  },
  "langues": ["Arabe (natif)", "Français (courant)"]
}

Si une information n'est pas fournie, génère quelque chose de plausible et professionnel basé sur le contexte étudiant algérien en informatique.
Pour les expériences et projets, base toi sur ce que l'étudiant a fourni et enrichis avec des détails professionnels.`,
        },
      ],
      max_tokens: 2000,
    });

    const raw = completion.choices[0].message.content;
    
    // Clean potential markdown backticks just in case
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const cv = JSON.parse(cleaned);

    return Response.json({ cv });
  } catch (error) {
    console.error("Erreur:", error);
    return Response.json({ error: "Erreur génération CV" }, { status: 500 });
  }
}
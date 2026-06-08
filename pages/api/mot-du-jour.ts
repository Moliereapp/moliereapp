import type { NextApiRequest, NextApiResponse } from 'next'

const THEMES = ['Littérature', 'Philosophie', 'Sciences', 'Vie quotidienne', 'Histoire', 'Art']

function getThemeDuJour(): string {
  const index = Math.floor(new Date().getTime() / (1000 * 60 * 60 * 24)) % THEMES.length
  return THEMES[index]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Méthode non autorisée' })

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'Clé API manquante' })

  const theme = getThemeDuJour()
  const today = new Date().toISOString().split('T')[0]

  const prompt = `Tu es un expert de la langue française. Génère un mot rare et peu utilisé du registre "${theme}".

Réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ou après, sans balises markdown :

{
  "mot": "le mot",
  "nature": "nom masculin / nom féminin / adjectif / verbe / etc.",
  "theme": "${theme}",
  "definition": "définition claire et précise en 1-2 phrases",
  "etymologie": "origine du mot (langue + sens original)",
  "exemples": [
    { "texte": "phrase d'exemple avec le mot en contexte", "contexte": "type d'usage" },
    { "texte": "deuxième phrase d'exemple", "contexte": "type d'usage" },
    { "texte": "troisième phrase d'exemple", "contexte": "type d'usage" }
  ],
  "quiz": {
    "correct": "la vraie définition courte pour le quiz",
    "wrongs": [
      "fausse définition crédible 1",
      "fausse définition crédible 2",
      "fausse définition crédible 3"
    ],
    "anecdote": "fait intéressant sur l'étymologie ou l'usage de ce mot"
  }
}`

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://moliereapp.vercel.app',
        'X-Title': 'Molière App',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout:free',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return res.status(500).json({ error: 'Erreur OpenRouter', details: err })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) return res.status(500).json({ error: 'Réponse vide de l\'IA' })

    const cleaned = content.replace(/```json|```/g, '').trim()
    const mot = JSON.parse(cleaned)

    return res.status(200).json({ ...mot, id: today, date: today })

  } catch (err) {
    console.error('Erreur génération mot:', err)
    return res.status(500).json({ error: 'Erreur lors de la génération du mot' })
  }
}

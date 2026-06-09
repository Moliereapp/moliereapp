import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
type Props = {
  streak: number
  motsVus: number
  quizCompletes: number
  scoreTotal: number
  motUtilises: number
}

const NIVEAUX = [
  { nom: 'Novice',     min: 0   },
  { nom: 'Lettré',     min: 10  },
  { nom: 'Érudit',     min: 25  },
  { nom: 'Académicien', min: 50 },
]

function getNiveau(mots: number) {
  return [...NIVEAUX].reverse().find(n => mots >= n.min) ?? NIVEAUX[0]
}

function getProchainNiveau(mots: number) {
  return NIVEAUX.find(n => n.min > mots)
}

export default function ScreenProfil({ streak, motsVus, quizCompletes, scoreTotal, motUtilises }: Props) {
  const niveau = getNiveau(motsVus)
  const prochain = getProchainNiveau(motsVus)
  const xpPct = prochain ? Math.round((motsVus - getNiveau(motsVus).min) / (prochain.min - getNiveau(motsVus).min) * 100) : 100
  const tauxReussite = quizCompletes > 0 ? Math.round((scoreTotal / (quizCompletes * 4)) * 100) : 0

  const badges = [
    { nom: 'Premier pas', desc: '1er mot découvert', icon: '★', gagne: motsVus >= 1 },
    { nom: 'Série de feu', desc: '7 jours consécutifs', icon: '🔥', gagne: streak >= 7 },
    { nom: 'Quizzeur', desc: '5 quiz complétés', icon: '◈', gagne: quizCompletes >= 5 },
    { nom: 'Rhéteur', desc: '10 mots utilisés', icon: '✦', gagne: motUtilises >= 10 },
    { nom: '30 jours', desc: 'Série de 30 jours', icon: '◉', gagne: streak >= 30 },
    { nom: 'Académicien', desc: '50 mots appris', icon: '⚜', gagne: motsVus >= 50 },
  ]
const [suggestion, setSuggestion] = useState('')
const [suggestionEnvoyee, setSuggestionEnvoyee] = useState(false)
  const objectifs = [
    { nom: 'Lire 5 mots du jour', actuel: Math.min(motsVus, 5), total: 5, couleur: '#F5C842' },
    { nom: 'Compléter 3 quiz', actuel: Math.min(quizCompletes, 3), total: 3, couleur: '#2563EB' },
    { nom: 'Utiliser 2 mots', actuel: Math.min(motUtilises, 2), total: 2, couleur: '#16A34A' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', background: '#111' }}>
      <div style={{ background: '#F5C842', padding: '20px 18px 24px', textAlign: 'center', borderBottom: '2px solid #333' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#111', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '26px', color: '#F5C842' }}>M</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#111' }}>Mathis</h2>
        <span style={{ display: 'inline-block', background: '#111', color: '#F5C842', fontSize: '12px', fontWeight: 500, padding: '3px 12px', borderRadius: '20px', marginTop: '6px' }}>
          {niveau.nom}
        </span>
        {prochain && (
          <div style={{ marginTop: '12px' }}>
            <p style={{ fontSize: '11px', color: '#111', opacity: .7, marginBottom: '4px' }}>{motsVus} / {prochain.min} mots vers {prochain.nom}</p>
            <div style={{ height: '6px', background: 'rgba(0,0,0,.2)', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#111', borderRadius: '10px', width: `${xpPct}%` }} />
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px', padding: '16px 18px' }}>
        {[
          { val: motsVus, lbl: 'Mots appris' },
          { val: streak, lbl: 'Jours de suite' },
          { val: `${tauxReussite}%`, lbl: 'Quiz réussis' },
          { val: motUtilises, lbl: 'Mots utilisés' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#1C1C1C', borderRadius: '12px', padding: '14px', textAlign: 'center', border: '1px solid #3A3A3A' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#F5C842' }}>{s.val}</p>
            <p style={{ fontSize: '12px', color: '#A0A0A0', marginTop: '3px', fontWeight: 500 }}>{s.lbl}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 18px 16px' }}>
        <p style={labelStyle}>Objectifs de la semaine</p>
        {objectifs.map((o, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', background: '#1C1C1C', borderRadius: '10px', padding: '10px', border: '1px solid #3A3A3A' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '13px', fontWeight: 500, color: '#F0F0F0' }}>{o.nom}</p>
              <div style={{ height: '5px', background: '#3A3A3A', borderRadius: '10px', marginTop: '5px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: o.couleur, borderRadius: '10px', width: `${Math.round((o.actuel / o.total) * 100)}%` }} />
              </div>
            </div>
            <span style={{ fontSize: '12px', color: '#F0F0F0', fontWeight: 500 }}>{o.actuel} / {o.total}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 18px 24px' }}>
        <p style={labelStyle}>Badges</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
          {badges.map((b, i) => (
            <div key={i} style={{ border: `1.5px solid ${b.gagne ? '#CA8A04' : '#3A3A3A'}`, borderRadius: '12px', padding: '12px', textAlign: 'center', background: b.gagne ? '#1A1200' : '#1C1C1C' }}>
              <div style={{ fontSize: '22px', marginBottom: '4px' }}>{b.icon}</div>
              <p style={{ fontSize: '12px', fontWeight: 500, color: b.gagne ? '#FCD34D' : '#A0A0A0' }}>{b.nom}</p>
              <p style={{ fontSize: '11px', color: '#A0A0A0', marginTop: '2px' }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
   {/* Section Suggestions */}
        <div style={{ padding: '0 18px 32px' }}>
          <p style={labelStyle}>Suggérer un mot</p>
          {suggestionEnvoyee ? (
            <div style={{ background: '#0A1F10', borderRadius: '12px', padding: '16px', border: '1px solid #16A34A', textAlign: 'center' }}>
              <p style={{ fontSize: '20px', marginBottom: '8px' }}>✓</p>
              <p style={{ fontSize: '14px', color: '#4ADE80', fontWeight: 500 }}>Suggestion envoyée !</p>
              <p style={{ fontSize: '12px', color: '#A0A0A0', marginTop: '4px' }}>Merci pour ta contribution.</p>
              <button onClick={() => { setSuggestion(''); setSuggestionEnvoyee(false) }} style={{ marginTop: '12px', background: 'none', border: 'none', color: '#A0A0A0', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>Suggérer un autre mot</button>
            </div>
          ) : (
            <div style={{ background: '#1C1C1C', borderRadius: '12px', padding: '16px', border: '1px solid #2A2A2A' }}>
              <p style={{ fontSize: '13px', color: '#A0A0A0', marginBottom: '12px', lineHeight: 1.5 }}>Tu connais un mot rare ou une expression que tu aimerais voir dans l'app ?</p>
              <textarea
                value={suggestion}
                onChange={e => setSuggestion(e.target.value)}
                placeholder="Ex : Schadenfreude — satisfaction éprouvée face au malheur d'autrui..."
                style={{ width: '100%', background: '#111', border: '1px solid #3A3A3A', borderRadius: '8px', padding: '10px', color: '#F0F0F0', fontSize: '13px', resize: 'none', height: '80px', fontFamily: 'inherit', outline: 'none', marginBottom: '10px' }}
              />
              <button
                onClick={async () => {
  if (!suggestion.trim()) return
  const { data: { user } } = await supabase.auth.getUser()
  await supabase.from('suggestions').insert({ mot: suggestion.trim(), user_id: user?.id })
  setSuggestionEnvoyee(true)
}}
                disabled={!suggestion.trim()}
                style={{ width: '100%', padding: '11px', borderRadius: '10px', border: 'none', background: suggestion.trim() ? '#F5C842' : '#2A2A2A', color: suggestion.trim() ? '#111' : '#555', fontSize: '14px', fontWeight: 600, cursor: suggestion.trim() ? 'pointer' : 'default' }}>
                Envoyer ma suggestion
              </button>
            </div>
          )}
        </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px',
  color: '#A0A0A0', marginBottom: '10px', fontWeight: 500,
}

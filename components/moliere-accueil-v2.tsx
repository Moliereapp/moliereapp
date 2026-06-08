import { useState, useEffect } from 'react'

type Exemple = { texte: string; contexte: string }
type MotJour = {
  mot: string
  nature: string
  theme: string
  type?: string
  definition: string
  etymologie: string
  exemples: Exemple[]
  quiz: { correct: string; wrongs: string[]; anecdote: string }
  date: string
}

type Props = {
  favoris: string[]
  motsUtilises: string[]
  onToggleFavori: (mot: string) => void
  onMarquerUtilise: (mot: string) => void
  onMotsCharges: (mots: MotJour[]) => void
}

const COULEURS_THEME: Record<string, string> = {
  'Littérature': '#2563EB',
  'Philosophie': '#7C3AED',
  'Sciences': '#059669',
  'Histoire': '#B45309',
  'Vie quotidienne': '#DB2777',
  'Art': '#EA580C',
  'Gastronomie': '#CA8A04',
  'Nature': '#16A34A',
  'Politique': '#DC2626',
  'Sport': '#0891B2',
  'Expression': '#6D28D9',
}

function CarteMotJour({ mot, estFavori, estUtilise, onToggleFavori, onMarquerUtilise, index, total, onPrev, onNext }: {
  mot: MotJour
  estFavori: boolean
  estUtilise: boolean
  onToggleFavori: () => void
  onMarquerUtilise: () => void
  index: number
  total: number
  onPrev: () => void
  onNext: () => void
}) {
  const couleur = COULEURS_THEME[mot.theme] || '#2563EB'
  const estExpression = mot.type === 'expression'

  return (
    <div style={{
      height: '100%', width: '100%',
      display: 'flex', flexDirection: 'column',
      background: '#111',
      animation: 'fadeIn 0.3s ease',
    }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* Header */}
      <div style={{ background: '#F5C842', padding: '0 18px 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '16px', marginBottom: '8px' }}>
          {estExpression && (
            <span style={{ background: '#6D28D9', color: '#EDE9FE', fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase' }}>
              Expression
            </span>
          )}
          <span style={{ background: '#111', color: '#F5C842', fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px' }}>
            {mot.theme}
          </span>
          {/* Indicateur de page */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '5px', alignItems: 'center' }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{
                width: i === index ? '16px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i === index ? '#111' : 'rgba(0,0,0,0.25)',
                transition: 'all 0.3s',
              }} />
            ))}
          </div>
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: estExpression ? '26px' : '36px', fontWeight: 700, color: '#111', lineHeight: 1.1, marginBottom: '4px' }}>
          {mot.mot}
        </h1>
        {!estExpression && (
          <p style={{ fontSize: '13px', color: '#E8402A', fontStyle: 'italic' }}>{mot.nature}</p>
        )}
      </div>

      {/* Corps scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', background: '#111' }}>
        <p style={labelStyle}>Définition</p>
        <div style={{ background: '#1C1C1C', borderRadius: '12px', padding: '14px', fontSize: '14px', lineHeight: 1.6, color: '#F0F0F0', borderLeft: `4px solid ${couleur}` }}>
          {mot.definition}
          <p style={{ fontSize: '12px', color: '#A0A0A0', marginTop: '8px', fontStyle: 'italic' }}>{mot.etymologie}</p>
        </div>

        <p style={labelStyle}>Exemples</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {mot.exemples.map((ex, i) => (
            <div key={i} style={{ background: '#1C1C1C', borderRadius: '10px', padding: '12px', fontSize: '13px', lineHeight: 1.5, color: '#F0F0F0', fontStyle: 'italic', borderLeft: `3px solid ${couleur}` }}>
              « {ex.texte} »
              <p style={{ fontSize: '11px', color: '#60A5FA', marginTop: '4px', fontStyle: 'normal', fontWeight: 500 }}>{ex.contexte}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '16px' }}>
          <button onClick={onToggleFavori}
            style={{ padding: '11px', borderRadius: '10px', border: estFavori ? '1.5px solid #E8402A' : '1.5px solid #3A3A3A', background: estFavori ? '#2D0A0A' : '#1C1C1C', fontSize: '13px', fontWeight: 500, color: estFavori ? '#FCA5A5' : '#F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
            ♥ {estFavori ? 'Sauvegardé' : 'Favori'}
          </button>
          <button style={{ padding: '11px', borderRadius: '10px', border: '2px solid #F5C842', background: '#F5C842', color: '#111', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
            ↑ Partager
          </button>
        </div>

        <button onClick={onMarquerUtilise} disabled={estUtilise}
          style={{ width: '100%', marginTop: '8px', padding: '11px', borderRadius: '10px', border: estUtilise ? '2px solid #16A34A' : '2px dashed #16A34A', background: estUtilise ? '#16A34A' : '#0A1F10', color: estUtilise ? '#111' : '#4ADE80', fontSize: '13px', fontWeight: 500, cursor: estUtilise ? 'default' : 'pointer' }}>
          {estUtilise ? '✓ Utilisé aujourd\'hui !' : '✓ Je l\'ai utilisé aujourd\'hui !'}
        </button>
      </div>

      {/* Navigation bas */}
      <div style={{ display: 'flex', gap: '10px', padding: '12px 18px', background: '#111', borderTop: '1px solid #2A2A2A', flexShrink: 0 }}>
        <button onClick={onPrev} disabled={index === 0}
          style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #3A3A3A', background: index === 0 ? '#1A1A1A' : '#1C1C1C', color: index === 0 ? '#444' : '#F0F0F0', fontSize: '14px', cursor: index === 0 ? 'default' : 'pointer', fontWeight: 500 }}>
          ← Précédent
        </button>
        <button onClick={onNext} disabled={index === total - 1}
          style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: index === total - 1 ? '#1A1A1A' : '#F5C842', color: index === total - 1 ? '#444' : '#111', fontSize: '14px', cursor: index === total - 1 ? 'default' : 'pointer', fontWeight: 500 }}>
          Suivant →
        </button>
      </div>
    </div>
  )
}

export default function ScreenAccueilV2({ favoris, motsUtilises, onToggleFavori, onMarquerUtilise, onMotsCharges }: Props) {
  const [mots, setMots] = useState<MotJour[]>([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [erreur, setErreur] = useState(false)

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const cache = localStorage.getItem(`mots_${today}`)

    if (cache) {
      try {
        const cached = JSON.parse(cache)
        setMots(cached)
        onMotsCharges(cached)
        setLoading(false)
        return
      } catch {}
    }

    fetch('/api/mots-du-jour')
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        const liste = Array.isArray(data) ? data : [data]
        localStorage.setItem(`mots_${today}`, JSON.stringify(liste))
        setMots(liste)
        onMotsCharges(liste)
        setLoading(false)
      })
      .catch(() => { setErreur(true); setLoading(false) })
  }, [])

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#111', gap: '16px' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #333', borderTop: '3px solid #F5C842', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: '#A0A0A0', fontSize: '14px' }}>Chargement des mots du jour…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (erreur || mots.length === 0) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#111', gap: '12px', padding: '20px' }}>
      <p style={{ color: '#F0F0F0', fontSize: '18px', fontFamily: 'Georgia, serif' }}>Oups !</p>
      <p style={{ color: '#A0A0A0', fontSize: '14px', textAlign: 'center' }}>Impossible de charger les mots du jour.</p>
      <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', background: '#F5C842', color: '#111', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
        Réessayer
      </button>
    </div>
  )

  const mot = mots[index]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <CarteMotJour
        mot={mot}
        estFavori={favoris.includes(mot.mot)}
        estUtilise={motsUtilises.includes(mot.mot)}
        onToggleFavori={() => onToggleFavori(mot.mot)}
        onMarquerUtilise={() => onMarquerUtilise(mot.mot)}
        index={index}
        total={mots.length}
        onPrev={() => setIndex(i => Math.max(0, i - 1))}
        onNext={() => setIndex(i => Math.min(mots.length - 1, i + 1))}
      />
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px',
  color: '#A0A0A0', marginBottom: '8px', marginTop: '16px', fontWeight: 500,
}

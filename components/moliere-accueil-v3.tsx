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

export default function ScreenAccueilV2({ favoris, motsUtilises, onToggleFavori, onMarquerUtilise, onMotsCharges }: Props) {
  const [mots, setMots] = useState<MotJour[]>([])
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<'up' | 'down' | null>(null)
  const [animating, setAnimating] = useState(false)
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

  function navigate(dir: 'up' | 'down') {
    if (animating) return
    if (dir === 'down' && index >= mots.length - 1) return
    if (dir === 'up' && index <= 0) return
    setDirection(dir)
    setAnimating(true)
    setTimeout(() => {
      setIndex(i => dir === 'down' ? i + 1 : i - 1)
      setDirection(null)
      setAnimating(false)
    }, 280)
  }

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
  const couleur = COULEURS_THEME[mot.theme] || '#2563EB'
  const estExpression = mot.type === 'expression'

  const slideStyle: React.CSSProperties = {
    transition: animating ? 'transform 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.28s' : 'none',
    transform: animating
      ? direction === 'down' ? 'translateY(-40px)' : 'translateY(40px)'
      : 'translateY(0)',
    opacity: animating ? 0 : 1,
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#111' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      {/* Dots indicateurs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', padding: '10px 0 6px', background: '#111' }}>
        {mots.map((_, i) => (
          <div key={i} onClick={() => { if (!animating) { setDirection(i > index ? 'down' : 'up'); setIndex(i) } }}
            style={{ width: i === index ? '20px' : '7px', height: '7px', borderRadius: '4px', background: i === index ? '#F5C842' : '#333', transition: 'all 0.3s', cursor: 'pointer' }} />
        ))}
      </div>

      {/* Carte principale */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div style={{ ...slideStyle, height: '100%', display: 'flex', flexDirection: 'column' }}>

          {/* Header jaune */}
          <div style={{ background: '#F5C842', padding: '12px 18px 18px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              {estExpression && (
                <span style={{ background: '#6D28D9', color: '#EDE9FE', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase' }}>
                  Expression
                </span>
              )}
              <span style={{ background: '#111', color: '#F5C842', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>
                {mot.theme}
              </span>
              <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'rgba(0,0,0,0.4)', fontWeight: 500 }}>
                {index + 1} / {mots.length}
              </span>
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: estExpression ? '24px' : '34px', fontWeight: 700, color: '#111', lineHeight: 1.1, marginBottom: '3px' }}>
              {mot.mot}
            </h1>
            {!estExpression && (
              <p style={{ fontSize: '12px', color: '#E8402A', fontStyle: 'italic' }}>{mot.nature}</p>
            )}
          </div>

          {/* Corps */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px' }}>
            <p style={labelStyle}>Définition</p>
            <div style={{ background: '#1C1C1C', borderRadius: '12px', padding: '13px', fontSize: '14px', lineHeight: 1.6, color: '#F0F0F0', borderLeft: `4px solid ${couleur}` }}>
              {mot.definition}
              
              <p style={{ fontSize: '12px', color: '#A0A0A0', marginTop: '6px', fontStyle: 'italic' }}>{mot.etymologie}</p>
            </div>
{mot.synonymes && mot.synonymes.length > 0 && (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px', marginBottom: '4px' }}>
    <span style={{ fontSize: '11px', color: '#A0A0A0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', alignSelf: 'center' }}>Synonymes :</span>
    {mot.synonymes.map((s: string, i: number) => (
      <span key={i} style={{ background: '#272727', color: '#C0C0C0', fontSize: '12px', padding: '3px 10px', borderRadius: '20px', border: '1px solid #3A3A3A' }}>{s}</span>
    ))}
  </div>
)}
            <p style={labelStyle}>Exemples</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {mot.exemples.map((ex, i) => (
                <div key={i} style={{ background: '#1C1C1C', borderRadius: '10px', padding: '11px', fontSize: '13px', lineHeight: 1.5, color: '#F0F0F0', fontStyle: 'italic', borderLeft: `3px solid ${couleur}` }}>
                  « {ex.texte} »
                  <p style={{ fontSize: '11px', color: '#60A5FA', marginTop: '3px', fontStyle: 'normal', fontWeight: 500 }}>{ex.contexte}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '14px' }}>
              <button onClick={() => onToggleFavori(mot.mot)}
                style={{ padding: '10px', borderRadius: '10px', border: favoris.includes(mot.mot) ? '1.5px solid #E8402A' : '1.5px solid #3A3A3A', background: favoris.includes(mot.mot) ? '#2D0A0A' : '#1C1C1C', fontSize: '13px', fontWeight: 500, color: favoris.includes(mot.mot) ? '#FCA5A5' : '#F0F0F0', cursor: 'pointer' }}>
                ♥ {favoris.includes(mot.mot) ? 'Sauvegardé' : 'Favori'}
              </button>
              <button style={{ padding: '10px', borderRadius: '10px', border: '2px solid #F5C842', background: '#F5C842', color: '#111', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                ↑ Partager
              </button>
            </div>

            <button onClick={() => onMarquerUtilise(mot.mot)} disabled={motsUtilises.includes(mot.mot)}
              style={{ width: '100%', marginTop: '8px', marginBottom: '4px', padding: '10px', borderRadius: '10px', border: motsUtilises.includes(mot.mot) ? '2px solid #16A34A' : '2px dashed #16A34A', background: motsUtilises.includes(mot.mot) ? '#16A34A' : '#0A1F10', color: motsUtilises.includes(mot.mot) ? '#111' : '#4ADE80', fontSize: '13px', fontWeight: 500, cursor: motsUtilises.includes(mot.mot) ? 'default' : 'pointer' }}>
              {motsUtilises.includes(mot.mot) ? '✓ Utilisé aujourd\'hui !' : '✓ Je l\'ai utilisé aujourd\'hui !'}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px 14px', background: '#111', borderTop: '1px solid #222', flexShrink: 0 }}>
        <button onClick={() => navigate('up')} disabled={index === 0 || animating}
          style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1.5px solid', borderColor: index === 0 ? '#222' : '#3A3A3A', background: index === 0 ? '#1A1A1A' : '#1C1C1C', color: index === 0 ? '#333' : '#F0F0F0', fontSize: '18px', cursor: index === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          ↑
        </button>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#A0A0A0', fontSize: '11px', marginBottom: '2px' }}>Mot {index + 1} sur {mots.length}</p>
          <p style={{ color: '#F5C842', fontSize: '12px', fontWeight: 500 }}>{mot.theme}</p>
        </div>

        <button onClick={() => navigate('down')} disabled={index === mots.length - 1 || animating}
          style={{ width: '44px', height: '44px', borderRadius: '50%', border: 'none', background: index === mots.length - 1 ? '#1A1A1A' : '#F5C842', color: index === mots.length - 1 ? '#333' : '#111', fontSize: '18px', cursor: index === mots.length - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          ↓
        </button>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px',
  color: '#A0A0A0', marginBottom: '7px', marginTop: '14px', fontWeight: 500,
}

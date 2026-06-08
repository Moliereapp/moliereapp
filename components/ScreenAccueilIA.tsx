import { useState, useEffect } from 'react'

type Exemple = { texte: string; contexte: string }
type MotIA = {
  mot: string
  nature: string
  theme: string
  definition: string
  etymologie: string
  exemples: Exemple[]
  quiz: { correct: string; wrongs: string[]; anecdote: string }
  date: string
}

type Props = {
  favoris: string[]
  motUtilise: boolean
  onToggleFavori: (mot: string) => void
  onMarquerUtilise: () => void
  onMotCharge: (mot: MotIA) => void
}

export default function ScreenAccueil({ favoris, motUtilise, onToggleFavori, onMarquerUtilise, onMotCharge }: Props) {
  const [mot, setMot] = useState<MotIA | null>(null)
  const [loading, setLoading] = useState(true)
  const [erreur, setErreur] = useState(false)

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const cache = localStorage.getItem(`mot_${today}`)

    if (cache) {
      const motCache = JSON.parse(cache)
      setMot(motCache)
      onMotCharge(motCache)
      setLoading(false)
      return
    }

    fetch('/api/mot-du-jour')
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        localStorage.setItem(`mot_${today}`, JSON.stringify(data))
        setMot(data)
        onMotCharge(data)
        setLoading(false)
      })
      .catch(() => {
        setErreur(true)
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#111', gap: '16px' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #333', borderTop: '3px solid #F5C842', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: '#A0A0A0', fontSize: '14px' }}>Génération du mot du jour…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (erreur || !mot) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#111', gap: '12px', padding: '20px' }}>
      <p style={{ color: '#F0F0F0', fontSize: '18px', fontFamily: 'Georgia, serif' }}>Oups !</p>
      <p style={{ color: '#A0A0A0', fontSize: '14px', textAlign: 'center' }}>Impossible de charger le mot du jour. Vérifie ta connexion et réessaie.</p>
      <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', background: '#F5C842', color: '#111', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
        Réessayer
      </button>
    </div>
  )

  const estFavori = favoris.includes(mot.mot)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ background: '#F5C842', padding: '0 18px 20px' }}>
        <p style={{ fontSize: '11px', color: '#111', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', paddingTop: '16px' }}>
          Mot du jour
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '38px', fontWeight: 700, color: '#111', lineHeight: 1.1, marginBottom: '4px' }}>
          {mot.mot}
        </h1>
        <p style={{ fontSize: '13px', color: '#E8402A', fontStyle: 'italic', marginBottom: '12px' }}>{mot.nature}</p>
        <span style={{ display: 'inline-block', background: '#111', color: '#F5C842', fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>
          {mot.theme}
        </span>
      </div>

      <div style={{ padding: '16px 18px', flex: 1, overflowY: 'auto', background: '#111' }}>
        <p style={labelStyle}>Définition</p>
        <div style={{ background: '#1C1C1C', borderRadius: '12px', padding: '14px', fontSize: '14px', lineHeight: 1.6, color: '#F0F0F0', borderLeft: '4px solid #F5C842' }}>
          {mot.definition}
          <p style={{ fontSize: '12px', color: '#A0A0A0', marginTop: '8px', fontStyle: 'italic' }}>{mot.etymologie}</p>
        </div>

        <p style={labelStyle}>Exemples d'utilisation</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {mot.exemples.map((ex, i) => (
            <div key={i} style={{ background: '#1C1C1C', borderRadius: '10px', padding: '12px', fontSize: '13px', lineHeight: 1.5, color: '#F0F0F0', fontStyle: 'italic', borderLeft: '3px solid #2563EB' }}>
              « {ex.texte} »
              <p style={{ fontSize: '11px', color: '#60A5FA', marginTop: '4px', fontStyle: 'normal', fontWeight: 500 }}>{ex.contexte}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '16px' }}>
          <button onClick={() => onToggleFavori(mot.mot)}
            style={{ padding: '11px', borderRadius: '10px', border: estFavori ? '1.5px solid #E8402A' : '1.5px solid #3A3A3A', background: estFavori ? '#2D0A0A' : '#1C1C1C', fontSize: '13px', fontWeight: 500, color: estFavori ? '#FCA5A5' : '#F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            ♥ {estFavori ? 'Sauvegardé' : 'Favori'}
          </button>
          <button style={{ padding: '11px', borderRadius: '10px', border: '2px solid #F5C842', background: '#F5C842', color: '#111', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            ↑ Partager
          </button>
        </div>

        <button onClick={onMarquerUtilise} disabled={motUtilise}
          style={{ width: '100%', marginTop: '8px', padding: '11px', borderRadius: '10px', border: motUtilise ? '2px solid #16A34A' : '2px dashed #16A34A', background: motUtilise ? '#16A34A' : '#0A1F10', color: motUtilise ? '#111' : '#4ADE80', fontSize: '13px', fontWeight: 500, cursor: motUtilise ? 'default' : 'pointer' }}>
          {motUtilise ? '✓ Mot utilisé aujourd\'hui !' : '✓ Je l\'ai utilisé aujourd\'hui !'}
        </button>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px',
  color: '#A0A0A0', marginBottom: '8px', marginTop: '16px', fontWeight: 500,
}

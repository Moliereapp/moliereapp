import { useState, useEffect } from 'react'

type Mot = {
  mot: string
  nature?: string
  theme: string
  type?: string
  niveau?: string
  definition: string
  etymologie: string
  synonymes?: string[]
  antonymes?: string[]
  citation?: { texte: string; auteur: string } | null
  exemples: { texte: string; contexte: string }[]
  quiz: { correct: string; wrongs: string[]; anecdote: string }
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
}

const TOUTES_CATEGORIES = ['Littérature', 'Philosophie', 'Sciences', 'Histoire', 'Vie quotidienne', 'Art', 'Gastronomie', 'Nature', 'Politique', 'Sport']

const EMOJIS_THEME: Record<string, string> = {
  'Littérature': '📖',
  'Philosophie': '🧠',
  'Sciences': '🔬',
  'Histoire': '🏛️',
  'Vie quotidienne': '☀️',
  'Art': '🎨',
  'Gastronomie': '🍷',
  'Nature': '🌿',
  'Politique': '⚖️',
  'Sport': '🏆',
}

function ModalMot({ mot, onClose }: { mot: Mot; onClose: () => void }) {
  const couleur = COULEURS_THEME[mot.theme] || '#2563EB'
  const estExpression = mot.type === 'expression'

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#111', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: '420px', maxHeight: '85vh', overflowY: 'auto', border: '1px solid #2A2A2A', borderBottom: 'none' }}>

        {/* Header */}
        <div style={{ background: '#F5C842', padding: '16px 18px 18px', borderRadius: '20px 20px 0 0', position: 'relative' }}>
          <button onClick={onClose}
            style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(0,0,0,0.15)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '16px', color: '#111' }}>
            ✕
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            {estExpression && (
              <span style={{ background: '#6D28D9', color: '#EDE9FE', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>Expression</span>
            )}
            <span style={{ background: '#111', color: '#F5C842', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>
              {mot.theme}
            </span>
            {mot.niveau && (
              <span style={{ background: 'rgba(0,0,0,0.15)', color: '#111', fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px' }}>
                {mot.niveau}
              </span>
            )}
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: estExpression ? '22px' : '30px', fontWeight: 700, color: '#111', lineHeight: 1.1, marginBottom: estExpression ? '0' : '3px' }}>
            {mot.mot}
          </h2>
          {!estExpression && mot.nature && (
            <p style={{ fontSize: '12px', color: '#E8402A', fontStyle: 'italic' }}>{mot.nature}</p>
          )}
        </div>

        {/* Corps */}
        <div style={{ padding: '14px 18px 24px' }}>
          {/* Définition */}
          <p style={labelStyle}>Définition</p>
          <div style={{ background: '#1C1C1C', borderRadius: '12px', padding: '13px', fontSize: '14px', lineHeight: 1.6, color: '#F0F0F0', borderLeft: `4px solid ${couleur}`, marginBottom: '4px' }}>
            {mot.definition}
            <p style={{ fontSize: '12px', color: '#A0A0A0', marginTop: '6px', fontStyle: 'italic' }}>{mot.etymologie}</p>
          </div>

          {/* Synonymes */}
          {mot.synonymes && mot.synonymes.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
              <span style={{ fontSize: '11px', color: '#A0A0A0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', alignSelf: 'center' }}>Synonymes :</span>
              {mot.synonymes.map((s, i) => (
                <span key={i} style={{ background: '#272727', color: '#C0C0C0', fontSize: '12px', padding: '3px 10px', borderRadius: '20px', border: '1px solid #3A3A3A' }}>{s}</span>
              ))}
            </div>
          )}

          {/* Antonymes */}
          {mot.antonymes && mot.antonymes.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', color: '#A0A0A0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', alignSelf: 'center' }}>Antonymes :</span>
              {mot.antonymes.map((a, i) => (
                <span key={i} style={{ background: '#2D0A0A', color: '#FCA5A5', fontSize: '12px', padding: '3px 10px', borderRadius: '20px', border: '1px solid #7F1D1D' }}>{a}</span>
              ))}
            </div>
          )}

          {/* Citation */}
          {mot.citation && (
            <div style={{ background: '#1A1200', borderRadius: '10px', padding: '12px 14px', marginTop: '10px', borderLeft: '3px solid #F5C842' }}>
              <p style={{ fontSize: '13px', color: '#F0F0F0', fontStyle: 'italic', lineHeight: 1.5 }}>« {mot.citation.texte} »</p>
              <p style={{ fontSize: '11px', color: '#CA8A04', marginTop: '5px', fontWeight: 500 }}>— {mot.citation.auteur}</p>
            </div>
          )}

          {/* Exemples */}
          <p style={{ ...labelStyle, marginTop: '14px' }}>Exemples</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {mot.exemples.map((ex, i) => (
              <div key={i} style={{ background: '#1C1C1C', borderRadius: '10px', padding: '11px', fontSize: '13px', lineHeight: 1.5, color: '#F0F0F0', fontStyle: 'italic', borderLeft: `3px solid ${couleur}` }}>
                « {ex.texte} »
                <p style={{ fontSize: '11px', color: '#60A5FA', marginTop: '3px', fontStyle: 'normal', fontWeight: 500 }}>{ex.contexte}</p>
              </div>
            ))}
          </div>

          {/* Anecdote quiz */}
          {mot.quiz.anecdote && (
            <div style={{ background: '#1C1C1C', borderRadius: '10px', padding: '11px 14px', marginTop: '12px', border: '1px solid #3A3A3A' }}>
              <p style={{ fontSize: '11px', color: '#F5C842', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Le saviez-vous ?</p>
              <p style={{ fontSize: '13px', color: '#C0C0C0', lineHeight: 1.5 }}>{mot.quiz.anecdote}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ScreenPeleMele() {
  const [mots, setMots] = useState<Mot[]>([])
  const [loading, setLoading] = useState(true)
  const [recherche, setRecherche] = useState('')
  const [categorieActive, setCategorieActive] = useState<string>('Tous')
  const [typeActif, setTypeActif] = useState<'tous' | 'mots' | 'expressions'>('tous')
  const [motSelectionne, setMotSelectionne] = useState<Mot | null>(null)

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const cacheKey = `pelemele_${today}`

    // Cache dédié au pêle-mêle, valable toute la journée
    try {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        setMots(JSON.parse(cached))
        setLoading(false)
        return
      }
    } catch {}

    // 7 appels API avec des catégories décalées pour obtenir ~21 mots uniques
    // On prend 3 mots par appel × 7 appels = 21 candidats, on déduplique et on garde 20
    const niveau = (localStorage.getItem('niveau_choisi') || 'intermediaire').replace(/"/g, '')
    const cats = localStorage.getItem('categories_choisies')
    const categoriesBase: string[] = cats ? JSON.parse(cats) : TOUTES_CATEGORIES
    const pool = categoriesBase.length >= 3 ? categoriesBase : TOUTES_CATEGORIES

    // Décaler le seed de 1 à 7 jours pour obtenir des combinaisons différentes du mot du jour
    const promesses = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (i + 1))
      const dateDecalee = d.toISOString().split('T')[0]
      const params = new URLSearchParams()
      if (cats) params.set('categories', cats)
      params.set('niveau', niveau)
      params.set('date', dateDecalee)
      return fetch(`/api/mots-du-jour?${params.toString()}`)
        .then(r => r.json())
        .catch(() => [])
    })

    Promise.all(promesses).then(resultats => {
      const vus = new Set<string>()
      const liste: Mot[] = []

      resultats.forEach((batch: Mot[]) => {
        if (!Array.isArray(batch)) return
        batch.forEach(m => {
          if (!vus.has(m.mot) && liste.length < 20) {
            vus.add(m.mot)
            liste.push(m)
          }
        })
      })

      // Trier aléatoirement mais de façon déterministe pour la journée
      const seed = parseInt(today.replace(/-/g, '')) % 1000
      const shuffled = [...liste].sort((a, b) =>
        (Math.sin(seed + a.mot.length) - Math.sin(seed + b.mot.length))
      )

      try { localStorage.setItem(cacheKey, JSON.stringify(shuffled)) } catch {}
      setMots(shuffled)
      setLoading(false)
    })
  }, [])

  const motsFiltres = mots.filter(m => {
    const matchCat = categorieActive === 'Tous' || m.theme === categorieActive
    const matchType = typeActif === 'tous' || (typeActif === 'expressions' ? m.type === 'expression' : m.type !== 'expression')
    const matchRecherche = m.mot.toLowerCase().includes(recherche.toLowerCase()) || m.definition.toLowerCase().includes(recherche.toLowerCase())
    return matchCat && matchType && matchRecherche
  })

  const categories = ['Tous', ...TOUTES_CATEGORIES]

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#111', gap: '16px' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #333', borderTop: '3px solid #F5C842', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: '#A0A0A0', fontSize: '14px' }}>Chargement des mots…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', background: '#111' }}>

      {/* Header */}
      <div style={{ background: '#F5C842', padding: '14px 18px 16px', flexShrink: 0 }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 700, color: '#111', marginBottom: '4px' }}>
          Pêle-mêle
        </h2>
        <p style={{ fontSize: '13px', color: '#555' }}>
          {motsFiltres.length} mot{motsFiltres.length > 1 ? 's' : ''} à explorer librement
        </p>
      </div>

      {/* Recherche */}
      <div style={{ padding: '10px 18px 0', background: '#111', flexShrink: 0 }}>
        <input
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          placeholder="🔍 Rechercher un mot ou une expression…"
          style={{ width: '100%', background: '#1C1C1C', border: '1px solid #3A3A3A', borderRadius: '10px', padding: '10px 14px', color: '#F0F0F0', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
        />
      </div>

      {/* Filtre mots / expressions */}
      <div style={{ display: 'flex', gap: '8px', padding: '10px 18px 0', flexShrink: 0 }}>
        {([['tous', 'Tous'], ['mots', 'Mots'], ['expressions', 'Expressions']] as const).map(([val, label]) => (
          <button key={val} onClick={() => setTypeActif(val)}
            style={{ padding: '5px 14px', borderRadius: '20px', border: '1.5px solid', borderColor: typeActif === val ? '#F5C842' : '#3A3A3A', background: typeActif === val ? '#F5C842' : '#1C1C1C', color: typeActif === val ? '#111' : '#F0F0F0', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Filtre catégories (scroll horizontal) */}
      <div style={{ display: 'flex', gap: '8px', padding: '8px 18px', overflowX: 'auto', flexShrink: 0, scrollbarWidth: 'none' }}>
        <style>{`.cats-scroll::-webkit-scrollbar { display: none }`}</style>
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategorieActive(cat)}
            style={{ padding: '5px 12px', borderRadius: '20px', border: '1.5px solid', borderColor: categorieActive === cat ? '#F5C842' : '#3A3A3A', background: categorieActive === cat ? '#F5C842' : '#1C1C1C', color: categorieActive === cat ? '#111' : '#F0F0F0', fontSize: '12px', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {cat === 'Tous' ? 'Tous' : `${EMOJIS_THEME[cat] || ''} ${cat}`}
          </button>
        ))}
      </div>

      {/* Grille de mots */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 18px 16px' }}>
        {motsFiltres.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</p>
            <p style={{ color: '#F0F0F0', fontSize: '16px', fontFamily: 'Georgia, serif', marginBottom: '6px' }}>Aucun résultat</p>
            <p style={{ color: '#A0A0A0', fontSize: '13px' }}>Essaie un autre terme ou une autre catégorie</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '8px' }}>
            {motsFiltres.map((m, i) => {
              const couleur = COULEURS_THEME[m.theme] || '#2563EB'
              const estExpression = m.type === 'expression'
              return (
                <button key={i} onClick={() => setMotSelectionne(m)}
                  style={{ padding: '8px 14px', borderRadius: '20px', border: `1.5px solid ${couleur}33`, background: couleur + '15', color: '#F0F0F0', fontSize: '13px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', maxWidth: '100%' }}>
                  {estExpression && <span style={{ fontSize: '10px', background: '#6D28D9', color: '#EDE9FE', padding: '1px 6px', borderRadius: '10px', fontWeight: 700, flexShrink: 0 }}>expr</span>}
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.mot}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal mot sélectionné */}
      {motSelectionne && (
        <ModalMot mot={motSelectionne} onClose={() => setMotSelectionne(null)} />
      )}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px',
  color: '#A0A0A0', marginBottom: '7px', fontWeight: 500,
}

import { useState, useEffect, useRef } from 'react'

type Exemple = { texte: string; contexte: string }
type MotJour = {
  mot: string
  nature: string
  theme: string
  type?: string
  synonymes?: string[]
  antonymes?: string[]
  citation?: { texte: string; auteur: string } | null
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

// Couleurs bulles par thème — douces et translucides sur fond sépia
const COULEURS_BULLE: Record<string, { R: number; G: number; B: number; dark: string }> = {
  'Littérature':     { R: 160, G: 90,  B: 28,  dark: '#2A1200' },
  'Philosophie':     { R: 88,  G: 54,  B: 192, dark: '#0E0520' },
  'Sciences':        { R: 15,  G: 118, B: 82,  dark: '#021810' },
  'Histoire':        { R: 140, G: 70,  B: 20,  dark: '#251000' },
  'Vie quotidienne': { R: 180, G: 60,  B: 100, dark: '#2A0518' },
  'Art':             { R: 200, G: 80,  B: 30,  dark: '#2A1000' },
  'Gastronomie':     { R: 170, G: 120, B: 20,  dark: '#281800' },
  'Nature':          { R: 40,  G: 130, B: 60,  dark: '#021A08' },
  'Politique':       { R: 150, G: 30,  B: 30,  dark: '#220505' },
  'Sport':           { R: 20,  G: 100, B: 160, dark: '#021520' },
  'Expression':      { R: 100, G: 50,  B: 180, dark: '#100520' },
}

const FLOAT_ANIMS = [
  { name: 'f0', kf: `@keyframes f0{0%,100%{transform:translate(0,0)}20%{transform:translate(5px,-9px)}45%{transform:translate(-5px,4px)}70%{transform:translate(7px,6px)}}`, dur: '10s' },
  { name: 'f1', kf: `@keyframes f1{0%,100%{transform:translate(0,0)}25%{transform:translate(-8px,7px)}50%{transform:translate(4px,-5px)}75%{transform:translate(-4px,9px)}}`, dur: '12s' },
  { name: 'f2', kf: `@keyframes f2{0%,100%{transform:translate(0,0)}30%{transform:translate(6px,8px)}55%{transform:translate(-7px,-4px)}80%{transform:translate(5px,-8px)}}`, dur: '11s' },
]

// Fiche détail d'un mot
function FicheMot({ mot, couleur, favoris, motsUtilises, onToggleFavori, onMarquerUtilise, onClose, originX, originY }: {
  mot: MotJour
  couleur: { R: number; G: number; B: number; dark: string }
  favoris: string[]
  motsUtilises: string[]
  onToggleFavori: (m: string) => void
  onMarquerUtilise: (m: string) => void
  onClose: () => void
  originX: number
  originY: number
}) {
  const [visible, setVisible] = useState(false)
  const [bgOpen, setBgOpen] = useState(false)
  const { R, G, B, dark } = couleur
  const rgb = `rgb(${R},${G},${B})`
  const estExpression = mot.type === 'expression'

  useEffect(() => {
    setTimeout(() => setBgOpen(true), 50)
    setTimeout(() => setVisible(true), 1500)
  }, [])

  function fermer() {
    setVisible(false)
    setBgOpen(false)
    setTimeout(onClose, 600)
  }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50, overflow: 'hidden' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
      {/* Fond qui s'ouvre depuis la bulle */}
      <div style={{
        position: 'absolute', inset: 0,
        background: dark,
        clipPath: bgOpen ? `circle(1000px at ${originX}px ${originY}px)` : `circle(0px at ${originX}px ${originY}px)`,
        transition: 'clip-path 1.4s cubic-bezier(0.16,1,0.3,1)',
      }} />

      {/* Contenu */}
      <div style={{
        position: 'relative', zIndex: 1,
        padding: '22px 18px 16px',
        height: '100%', overflowY: 'auto',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.6s ease',
        display: 'flex', flexDirection: 'column', gap: 0,
      }}>
        <button onClick={fermer} style={{
          background: 'none', border: 'none',
          color: `rgba(${R},${G},${B},0.7)`,
          fontSize: '11px', letterSpacing: '1px',
          cursor: 'pointer', textAlign: 'left', padding: 0,
          marginBottom: '18px', fontFamily: 'var(--font-body)',
        }}>← retour</button>

        <div style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: rgb, opacity: 0.6, marginBottom: '7px' }}>{mot.theme}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: estExpression ? '22px' : '28px', fontWeight: 600, color: rgb, lineHeight: 1.1, marginBottom: '2px' }}>{mot.mot}</div>
        {!estExpression && <div style={{ fontSize: '11px', fontStyle: 'italic', color: `rgba(${R},${G},${B},0.55)`, marginBottom: '15px' }}>{mot.nature}</div>}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '14px' }} />

        {/* Définition */}
        <div style={{ fontSize: '12px', lineHeight: 1.78, color: 'rgba(255,255,255,0.84)', marginBottom: '8px' }}>{mot.definition}</div>
        <div style={{ fontSize: '10px', fontStyle: 'italic', color: 'rgba(255,255,255,0.35)', marginBottom: '14px' }}>{mot.etymologie}</div>

        {/* Citation */}
        {mot.citation && (
          <div style={{ borderLeft: `2px solid rgba(${R},${G},${B},0.35)`, paddingLeft: '10px', marginBottom: '14px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontStyle: 'italic', lineHeight: 1.65, color: 'rgba(255,255,255,0.7)' }}>« {mot.citation.texte} »</div>
            <div style={{ fontSize: '10px', marginTop: '3px', color: `rgba(${R},${G},${B},0.6)` }}>— {mot.citation.auteur}</div>
          </div>
        )}

        {/* Synonymes */}
        {mot.synonymes && mot.synonymes.length > 0 && (
          <>
            <div style={{ fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '6px' }}>Synonymes</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
              {mot.synonymes.map((s, i) => (
                <span key={i} style={{ background: `rgba(${R},${G},${B},0.12)`, color: rgb, fontSize: '10px', padding: '3px 10px', borderRadius: '20px', border: `1px solid rgba(${R},${G},${B},0.28)` }}>{s}</span>
              ))}
            </div>
          </>
        )}

        {/* Antonymes */}
        {mot.antonymes && mot.antonymes.length > 0 && (
          <>
            <div style={{ fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '6px' }}>Antonymes</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
              {mot.antonymes.map((a, i) => (
                <span key={i} style={{ background: 'rgba(200,80,60,0.12)', color: 'rgba(255,160,140,0.85)', fontSize: '10px', padding: '3px 10px', borderRadius: '20px', border: '1px solid rgba(200,80,60,0.25)' }}>{a}</span>
              ))}
            </div>
          </>
        )}

        {/* Exemples */}
        {mot.exemples && mot.exemples.length > 0 && (
          <>
            <div style={{ fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '6px' }}>Exemples</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '14px' }}>
              {mot.exemples.map((ex, i) => (
                <div key={i} style={{ background: `rgba(${R},${G},${B},0.07)`, borderRadius: '8px', padding: '10px', borderLeft: `2px solid rgba(${R},${G},${B},0.3)`, fontSize: '12px', fontStyle: 'italic', color: 'rgba(255,255,255,0.72)', lineHeight: 1.55 }}>
                  « {ex.texte} »
                  <div style={{ fontSize: '10px', fontStyle: 'normal', color: `rgba(${R},${G},${B},0.55)`, marginTop: '3px' }}>{ex.contexte}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Anecdote */}
        {mot.quiz?.anecdote && (
          <div style={{ background: `rgba(${R},${G},${B},0.09)`, borderRadius: '8px', padding: '10px 12px', fontSize: '11px', lineHeight: 1.6, color: 'rgba(255,255,255,0.52)', marginBottom: '14px' }}>
            ✦ {mot.quiz.anecdote}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
          <button onClick={() => onToggleFavori(mot.mot)} style={{
            padding: '10px', borderRadius: '10px',
            border: favoris.includes(mot.mot) ? `1.5px solid rgba(${R},${G},${B},0.6)` : '1.5px solid rgba(255,255,255,0.12)',
            background: favoris.includes(mot.mot) ? `rgba(${R},${G},${B},0.18)` : 'rgba(255,255,255,0.05)',
            fontSize: '13px', fontWeight: 500,
            color: favoris.includes(mot.mot) ? rgb : 'rgba(255,255,255,0.6)',
            cursor: 'pointer',
          }}>
            ♥ {favoris.includes(mot.mot) ? 'Sauvegardé' : 'Favori'}
          </button>
          <button style={{ padding: '10px', borderRadius: '10px', border: `1.5px solid rgba(${R},${G},${B},0.5)`, background: `rgba(${R},${G},${B},0.15)`, color: rgb, fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
            ↑ Partager
          </button>
        </div>
        <button onClick={() => onMarquerUtilise(mot.mot)} disabled={motsUtilises.includes(mot.mot)} style={{
          width: '100%', marginTop: '8px', marginBottom: '16px',
          padding: '10px', borderRadius: '10px',
          border: motsUtilises.includes(mot.mot) ? '2px solid #2A7A50' : '2px dashed rgba(42,122,80,0.6)',
          background: motsUtilises.includes(mot.mot) ? '#2A7A50' : 'rgba(42,122,80,0.08)',
          color: motsUtilises.includes(mot.mot) ? '#fff' : 'rgba(42,200,120,0.8)',
          fontSize: '13px', fontWeight: 500,
          cursor: motsUtilises.includes(mot.mot) ? 'default' : 'pointer',
        }}>
          {motsUtilises.includes(mot.mot) ? '✓ Utilisé aujourd\'hui !' : '✓ Je l\'ai utilisé aujourd\'hui !'}
        </button>
      </div>
    </div>
  )
}

// Composant bulle
function Bulle({ mot, index: idx, size, left, top, animIndex, onClick }: {
  mot: MotJour
  index: number
  size: number
  left: number
  top: number
  animIndex: number
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void
}) {
  const theme = mot.theme || 'Littérature'
  const c = COULEURS_BULLE[theme] || COULEURS_BULLE['Littérature']
  const { R, G, B } = c
  const anim = FLOAT_ANIMS[animIndex % FLOAT_ANIMS.length]
  const estExpression = mot.type === 'expression'
  const fontSize = mot.mot.length > 11 ? 9 : mot.mot.length > 7 ? 11 : 13

  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        width: size, height: size,
        left, top,
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
        animation: `${anim.name} ${anim.dur} ease-in-out infinite`,
        userSelect: 'none',
      }}
    >
      {/* Corps translucide */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: `radial-gradient(circle at 38% 35%, rgba(255,248,235,0.52) 0%, rgba(${R},${G},${B},0.1) 40%, rgba(${R},${G},${B},0.2) 100%)`,
        boxShadow: `inset 0 0 18px rgba(${R},${G},${B},0.1)`,
      }} />
      {/* Bord irisé */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        border: '1.5px solid transparent',
        borderTopColor: 'rgba(255,255,255,0.85)',
        borderRightColor: `rgba(${Math.min(R+60,255)},${Math.min(G+40,255)},${B},0.55)`,
        borderBottomColor: `rgba(${R},${G},${B},0.62)`,
        borderLeftColor: `rgba(255,240,210,0.45)`,
      }} />
      {/* Reflet haut-gauche */}
      <div style={{ position: 'absolute', top: '9%', left: '13%', width: '35%', height: '28%', borderRadius: '50%', background: 'rgba(255,255,255,0.62)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '16%', left: '20%', width: '14%', height: '10%', borderRadius: '50%', background: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
      {/* Reflet bas-droit coloré */}
      <div style={{ position: 'absolute', bottom: '13%', right: '13%', width: '20%', height: '17%', borderRadius: '50%', background: `rgba(${Math.min(R+60,255)},${Math.min(G+40,255)},${B},0.38)`, pointerEvents: 'none' }} />
      {/* Ombre portée */}
      <div style={{ position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)', width: '65%', height: '10px', borderRadius: '50%', background: `rgba(${R},${G},${B},0.25)`, filter: 'blur(7px)', pointerEvents: 'none' }} />
      {/* Texte */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 8px', pointerEvents: 'none' }}>
        {estExpression && (
          <div style={{ fontSize: '7px', letterSpacing: '1px', textTransform: 'uppercase', color: `rgba(${R},${Math.min(G+20,255)},${B},0.55)`, marginBottom: '2px' }}>expr.</div>
        )}
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize, lineHeight: 1.2, color: `rgba(${Math.round(R*0.5)},${Math.round(G*0.4)},${Math.round(B*0.3)},0.92)` }}>{mot.mot}</div>
        <div style={{ fontSize: '7px', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '4px', color: `rgba(${R},${G},${B},0.52)` }}>{mot.theme}</div>
      </div>
    </div>
  )
}

export default function ScreenAccueilV2({ favoris, motsUtilises, onToggleFavori, onMarquerUtilise, onMotsCharges }: Props) {
  const [mots, setMots] = useState<MotJour[]>([])
  const [loading, setLoading] = useState(true)
  const [erreur, setErreur] = useState(false)
  const [motOuvert, setMotOuvert] = useState<{ mot: MotJour; originX: number; originY: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const forceRefresh = window.location.search.includes('refresh=1')
    const cache = !forceRefresh ? localStorage.getItem(`mots_${today}`) : null
    if (cache) {
      try {
        const cached = JSON.parse(cache)
        setMots(cached)
        onMotsCharges(cached)
        setLoading(false)
        return
      } catch {}
    }
    const cats = localStorage.getItem('categories_choisies')
    const niveau = (localStorage.getItem('niveau_choisi') || 'intermediaire').replace(/"/g, '')
    const params = new URLSearchParams()
    if (cats) params.set('categories', cats)
    params.set('niveau', niveau)
    fetch(`/api/mots-du-jour?${params.toString()}`)
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

  function handleBulleClick(mot: MotJour, animIndex: number, e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const originX = e.clientX - rect.left
    const originY = e.clientY - rect.top
    // Zoom bulle avant ouverture
    const el = e.currentTarget as HTMLElement
    el.style.transition = 'transform 2s cubic-bezier(0.16,1,0.3,1), opacity 1.8s ease'
    el.style.transform = 'scale(16)'
    el.style.opacity = '0'
    el.style.zIndex = '40'
    setTimeout(() => {
      setMotOuvert({ mot, originX, originY })
    }, 100)
  }

  function handleClose() {
    setMotOuvert(null)
    // Réinitialiser les bulles
    document.querySelectorAll<HTMLElement>('[data-bulle]').forEach(el => {
      el.style.transition = 'transform 0.5s ease, opacity 0.5s ease'
      el.style.transform = 'scale(1)'
      el.style.opacity = '1'
      el.style.zIndex = '5'
    })
  }

  // Positions en % de la hauteur/largeur du conteneur
  const positions = [
    { leftPct: 8,  topPct: 12, size: 108, animIndex: 0 },
    { leftPct: 48, topPct: 36, size: 98,  animIndex: 1 },
    { leftPct: 10, topPct: 60, size: 92,  animIndex: 2 },
  ]

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--sepia-bg)', gap: '16px' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ width: '36px', height: '36px', border: '2px solid var(--sepia-bg3)', borderTop: '2px solid var(--sepia-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: 'var(--sepia-muted)', fontSize: '13px', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>Chargement des mots du jour…</p>
    </div>
  )

  if (erreur || mots.length === 0) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--sepia-bg)', gap: '12px', padding: '20px' }}>
      <p style={{ color: 'var(--sepia-text)', fontSize: '18px', fontFamily: 'var(--font-display)' }}>Oups !</p>
      <p style={{ color: 'var(--sepia-muted)', fontSize: '14px', textAlign: 'center' }}>Impossible de charger les mots du jour.</p>
      <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', background: 'var(--sepia-accent)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 500 }}>
        Réessayer
      </button>
    </div>
  )

  return (
    <div ref={containerRef} style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'var(--sepia-bg)' }}>
      <style>{`
        ${FLOAT_ANIMS.map(a => a.kf).join('\n')}
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>

      {/* Fond SVG décoratif */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="rg1" cx="78%" cy="10%" r="45%"><stop offset="0%" stopColor="#E8C87A" stopOpacity="0.28"/><stop offset="100%" stopColor="#F5EDD8" stopOpacity="0"/></radialGradient>
          <radialGradient id="rg2" cx="8%" cy="65%" r="40%"><stop offset="0%" stopColor="#C8955A" stopOpacity="0.18"/><stop offset="100%" stopColor="#F5EDD8" stopOpacity="0"/></radialGradient>
          <radialGradient id="rg3" cx="55%" cy="92%" r="38%"><stop offset="0%" stopColor="#D4A055" stopOpacity="0.2"/><stop offset="100%" stopColor="#F5EDD8" stopOpacity="0"/></radialGradient>
        </defs>
        <rect width="400" height="700" fill="url(#rg1)"/>
        <rect width="400" height="700" fill="url(#rg2)"/>
        <rect width="400" height="700" fill="url(#rg3)"/>
        {/* Lignes horizontales fines */}
        {Array.from({ length: 25 }, (_, i) => (
          <line key={i} x1="0" y1={28 + i * 28} x2="400" y2={28 + i * 28} stroke="#B8904A" strokeWidth="0.4" strokeOpacity={i % 2 === 0 ? 0.1 : 0.06} />
        ))}
        {/* Cercles décoratifs */}
        <circle cx="320" cy="80" r="60" fill="none" stroke="#C8A050" strokeWidth="0.7" strokeOpacity="0.14"/>
        <circle cx="320" cy="80" r="90" fill="none" stroke="#C8A050" strokeWidth="0.4" strokeOpacity="0.07"/>
        <circle cx="50" cy="450" r="50" fill="none" stroke="#A07840" strokeWidth="0.7" strokeOpacity="0.11"/>
        <circle cx="50" cy="450" r="80" fill="none" stroke="#A07840" strokeWidth="0.3" strokeOpacity="0.05"/>
        <circle cx="350" cy="580" r="40" fill="none" stroke="#B89050" strokeWidth="0.5" strokeOpacity="0.1"/>
        <circle cx="200" cy="350" r="140" fill="none" stroke="#C0A060" strokeWidth="0.3" strokeOpacity="0.05"/>
      </svg>

      {/* Bulles */}
      {mots.slice(0, 3).map((mot, i) => {
        const pos = positions[i]
        return (
          <div key={mot.mot} data-bulle="true" style={{ position: 'absolute', zIndex: 5, left: `${pos.leftPct}%`, top: `${pos.topPct}%` }}>
            <Bulle
              mot={mot}
              index={i}
              size={pos.size}
              left={0}
              top={0}
              animIndex={pos.animIndex}
              onClick={(e) => handleBulleClick(mot, i, e)}
            />
          </div>
        )
      })}

      {/* Fiche ouverte */}
      {motOuvert && (
        <FicheMot
          mot={motOuvert.mot}
          couleur={COULEURS_BULLE[motOuvert.mot.theme] || COULEURS_BULLE['Littérature']}
          favoris={favoris}
          motsUtilises={motsUtilises}
          onToggleFavori={onToggleFavori}
          onMarquerUtilise={onMarquerUtilise}
          onClose={handleClose}
          originX={motOuvert.originX}
          originY={motOuvert.originY}
        />
      )}
    </div>
  )
}

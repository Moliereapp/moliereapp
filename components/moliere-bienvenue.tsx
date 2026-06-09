import { useState } from 'react'

type Props = { onTermine: () => void }

const SLIDES = [
  { titre: 'Bienvenue sur Molière', texte: 'Enrichis ton vocabulaire chaque jour avec des mots rares, des expressions françaises et leurs secrets.', couleur: '#F5C842', tc: '#111', icon: '📖' },
  { titre: '3 mots par jour', texte: 'Chaque jour, découvre 3 nouveaux mots de catégories différentes. Navigue de l\'un à l\'autre avec les flèches.', couleur: '#2563EB', tc: '#fff', icon: '🎯' },
  { titre: 'Ton carnet personnel', texte: 'Note chaque fois que tu utilises un mot dans ta vie quotidienne. Construis ton vocabulaire pas à pas.', couleur: '#7C3AED', tc: '#fff', icon: '✏️' },
  { titre: 'Teste tes connaissances', texte: 'Le quiz quotidien te challenge sur les mots découverts. Plus tu joues, plus tu progresses.', couleur: '#059669', tc: '#fff', icon: '🏆' },
]

export default function ScreenBienvenue({ onTermine }: Props) {
  const [index, setIndex] = useState(0)
  const s = SLIDES[index]
  const estDernier = index === SLIDES.length - 1

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: s.couleur, transition: 'background 0.4s', minHeight: '100%', position: 'relative' }}>
      {!estDernier && (
        <button onClick={onTermine} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.15)', border: 'none', color: s.tc, fontSize: '13px', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer' }}>
          Passer
        </button>
      )}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 28px', textAlign: 'center' }}>
        <div style={{ fontSize: '72px', marginBottom: '32px' }}>{s.icon}</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 700, color: s.tc, marginBottom: '16px', lineHeight: 1.2 }}>{s.titre}</h1>
        <p style={{ fontSize: '16px', color: s.tc, opacity: 0.85, lineHeight: 1.6, maxWidth: '300px' }}>{s.texte}</p>
      </div>
      <div style={{ padding: '24px 28px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {SLIDES.map((_, i) => (
            <div key={i} style={{ width: i === index ? '24px' : '8px', height: '8px', borderRadius: '4px', background: s.tc, opacity: i === index ? 1 : 0.3, transition: 'all 0.3s' }} />
          ))}
        </div>
        <button onClick={() => estDernier ? onTermine() : setIndex(i => i + 1)}
          style={{ width: '100%', padding: '16px', borderRadius: '14px', border: `2px solid ${s.tc}`, background: s.tc === '#111' ? '#111' : 'rgba(255,255,255,0.2)', color: s.tc === '#111' ? '#F5C842' : s.tc, fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>
          {estDernier ? 'Commencer !' : 'Suivant'}
        </button>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'

export default function ScreenMoliereIA() {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const EXEMPLES = [
    { description: "Un mot pour quelqu'un qui parle beaucoup sans rien dire", mot: "Logorrhée" },
    { description: "Une expression pour dire qu'on a échoué lamentablement", mot: "Mordre la poussière" },
    { description: "Un mot pour décrire une découverte faite par hasard", mot: "Sérendipité" },
    { description: "Un mot pour quelqu'un qui flatte servilement son supérieur", mot: "Sycophante" },
  ]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#111', overflowY: 'auto' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #0d0d0d 100%)', padding: '32px 24px 28px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: 700, color: '#F5C842', marginBottom: '8px' }}>Molière IA</h1>
        <p style={{ fontSize: '14px', color: '#C084FC', marginBottom: '16px', fontWeight: 500 }}>Trouve ton mot{dots}</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(124, 58, 237, 0.2)', border: '1px solid #7C3AED', borderRadius: '20px', padding: '6px 16px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F5C842', animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: '12px', color: '#C084FC', fontWeight: 600 }}>En cours de développement</span>
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
      </div>

      <div style={{ padding: '24px 20px 0' }}>
        <div style={{ background: '#1C1C1C', borderRadius: '14px', padding: '20px', borderLeft: '4px solid #7C3AED' }}>
          <p style={{ fontSize: '15px', color: '#F0F0F0', lineHeight: 1.6, marginBottom: '12px' }}>Tu as une idée en tête mais pas le mot pour l'exprimer ?</p>
          <p style={{ fontSize: '14px', color: '#A0A0A0', lineHeight: 1.6 }}>Décris simplement la situation ou le concept — Molière IA trouvera le mot parfait pour toi, avec sa définition, ses synonymes et des exemples d'usage.</p>
        </div>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        <p style={{ fontSize: '11px', color: '#A0A0A0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 500, marginBottom: '12px' }}>Ce que tu pourras faire</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {EXEMPLES.map((ex, i) => (
            <div key={i} style={{ background: '#1C1C1C', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.7 }}>
              <div style={{ flexShrink: 0, width: '36px', height: '36px', borderRadius: '10px', background: '#2D1F47', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '16px' }}>💬</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '12px', color: '#A0A0A0', marginBottom: '3px', fontStyle: 'italic' }}>« {ex.description} »</p>
                <p style={{ fontSize: '14px', color: '#C084FC', fontWeight: 600, fontFamily: 'Georgia, serif' }}>→ {ex.mot}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <p style={{ fontSize: '11px', color: '#A0A0A0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 500, marginBottom: '10px' }}>Aperçu de l'interface</p>
        <div style={{ background: '#1C1C1C', borderRadius: '14px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #2A2A2A', opacity: 0.5 }}>
          <p style={{ flex: 1, fontSize: '14px', color: '#555', fontStyle: 'italic' }}>Décris le mot que tu cherches...</p>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
            <span style={{ fontSize: '16px' }}>→</span>
          </div>
        </div>
        <p style={{ fontSize: '12px', color: '#555', textAlign: 'center', marginTop: '10px' }}>Disponible prochainement</p>
      </div>

      <div style={{ margin: '0 20px 24px', background: 'linear-gradient(135deg, #1a0a2e, #0d0d0d)', borderRadius: '14px', padding: '20px', border: '1px solid #7C3AED', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', color: '#F0F0F0', marginBottom: '4px', fontWeight: 500 }}>🔔 Sois le premier informé</p>
        <p style={{ fontSize: '12px', color: '#A0A0A0', lineHeight: 1.5 }}>Cette feature arrive bientôt. Continue à utiliser Molière chaque jour — plus tu progresses, plus Molière IA te sera utile.</p>
      </div>
    </div>
  )
}

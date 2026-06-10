import { useState } from 'react'

type Props = {
  onTermine: (categories: string[], niveau: string) => void
}

const CATEGORIES = [
  { id: 'Littérature', emoji: '📖', description: 'Mots et styles littéraires' },
  { id: 'Philosophie', emoji: '🧠', description: 'Concepts et pensées' },
  { id: 'Sciences', emoji: '🔬', description: 'Découvertes et méthodes' },
  { id: 'Histoire', emoji: '🏛️', description: 'Faits et civilisations' },
  { id: 'Vie quotidienne', emoji: '☀️', description: 'Mots de tous les jours' },
  { id: 'Art', emoji: '🎨', description: 'Création et esthétique' },
  { id: 'Gastronomie', emoji: '🍷', description: 'Saveurs et cuisine' },
  { id: 'Nature', emoji: '🌿', description: 'Faune, flore et paysages' },
  { id: 'Politique', emoji: '⚖️', description: 'Pouvoir et société' },
  { id: 'Sport', emoji: '🏆', description: 'Compétition et dépassement' },
]

const NIVEAUX = [
  { id: 'novice', label: 'Novice', emoji: '🌱', description: 'Mots courants et accessibles, parfaits pour débuter.' },
  { id: 'intermediaire', label: 'Intermédiaire', emoji: '📚', description: 'Mots moins courants, pour enrichir son vocabulaire.' },
  { id: 'expert', label: 'Expert', emoji: '🏆', description: 'Mots rares et expressions recherchées.' },
]

export default function ScreenOnboarding({ onTermine }: Props) {
  const [etape, setEtape] = useState<'categories' | 'niveau'>('categories')
  const [selected, setSelected] = useState<string[]>([])
  const [niveau, setNiveau] = useState<string>('')

  function toggleCategorie(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }

  function validerCategories() {
    setEtape('niveau')
  }

  function validerNiveau() {
    const choix = selected.length > 0 ? selected : CATEGORIES.map(c => c.id)
    const niveauChoisi = niveau || 'intermediaire'
    onTermine(choix, niveauChoisi)
  }

  if (etape === 'niveau') return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#111', overflowY: 'auto' }}>
      <div style={{ background: '#F5C842', padding: '28px 24px 20px' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 700, color: '#111', marginBottom: '6px' }}>Ton niveau</h1>
        <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.5 }}>Choisis le niveau de difficulté des mots que tu veux découvrir chaque jour.</p>
      </div>

      <div style={{ padding: '20px 18px', flex: 1 }}>
        <p style={{ fontSize: '11px', color: '#A0A0A0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 500, marginBottom: '14px' }}>
          Tu pourras changer ça dans les paramètres
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {NIVEAUX.map(n => (
            <button key={n.id} onClick={() => setNiveau(n.id)}
              style={{ padding: '18px 16px', borderRadius: '12px', border: niveau === n.id ? '2px solid #F5C842' : '2px solid #2A2A2A', background: niveau === n.id ? '#1A1500' : '#1C1C1C', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '28px', flexShrink: 0 }}>{n.emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '16px', fontWeight: 600, color: niveau === n.id ? '#F5C842' : '#F0F0F0', margin: '0 0 4px' }}>{n.label}</p>
                <p style={{ fontSize: '13px', color: '#A0A0A0', margin: 0, lineHeight: 1.4 }}>{n.description}</p>
              </div>
              {niveau === n.id && (
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#F5C842', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#111', fontWeight: 700, flexShrink: 0 }}>✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 18px 32px' }}>
        <button onClick={validerNiveau} disabled={!niveau}
          style={{ width: '100%', padding: '15px', borderRadius: '14px', border: 'none', background: niveau ? '#F5C842' : '#2A2A2A', color: niveau ? '#111' : '#555', fontSize: '16px', fontWeight: 700, cursor: niveau ? 'pointer' : 'default' }}>
          {niveau ? `Commencer en mode ${NIVEAUX.find(n => n.id === niveau)?.label} →` : 'Choisis un niveau'}
        </button>
        <button onClick={() => setEtape('categories')}
          style={{ width: '100%', marginTop: '10px', padding: '10px', border: 'none', background: 'none', color: '#A0A0A0', fontSize: '13px', cursor: 'pointer' }}>
          ← Retour aux catégories
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#111', overflowY: 'auto' }}>
      <div style={{ background: '#F5C842', padding: '28px 24px 20px' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 700, color: '#111', marginBottom: '6px' }}>Personnalise ton expérience</h1>
        <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.5 }}>Choisis les thèmes qui t'intéressent — tes mots du jour seront tirés de ces catégories.</p>
      </div>

      <div style={{ padding: '20px 18px', flex: 1 }}>
        <p style={{ fontSize: '11px', color: '#A0A0A0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 500, marginBottom: '14px' }}>
          {selected.length === 0 ? 'Toutes les catégories par défaut' : `${selected.length} catégorie${selected.length > 1 ? 's' : ''} sélectionnée${selected.length > 1 ? 's' : ''}`}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {CATEGORIES.map(cat => {
            const estSelectionne = selected.includes(cat.id)
            return (
              <button key={cat.id} onClick={() => toggleCategorie(cat.id)}
                style={{ padding: '14px 12px', borderRadius: '12px', border: estSelectionne ? '2px solid #F5C842' : '2px solid #2A2A2A', background: estSelectionne ? '#1A1500' : '#1C1C1C', cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '22px' }}>{cat.emoji}</span>
                  {estSelectionne && <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#F5C842', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#111', fontWeight: 700 }}>✓</span>}
                </div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: estSelectionne ? '#F5C842' : '#F0F0F0', margin: 0 }}>{cat.id}</p>
                <p style={{ fontSize: '11px', color: '#A0A0A0', margin: 0, lineHeight: 1.3 }}>{cat.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ padding: '16px 18px 32px' }}>
        <button onClick={validerCategories}
          style={{ width: '100%', padding: '15px', borderRadius: '14px', border: 'none', background: '#F5C842', color: '#111', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>
          {selected.length === 0 ? 'Tout explorer →' : `Valider mes ${selected.length} thème${selected.length > 1 ? 's' : ''} →`}
        </button>
        {selected.length > 0 && (
          <button onClick={() => setSelected([])}
            style={{ width: '100%', marginTop: '10px', padding: '10px', border: 'none', background: 'none', color: '#A0A0A0', fontSize: '13px', cursor: 'pointer' }}>
            Tout sélectionner
          </button>
        )}
      </div>
    </div>
  )
}

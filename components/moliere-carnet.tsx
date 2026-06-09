import { useState } from 'react'
import { useLocalStorage } from '../lib/useLocalStorage'

type Utilisation = {
  date: string
  phrase: string
}

type MotCarnet = {
  mot: string
  theme: string
  definition: string
  dateDecouvert: string
  utilisations: Utilisation[]
  synonymes?: string[]
  antonymes?: string[]
  citation?: { texte: string; auteur: string } | null
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

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function CarteMotCarnet({ mot, onAjouterUtilisation }: {
  mot: MotCarnet
  onAjouterUtilisation: (motNom: string, utilisation: Utilisation) => void
}) {
  const [ouvert, setOuvert] = useState(false)
  const [ajoutOuvert, setAjoutOuvert] = useState(false)
  const [phrase, setPhrase] = useState('')
  const couleur = COULEURS_THEME[mot.theme] || '#2563EB'

  function soumettre() {
    if (!phrase.trim()) return
    const today = new Date().toISOString().split('T')[0]
    onAjouterUtilisation(mot.mot, { date: today, phrase: phrase.trim() })
    setPhrase('')
    setAjoutOuvert(false)
  }

  return (
    <div style={{ background: '#1C1C1C', borderRadius: '12px', border: '1px solid #2A2A2A', overflow: 'hidden', marginBottom: '10px' }}>
      {/* En-tête de la carte */}
      <div onClick={() => setOuvert(!ouvert)}
        style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: couleur + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: 700, color: couleur }}>{mot.mot.slice(0, 2)}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#F0F0F0' }}>{mot.mot}</p>
            {mot.utilisations.length > 0 && (
              <span style={{ background: couleur, color: '#fff', fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '10px' }}>
                {mot.utilisations.length}×
              </span>
            )}
          </div>
          <p style={{ fontSize: '11px', color: '#A0A0A0', marginTop: '1px' }}>
            {mot.theme} · Découvert le {formatDate(mot.dateDecouvert)}
          </p>
        </div>
        <span style={{ color: '#A0A0A0', fontSize: '16px', transition: 'transform 0.2s', transform: ouvert ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
      </div>

      {/* Contenu déroulant */}
      {ouvert && (
        <div style={{ borderTop: '1px solid #2A2A2A', padding: '12px 14px' }}>
          {/* Définition */}
          <p style={{ fontSize: '13px', color: '#C0C0C0', lineHeight: 1.5, marginBottom: '12px', fontStyle: 'italic', borderLeft: `3px solid ${couleur}`, paddingLeft: '10px' }}>
            {mot.definition}
          </p>
{mot.synonymes && mot.synonymes.length > 0 && (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
    <span style={{ fontSize: '11px', color: '#A0A0A0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', alignSelf: 'center' }}>Synonymes :</span>
    {mot.synonymes.map((s, i) => (
      <span key={i} style={{ background: '#272727', color: '#C0C0C0', fontSize: '12px', padding: '3px 10px', borderRadius: '20px', border: '1px solid #3A3A3A' }}>{s}</span>
    ))}
  </div>
)}
{mot.antonymes && mot.antonymes.length > 0 && (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
    <span style={{ fontSize: '11px', color: '#A0A0A0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', alignSelf: 'center' }}>Antonymes :</span>
    {mot.antonymes.map((a, i) => (
      <span key={i} style={{ background: '#2D0A0A', color: '#FCA5A5', fontSize: '12px', padding: '3px 10px', borderRadius: '20px', border: '1px solid #7F1D1D' }}>{a}</span>
    ))}
  </div>
)}
{mot.citation && (
  <div style={{ background: '#1A1200', borderRadius: '10px', padding: '10px 12px', marginTop: '8px', borderLeft: '3px solid #F5C842' }}>
    <p style={{ fontSize: '12px', color: '#F0F0F0', fontStyle: 'italic', lineHeight: 1.5 }}>« {mot.citation.texte} »</p>
    <p style={{ fontSize: '11px', color: '#CA8A04', marginTop: '4px', fontWeight: 500 }}>— {mot.citation.auteur}</p>
  </div>
)}
          {/* Historique utilisations */}
          {mot.utilisations.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <p style={labelStyle}>Mes utilisations ({mot.utilisations.length})</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {mot.utilisations.map((u, i) => (
                  <div key={i} style={{ background: '#272727', borderRadius: '8px', padding: '10px 12px' }}>
                    <p style={{ fontSize: '12px', color: '#A0A0A0', marginBottom: '4px' }}>📅 {formatDate(u.date)}</p>
                    <p style={{ fontSize: '13px', color: '#F0F0F0', fontStyle: 'italic', lineHeight: 1.4 }}>« {u.phrase} »</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formulaire ajout */}
          {ajoutOuvert ? (
            <div style={{ background: '#272727', borderRadius: '10px', padding: '12px' }}>
              <p style={{ fontSize: '12px', color: '#A0A0A0', marginBottom: '8px' }}>Écris la phrase où tu as utilisé ce mot :</p>
              <textarea
                value={phrase}
                onChange={e => setPhrase(e.target.value)}
                placeholder={`Ex : "Sa réponse était empreinte d'${mot.mot.toLowerCase()}..."`}
                style={{ width: '100%', background: '#1C1C1C', border: '1px solid #3A3A3A', borderRadius: '8px', padding: '10px', color: '#F0F0F0', fontSize: '13px', resize: 'none', height: '80px', fontFamily: 'inherit', outline: 'none' }}
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button onClick={() => { setAjoutOuvert(false); setPhrase('') }}
                  style={{ flex: 1, padding: '9px', borderRadius: '8px', border: '1px solid #3A3A3A', background: '#1C1C1C', color: '#A0A0A0', fontSize: '13px', cursor: 'pointer' }}>
                  Annuler
                </button>
                <button onClick={soumettre}
                  style={{ flex: 2, padding: '9px', borderRadius: '8px', border: 'none', background: couleur, color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  ✓ Enregistrer
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAjoutOuvert(true)}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: `1.5px dashed ${couleur}`, background: 'transparent', color: couleur, fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
              + J'ai utilisé ce mot — noter ma phrase
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function ScreenCarnet() {
  const [carnet, setCarnet] = useLocalStorage<MotCarnet[]>('carnet_v1', [])
  const [filtre, setFiltre] = useState<'tous' | 'utilises' | 'non_utilises'>('tous')
  const [recherche, setRecherche] = useState('')

  // Charger les mots vus depuis le cache
  const motsVusCache: MotCarnet[] = []
  if (typeof window !== 'undefined') {
    for (let i = 0; i < 30; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = `mots_${d.toISOString().split('T')[0]}`
      const cached = localStorage.getItem(key)
      if (cached) {
        try {
          const mots = JSON.parse(cached)
          mots.forEach((m: any) => {
            if (!motsVusCache.find(c => c.mot === m.mot)) {
              const existant = carnet.find(c => c.mot === m.mot)
              motsVusCache.push(existant || {
                mot: m.mot,
                theme: m.theme,
                definition: m.definition,
                dateDecouvert: d.toISOString().split('T')[0],
                utilisations: [],
              })
            }
          })
        } catch {}
      }
    }
  }

  const tousLesMots = motsVusCache.length > 0 ? motsVusCache : carnet

  const motsFiltres = tousLesMots
    .filter(m => {
      if (filtre === 'utilises') return m.utilisations.length > 0
      if (filtre === 'non_utilises') return m.utilisations.length === 0
      return true
    })
    .filter(m => m.mot.toLowerCase().includes(recherche.toLowerCase()))

  function ajouterUtilisation(motNom: string, utilisation: Utilisation) {
    const nouveau = tousLesMots.map(m => {
      if (m.mot !== motNom) return m
      return { ...m, utilisations: [...m.utilisations, utilisation] }
    })
    setCarnet(nouveau)
  }

  const totalUtilisations = tousLesMots.reduce((acc, m) => acc + m.utilisations.length, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', background: '#111' }}>
      {/* Header */}
      <div style={{ background: '#F5C842', padding: '14px 18px 16px', flexShrink: 0 }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 700, color: '#111', marginBottom: '4px' }}>
          Mon carnet
        </h2>
        <p style={{ fontSize: '13px', color: '#555' }}>
          {tousLesMots.length} mots · {totalUtilisations} utilisations notées
        </p>
      </div>

      {/* Recherche */}
      <div style={{ padding: '10px 18px', background: '#111', flexShrink: 0 }}>
        <input
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          placeholder="🔍 Rechercher un mot…"
          style={{ width: '100%', background: '#1C1C1C', border: '1px solid #3A3A3A', borderRadius: '10px', padding: '10px 14px', color: '#F0F0F0', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
        />
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '8px', padding: '0 18px 10px', flexShrink: 0 }}>
        {([['tous', 'Tous'], ['utilises', 'Utilisés'], ['non_utilises', 'À utiliser']] as const).map(([val, label]) => (
          <button key={val} onClick={() => setFiltre(val)}
            style={{ padding: '5px 12px', borderRadius: '20px', border: '1.5px solid', borderColor: filtre === val ? '#F5C842' : '#3A3A3A', background: filtre === val ? '#F5C842' : '#1C1C1C', color: filtre === val ? '#111' : '#F0F0F0', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 16px' }}>
        {motsFiltres.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ fontSize: '32px', marginBottom: '12px' }}>📖</p>
            <p style={{ color: '#F0F0F0', fontSize: '16px', fontFamily: 'Georgia, serif', marginBottom: '6px' }}>
              {recherche ? 'Aucun mot trouvé' : 'Ton carnet est vide'}
            </p>
            <p style={{ color: '#A0A0A0', fontSize: '13px' }}>
              {recherche ? 'Essaie un autre terme' : 'Découvre des mots chaque jour pour les voir apparaître ici'}
            </p>
          </div>
        ) : (
          motsFiltres.map(mot => (
            <CarteMotCarnet
              key={mot.mot}
              mot={mot}
              onAjouterUtilisation={ajouterUtilisation}
            />
          ))
        )}
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px',
  color: '#A0A0A0', marginBottom: '8px', fontWeight: 500,
}

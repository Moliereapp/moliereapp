import { useState, useEffect } from 'react'

type MotVu = {
  mot: string
  theme: string
  definition: string
  synonymes?: string[]
  antonymes?: string[]
  citation?: { texte: string; auteur: string } | null
  date: string
}

const COULEURS: Record<string, { bg: string; tc: string }> = {
  'Littérature':    { bg: '#3D2E00', tc: '#FCD34D' },
  'Vie quotidienne': { bg: '#172554', tc: '#93C5FD' },
  'Philosophie':    { bg: '#2D0A0A', tc: '#FCA5A5' },
  'Sciences':       { bg: '#1E1B4B', tc: '#C4B5FD' },
  'Histoire':       { bg: '#1C1200', tc: '#FDE68A' },
  'Art':            { bg: '#1C0A00', tc: '#FDBA74' },
  'Gastronomie':    { bg: '#1A1200', tc: '#FDE68A' },
  'Nature':         { bg: '#052E16', tc: '#86EFAC' },
  'Politique':      { bg: '#2D0A0A', tc: '#FCA5A5' },
  'Sport':          { bg: '#0C1A2E', tc: '#93C5FD' },
}

const TOUS_THEMES = ['Tous', 'Littérature', 'Philosophie', 'Sciences', 'Histoire', 'Vie quotidienne', 'Art', 'Gastronomie', 'Nature', 'Politique', 'Sport']

export default function ScreenHistorique() {
  const [mots, setMots] = useState<MotVu[]>([])
  const [filtre, setFiltre] = useState('Tous')
  const [motOuvert, setMotOuvert] = useState<string | null>(null)

  useEffect(() => {
    const motsVus: MotVu[] = []
    for (let i = 0; i < 60; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = `mots_${d.toISOString().split('T')[0]}`
      const cached = localStorage.getItem(key)
      if (cached) {
        try {
          const liste = JSON.parse(cached)
          liste.forEach((m: any) => {
            if (!motsVus.find(v => v.mot === m.mot)) {
              motsVus.push({
                mot: m.mot,
                theme: m.theme,
                definition: m.definition,
                synonymes: m.synonymes || [],
                antonymes: m.antonymes || [],
                citation: m.citation || null,
                date: d.toISOString().split('T')[0],
              })
            }
          })
        } catch {}
      }
    }
    setMots(motsVus)
  }, [])

  const couleur = (theme: string) => COULEURS[theme] ?? { bg: '#1C1C1C', tc: '#A0A0A0' }

  const filtres = filtre === 'Tous' ? mots : mots.filter(m => m.theme === filtre)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ padding: '16px 18px 10px', borderBottom: '1px solid #2A2A2A', background: '#111' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: '#F0F0F0', marginBottom: '4px' }}>Mes mots appris</h2>
        <p style={{ fontSize: '13px', color: '#A0A0A0' }}>{mots.length} mots découverts</p>
      </div>

      <div style={{ padding: '10px 18px', display: 'flex', gap: '6px', overflowX: 'auto', borderBottom: '1px solid #2A2A2A', background: '#111' }}>
        {TOUS_THEMES.map(t => (
          <button key={t} onClick={() => setFiltre(t)}
            style={{ whiteSpace: 'nowrap', padding: '5px 12px', borderRadius: '20px', border: '1.5px solid', borderColor: filtre === t ? '#F5C842' : '#3A3A3A', background: filtre === t ? '#F5C842' : '#1C1C1C', fontSize: '12px', color: filtre === t ? '#111' : '#F0F0F0', cursor: 'pointer', fontWeight: 500 }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 18px', display: 'flex', flexDirection: 'column', gap: '8px', background: '#111' }}>
        {filtres.length === 0 ? (
          <p style={{ color: '#A0A0A0', fontSize: '14px', textAlign: 'center', marginTop: '32px' }}>Aucun mot dans cette catégorie.</p>
        ) : (
          filtres.map(mot => {
            const c = couleur(mot.theme)
            const ouvert = motOuvert === mot.mot
            return (
              <div key={mot.mot} style={{ background: '#1C1C1C', borderRadius: '10px', border: '1px solid #2A2A2A', overflow: 'hidden' }}>
                <div onClick={() => setMotOuvert(ouvert ? null : mot.mot)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', cursor: 'pointer' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', fontSize: '15px', fontWeight: 600, color: c.tc, flexShrink: 0 }}>
                    {mot.mot.slice(0, 2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#F0F0F0' }}>{mot.mot}</p>
                    <p style={{ fontSize: '11px', color: '#A0A0A0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mot.definition.slice(0, 50)}…</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                    <span style={{ fontSize: '11px', color: '#A0A0A0' }}>{mot.theme}</span>
                  </div>
                </div>

                {ouvert && (
                  <div style={{ borderTop: '1px solid #2A2A2A', padding: '12px 14px' }}>
                    <p style={{ fontSize: '13px', color: '#C0C0C0', lineHeight: 1.5, fontStyle: 'italic', borderLeft: '3px solid #F5C842', paddingLeft: '10px', marginBottom: '10px' }}>
                      {mot.definition}
                    </p>
                    {mot.synonymes && mot.synonymes.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', color: '#A0A0A0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', alignSelf: 'center' }}>Synonymes :</span>
                        {mot.synonymes.map((s, i) => (
                          <span key={i} style={{ background: '#272727', color: '#C0C0C0', fontSize: '12px', padding: '3px 10px', borderRadius: '20px', border: '1px solid #3A3A3A' }}>{s}</span>
                        ))}
                      </div>
                    )}
                    {mot.antonymes && mot.antonymes.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', color: '#A0A0A0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', alignSelf: 'center' }}>Antonymes :</span>
                        {mot.antonymes.map((a, i) => (
                          <span key={i} style={{ background: '#2D0A0A', color: '#FCA5A5', fontSize: '12px', padding: '3px 10px', borderRadius: '20px', border: '1px solid #7F1D1D' }}>{a}</span>
                        ))}
                      </div>
                    )}
                    {mot.citation && (
                      <div style={{ background: '#1A1200', borderRadius: '10px', padding: '10px 12px', borderLeft: '3px solid #F5C842' }}>
                        <p style={{ fontSize: '12px', color: '#F0F0F0', fontStyle: 'italic', lineHeight: 1.5 }}>« {mot.citation.texte} »</p>
                        <p style={{ fontSize: '11px', color: '#CA8A04', marginTop: '4px', fontWeight: 500 }}>— {mot.citation.auteur}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

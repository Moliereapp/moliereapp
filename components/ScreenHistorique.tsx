import { Mot } from '../lib/mots'

type Props = { mots: Mot[]; favoris: number[]; motUtilises: number[] }

const THEMES = ['Tous', 'Favoris', 'Littérature', 'Sciences', 'Philosophie', 'Vie quotidienne']

const COULEURS: Record<string, { bg: string; tc: string }> = {
  Littérature:      { bg: '#3D2E00', tc: '#FCD34D' },
  'Vie quotidienne': { bg: '#172554', tc: '#93C5FD' },
  Philosophie:      { bg: '#2D0A0A', tc: '#FCA5A5' },
  Sciences:         { bg: '#1E1B4B', tc: '#C4B5FD' },
}

export default function ScreenHistorique({ mots, favoris, motUtilises }: Props) {
  const [filtre, setFiltre] = require('react').useState('Tous')

  const filtres = filtre === 'Tous' ? mots
    : filtre === 'Favoris' ? mots.filter(m => favoris.includes(m.id))
    : mots.filter(m => m.theme === filtre)

  const couleur = (theme: string) => COULEURS[theme] ?? { bg: '#1C1C1C', tc: '#A0A0A0' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ padding: '16px 18px 10px', borderBottom: '1px solid #3A3A3A', background: '#111' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#F0F0F0' }}>Mes mots appris</h2>
        <p style={{ fontSize: '13px', color: '#A0A0A0', marginTop: '2px' }}>{mots.length} mots découverts</p>
      </div>

      <div style={{ padding: '10px 18px', display: 'flex', gap: '6px', overflowX: 'auto', borderBottom: '1px solid #3A3A3A', background: '#111' }}>
        {THEMES.map(t => (
          <button key={t} onClick={() => setFiltre(t)}
            style={{ whiteSpace: 'nowrap', padding: '5px 12px', borderRadius: '20px', border: '1.5px solid', borderColor: filtre === t ? '#F5C842' : '#3A3A3A', background: filtre === t ? '#F5C842' : '#1C1C1C', fontSize: '12px', color: filtre === t ? '#111' : '#F0F0F0', fontWeight: 500, cursor: 'pointer' }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 18px', display: 'flex', flexDirection: 'column', gap: '8px', background: '#111' }}>
        {filtres.length === 0 && (
          <p style={{ color: '#A0A0A0', fontSize: '14px', textAlign: 'center', marginTop: '32px' }}>Aucun mot dans cette catégorie.</p>
        )}
        {filtres.map(mot => {
          const c = couleur(mot.theme)
          return (
            <div key={mot.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', border: '1px solid #3A3A3A', background: '#1C1C1C' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: c.bg, color: c.tc, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, flexShrink: 0 }}>
                {mot.mot.slice(0, 2)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#F0F0F0' }}>{mot.mot}</p>
                <p style={{ fontSize: '11px', color: '#A0A0A0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mot.definition.slice(0, 50)}…</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                <span style={{ fontSize: '11px', color: '#A0A0A0' }}>{mot.theme}</span>
                {favoris.includes(mot.id) && <span style={{ fontSize: '14px', color: '#F87171' }}>♥</span>}
                {motUtilises.includes(mot.id) && <span style={{ fontSize: '11px', color: '#4ADE80' }}>utilisé</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Mot } from '../lib/mots'

type Props = {
  mot: Mot
  favoris: number[]
  motUtilise: boolean
  onToggleFavori: () => void
  onMarquerUtilise: () => void
}

export default function ScreenAccueil({ mot, favoris, motUtilise, onToggleFavori, onMarquerUtilise }: Props) {
  const estFavori = favoris.includes(mot.id)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ background: '#F5C842', padding: '0 18px 20px' }}>
        <p style={{ fontSize: '11px', color: '#111', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', paddingTop: '16px' }}>
          Mot du jour
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '38px', fontWeight: 600, color: '#111', lineHeight: 1.1, marginBottom: '4px' }}>
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
          <button
            onClick={onToggleFavori}
            style={{
              padding: '11px', borderRadius: '10px',
              border: estFavori ? '1.5px solid #E8402A' : '1.5px solid #3A3A3A',
              background: estFavori ? '#2D0A0A' : '#1C1C1C',
              fontSize: '13px', fontWeight: 500,
              color: estFavori ? '#FCA5A5' : '#F0F0F0',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}
          >
            ♥ {estFavori ? 'Sauvegardé' : 'Favori'}
          </button>
          <button style={{ padding: '11px', borderRadius: '10px', border: '2px solid #F5C842', background: '#F5C842', color: '#111', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            ↑ Partager
          </button>
        </div>

        <button
          onClick={onMarquerUtilise}
          disabled={motUtilise}
          style={{
            width: '100%', marginTop: '8px', padding: '11px', borderRadius: '10px',
            border: motUtilise ? '2px solid #16A34A' : '2px dashed #16A34A',
            background: motUtilise ? '#16A34A' : '#0A1F10',
            color: motUtilise ? '#111' : '#4ADE80',
            fontSize: '13px', fontWeight: 500,
          }}
        >
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

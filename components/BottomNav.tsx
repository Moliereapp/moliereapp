type Screen = 'accueil' | 'quiz' | 'carnet' | 'ia' | 'historique' | 'profil'
type Props = {
  active: Screen
  onChange: (screen: Screen) => void
}

export default function BottomNav({ active, onChange }: Props) {
  const items: { id: Screen; label: string; icon: string }[] = [
    { id: 'accueil', label: 'Accueil', icon: '⌂' },
    { id: 'quiz', label: 'Quiz', icon: '◈' },
    { id: 'carnet', label: 'Carnet', icon: '✎' },
    { id: 'ia', label: 'Molière IA', icon: '🤖' },
    { id: 'historique', label: 'Mots appris', icon: '☰' },
    { id: 'profil', label: 'Profil', icon: '◉' },
  ]

  return (
    <nav style={{
      borderTop: '1px solid #2A2A2A',
      display: 'flex',
      background: '#111',
      padding: '6px 0 12px',
      flexShrink: 0,
    }}>
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            border: 'none',
            background: 'none',
            padding: '4px 0',
            color: active === item.id ? '#F5C842' : '#555',
            fontSize: '9px',
            fontFamily: 'inherit',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'color 0.15s',
          }}
        >
          <div style={{
            width: '4px', height: '4px', borderRadius: '50%',
            background: '#F5C842',
            marginBottom: '-2px',
            opacity: active === item.id ? 1 : 0,
            transition: 'opacity 0.15s',
          }} />
          <span style={{ fontSize: '18px', lineHeight: 1 }}>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  )
}

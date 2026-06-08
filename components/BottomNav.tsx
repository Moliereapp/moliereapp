type Screen = 'accueil' | 'quiz' | 'historique' | 'profil'

type Props = {
  active: Screen
  onChange: (screen: Screen) => void
}

export default function BottomNav({ active, onChange }: Props) {
  const items: { id: Screen; label: string; icon: string }[] = [
    { id: 'accueil', label: 'Accueil', icon: '⌂' },
    { id: 'quiz', label: 'Quiz', icon: '◈' },
    { id: 'historique', label: 'Mots appris', icon: '☰' },
    { id: 'profil', label: 'Profil', icon: '◉' },
  ]

  return (
    <nav style={{
      borderTop: '1px solid #3A3A3A',
      display: 'flex',
      background: '#111',
      padding: '6px 0 12px',
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
            color: active === item.id ? '#F5C842' : '#A0A0A0',
            fontSize: '10px',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
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
          <span style={{ fontSize: '20px', lineHeight: 1 }}>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  )
}

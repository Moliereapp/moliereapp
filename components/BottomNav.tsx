type Screen = 'accueil' | 'quiz' | 'carnet' | 'ia' | 'pelemele' | 'profil'

type Props = {
  active: Screen
  onChange: (screen: Screen) => void
}

export default function BottomNav({ active, onChange }: Props) {
  const items: { id: Screen; icon: string }[] = [
    { id: 'accueil',  icon: '⌂' },
    { id: 'quiz',     icon: '◈' },
    { id: 'carnet',   icon: '✎' },
    { id: 'ia',       icon: '✦' },
    { id: 'pelemele', icon: '❋' },
    { id: 'profil',   icon: '◉' },
  ]

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px 12px 14px',
      background: 'var(--sepia-bg)',
      borderTop: '1px solid var(--sepia-border)',
      flexShrink: 0,
      gap: '4px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--sepia-surface)',
        borderRadius: '40px',
        padding: '5px 6px',
        gap: '2px',
        boxShadow: '0 2px 16px rgba(44,36,32,0.18)',
      }}>
        {items.map(item => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: isActive ? '52px' : '40px',
                height: '36px',
                borderRadius: '30px',
                border: 'none',
                background: isActive ? 'var(--sepia-accent)' : 'transparent',
                color: isActive ? '#fff' : 'rgba(245,237,216,0.35)',
                fontSize: '18px',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                flexShrink: 0,
              }}
            >
              {item.icon}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

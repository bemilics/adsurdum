export type TabId = 'feed' | 'explore' | 'reels' | 'persona' | 'transparency'

interface Tab {
  id: TabId
  label: string
  icon: (active: boolean) => React.ReactNode
}

const stroke = (active: boolean) => (active ? '#a3e635' : '#a3a3a3')

const TABS: Tab[] = [
  {
    id: 'feed',
    label: 'Feed',
    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke(a)} strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
      </svg>
    ),
  },
  {
    id: 'explore',
    label: 'Explore',
    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke(a)} strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: 'reels',
    label: 'Reels',
    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke(a)} strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <polygon points="10,8 16,12 10,16" fill={stroke(a)} />
      </svg>
    ),
  },
  {
    id: 'persona',
    label: 'Persona',
    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke(a)} strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
      </svg>
    ),
  },
  {
    id: 'transparency',
    label: 'Truth',
    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke(a)} strokeWidth="2">
        <path d="M12 2 L22 20 L2 20 Z" />
        <line x1="12" y1="9" x2="12" y2="14" />
        <circle cx="12" cy="17" r="0.5" fill={stroke(a)} />
      </svg>
    ),
  },
]

interface Props {
  active: TabId
  onChange: (id: TabId) => void
}

export function TabBar({ active, onChange }: Props) {
  return (
    <nav className="safe-bottom sticky bottom-0 z-40 border-t border-line bg-void/95 backdrop-blur">
      <div className="mx-auto flex max-w-lg items-stretch justify-between">
        {TABS.map((t) => {
          const isActive = t.id === active
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className="flex flex-1 flex-col items-center gap-1 py-2 text-[10px] uppercase tracking-wider"
              aria-current={isActive ? 'page' : undefined}
            >
              {t.icon(isActive)}
              <span className={isActive ? 'text-acid' : 'text-fog'}>{t.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

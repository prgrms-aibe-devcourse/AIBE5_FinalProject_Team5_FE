import logo from '../../../assets/bootsignal_transparent.png'

type SidebarItem = {
  label: string
  href: string
  icon: 'grid' | 'pin' | 'folder' | 'calendar' | 'user' | 'headset' | 'document'
}

const sidebarItems: SidebarItem[] = [
  { label: '대시보드', href: '/dashboard', icon: 'grid' },
  { label: '찜 목록', href: '/dashboard/favorites', icon: 'pin' },
  { label: '내가 쓴 글', href: '/dashboard/posts', icon: 'folder' },
  { label: '일정', href: '/dashboard/schedule', icon: 'calendar' },
  { label: '내 정보', href: '/dashboard/profile', icon: 'user' },
  { label: '문의', href: '/dashboard/inquiries', icon: 'headset' },
  { label: 'AI 포트폴리오', href: '/dashboard/portfolio', icon: 'document' },
]

function SidebarIcon({ icon }: { icon: SidebarItem['icon'] }) {
  const props = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (icon) {
    case 'grid':
      return (
        <svg {...props} aria-hidden="true">
          <rect x="4" y="4" width="6" height="6" rx="1.25" />
          <rect x="14" y="4" width="6" height="6" rx="1.25" />
          <rect x="4" y="14" width="6" height="6" rx="1.25" />
          <rect x="14" y="14" width="6" height="6" rx="1.25" />
        </svg>
      )
    case 'pin':
      return (
        <svg {...props} aria-hidden="true">
          <path d="M14 4l6 6-4 1-3 6-2-2-4 4-2-2 4-4-2-2 6-3 1-4z" />
        </svg>
      )
    case 'folder':
      return (
        <svg {...props} aria-hidden="true">
          <path d="M4 7.5h6l2 2h8v8.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
          <path d="M4 7.5V6a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v1.5" />
        </svg>
      )
    case 'calendar':
      return (
        <svg {...props} aria-hidden="true">
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 3v4M16 3v4M4 10h16" />
        </svg>
      )
    case 'user':
      return (
        <svg {...props} aria-hidden="true">
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </svg>
      )
    case 'headset':
      return (
        <svg {...props} aria-hidden="true">
          <path d="M4 13a8 8 0 0 1 16 0" />
          <path d="M4 13v4a2 2 0 0 0 2 2h1v-7H6a2 2 0 0 0-2 2z" />
          <path d="M20 13v4a2 2 0 0 1-2 2h-1v-7h1a2 2 0 0 1 2 2z" />
          <path d="M14 21h-2" />
        </svg>
      )
    default:
      return (
        <svg {...props} aria-hidden="true">
          <path d="M7 3.5h7l3 3V20a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 6 20V5A1.5 1.5 0 0 1 7.5 3.5z" />
          <path d="M14 3.5V7h3.5M9 12h6M9 16h6" />
        </svg>
      )
  }
}

function normalizePath(pathname: string) {
  return pathname.replace(/\/+$/, '') || '/'
}

export default function DashboardSidebar() {
  const currentPath = normalizePath(window.location.pathname)

  return (
    <aside className="flex min-h-screen w-[250px] shrink-0 flex-col border-r border-[#edf1f5] bg-white px-4 py-6">
      <a href="/dashboard" className="mb-10 flex items-center px-1" aria-label="BootSignal 홈">
        <img src={logo} alt="BootSignal" className="h-10 w-auto" />
      </a>

      <nav aria-label="대시보드 사이드바">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = currentPath === item.href || (item.href === '/dashboard' && currentPath === '/')

            return (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    isActive ? 'bg-[#eaf0f6] text-[#1f2f45]' : 'text-[#536173] hover:bg-[#f5f8fb] hover:text-[#1f2f45]'
                  }`}
                >
                  <SidebarIcon icon={item.icon} />
                  <span>{item.label}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

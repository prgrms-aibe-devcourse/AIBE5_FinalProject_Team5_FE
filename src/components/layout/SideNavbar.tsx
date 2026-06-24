import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/bootsignal_transparent.png'
import { logout } from '../../services/auth'

// 사이드바 아이콘 이름
type SidebarIconName =
  | 'grid'
  | 'pin'
  | 'folder'
  | 'user'
  | 'headset'
  | 'document'
  | 'check'
  | 'badge'
  | 'report'

const svgProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

// 사이드바 아이콘 컴포넌트
function SidebarIcon({ icon }: { icon: SidebarIconName }) {
  switch (icon) {
    case 'grid':
      return (
        <svg {...svgProps} aria-hidden="true">
          <rect x="4" y="4" width="6" height="6" rx="1.25" />
          <rect x="14" y="4" width="6" height="6" rx="1.25" />
          <rect x="4" y="14" width="6" height="6" rx="1.25" />
          <rect x="14" y="14" width="6" height="6" rx="1.25" />
        </svg>
      )
    case 'pin':
      return (
        <svg {...svgProps} aria-hidden="true">
          <path d="M14 4l6 6-4 1-3 6-2-2-4 4-2-2 4-4-2-2 6-3 1-4z" />
        </svg>
      )
    case 'folder':
      return (
        <svg {...svgProps} aria-hidden="true">
          <path d="M4 7.5h6l2 2h8v8.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
          <path d="M4 7.5V6a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v1.5" />
        </svg>
      )
    case 'user':
      return (
        <svg {...svgProps} aria-hidden="true">
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </svg>
      )
    case 'headset':
      return (
        <svg {...svgProps} aria-hidden="true">
          <path d="M4 13a8 8 0 0 1 16 0" />
          <path d="M4 13v4a2 2 0 0 0 2 2h1v-7H6a2 2 0 0 0-2 2z" />
          <path d="M20 13v4a2 2 0 0 1-2 2h-1v-7h1a2 2 0 0 1 2 2z" />
          <path d="M14 21h-2" />
        </svg>
      )
    case 'check':
      return (
        <svg {...svgProps} aria-hidden="true">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      )
    case 'badge':
      return (
        <svg {...svgProps} aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="12" cy="11" r="2.5" />
          <path d="M8 18v-1a4 4 0 0 1 8 0v1" />
        </svg>
      )
    case 'report':
      return (
        <svg {...svgProps} aria-hidden="true">
          <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
          <path d="M12 12v5M9 15h6" />
        </svg>
      )
    default:
      return (
        <svg {...svgProps} aria-hidden="true">
          <path d="M7 3.5h7l3 3V20a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 6 20V5A1.5 1.5 0 0 1 7.5 3.5z" />
          <path d="M14 3.5V7h3.5M9 12h6M9 16h6" />
        </svg>
      )
  }
}

type SideNavbarItem = {
  label: string
  href: string
  icon: SidebarIconName
}

export type SideNavbarVariant = 'dashboard' | 'admin'

const dashboardItems: SideNavbarItem[] = [
  { label: '대시보드', href: '/dashboard', icon: 'grid' },
  { label: '내 정보', href: '/dashboard/profile', icon: 'user' },
  { label: '스크랩 목록', href: '/dashboard/bookmarks', icon: 'pin' },
  { label: '내가 쓴 글', href: '/dashboard/posts', icon: 'folder' },
  { label: 'AI 포트폴리오', href: '/dashboard/portfolio', icon: 'document' },
  { label: '문의', href: '/dashboard/inquiries', icon: 'headset' },
]

const adminItems: SideNavbarItem[] = [
  { label: '대시보드', href: '/admin', icon: 'grid' },
  { label: '인증 관리', href: '/admin/certifications', icon: 'badge' },
  { label: '문의 관리', href: '/admin/inquiries', icon: 'headset' },
  { label: '신고내역', href: '/admin/reports', icon: 'report' },
  { label: '공지', href: '/admin/notices', icon: 'document' },
]

const navConfig: Record<SideNavbarVariant, { items: SideNavbarItem[]; navAriaLabel: string }> = {
  dashboard: { items: dashboardItems, navAriaLabel: '대시보드 사이드바' },
  admin: { items: adminItems, navAriaLabel: '관리자 사이드바' },
}

export type SideNavbarProps = {
  variant: SideNavbarVariant
  isOpen?: boolean
  onClose?: () => void
}

export default function SideNavbar({ variant, isOpen = false, onClose }: SideNavbarProps) {
  const { items, navAriaLabel } = navConfig[variant]
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const currentPath = pathname.replace(/\/+$/, '') || '/'

  const handleLogout = async () => {
    await logout()
    onClose?.()
    navigate('/', { replace: true })
    window.scrollTo({ top: 0, left: 0 })
  }

  return (
    <>
      {/* 모바일 오버레이 배경 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`glass-sidebar fixed inset-y-0 left-0 z-50 flex w-62.5 flex-col px-4 py-6 transition-transform duration-300 ease-in-out lg:relative lg:min-h-screen lg:shrink-0 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* 로고 + 닫기 버튼 (모바일) */}
        <div className="mb-10 flex items-center justify-between px-1">
          <Link
            to="/"
            className="flex items-center"
            aria-label="BootSignal 홈"
            onClick={() => {
              try { sessionStorage.setItem('bootsignal-home-entry-played', 'true') } catch {}
              onClose?.()
            }}
          >
            <img src={logo} alt="BootSignal" className="h-10 w-auto" />
          </Link>
          {onClose && (
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#536173] hover:bg-[#f5f8fb] lg:hidden"
              onClick={onClose}
              aria-label="메뉴 닫기"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* 네비게이션 영역 */}
        <nav aria-label={navAriaLabel}>
          <ul className="space-y-2">
            {items.map((item) => {
              const isActive = currentPath === item.href

              return (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                      isActive ? 'bg-[#eaf0f6] text-[#1f2f45]' : 'text-[#536173] hover:bg-[#f5f8fb] hover:text-[#1f2f45]'
                    }`}
                    onClick={onClose}
                  >
                    <SidebarIcon icon={item.icon} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        {variant === 'dashboard' ? (
          <div className="mt-auto border-t border-mistSkyBlue/30 pt-4">
            <button
              type="button"
              onClick={() => {
                void handleLogout()
              }}
              className="flex w-full items-center justify-center rounded-xl border border-deepOceanNavy/25 px-4 py-2.5 text-sm font-semibold text-deepOceanNavy transition-colors hover:bg-[#f5f8fb]"
            >
              로그아웃
            </button>
          </div>
        ) : null}
      </aside>
    </>
  )
}

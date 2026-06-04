import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/bootsignal_transparent.png'
import { clearAuthSession, getAuthSession, isAdminRole } from '../../services/auth'

const communityLinks = ['게시판', 'Q&A', '모집', '아티클']

const userMenuLinks = [
  { label: '대시보드', to: '/dashboard' },
  { label: '찜 목록', to: '/dashboard/favorites' },
  { label: '내가 쓴 글', to: '/dashboard/posts' },
  { label: '일정', to: '/dashboard/schedule' },
  { label: '내 정보', to: '/dashboard/profile' },
  { label: '문의', to: '/dashboard/inquiries' },
  { label: 'AI 포트폴리오', to: '/dashboard/portfolio' },
]

const adminMenuLinks = [
  { label: '대시보드', to: '/admin' },
  { label: '리뷰 관리', to: '/admin/reviews' },
  { label: '인증 관리', to: '/admin/certifications' },
  { label: '문의 관리', to: '/admin/inquiries' },
  { label: '신고내역', to: '/admin/reports' },
  { label: '공지', to: '/admin/notices' },
]

export type HeaderVariant = 'site' | 'shell'

interface HeaderProps {
  isLoggedIn?: boolean
  nickname?: string
  /** shell: 대시보드·관리자 레이아웃(로고 없음, h-24, px-10) */
  variant?: HeaderVariant
  fixed?: boolean
}

function ChevronDownIcon({ open = false, size = 'sm' }: { open?: boolean; size?: 'sm' | 'md' }) {
  if (size === 'md') {
    return (
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    )
  }

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      aria-hidden="true"
    >
      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  )
}

function UserIcon({ filled = false }: { filled?: boolean }) {
  if (filled) {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="shrink-0" aria-hidden="true">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.3" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  )
}

export default function Header({
  isLoggedIn: isLoggedInProp,
  nickname: nicknameProp,
  variant = 'site',
  fixed = true,
}: HeaderProps) {
  const navigate = useNavigate()
  const session = getAuthSession()
  const isLoggedIn = isLoggedInProp ?? Boolean(session?.accessToken)
  const nickname = nicknameProp ?? session?.user?.nickname ?? '닉네임'
  const [communityOpen, setCommunityOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const profileMenuLinks = isAdminRole(session?.user?.role) ? adminMenuLinks : userMenuLinks
  const isShell = variant === 'shell'

  const handleLogout = () => {
    clearAuthSession()
    navigate('/', { replace: true })
  }

  const headerPositionClass = fixed ? 'fixed left-0 right-0 top-0' : 'relative'

  const navLinkClass = isShell
    ? 'transition-colors hover:text-[#5484B7]'
    : 'font-pretendard text-base font-semibold text-deepOceanNavy transition-colors hover:text-waterlineBlue'

  const communityButtonClass = isShell
    ? 'flex items-center gap-1 transition-colors hover:text-[#5484B7]'
    : 'font-pretendard flex items-center gap-1 text-base font-semibold text-deepOceanNavy transition-colors hover:text-waterlineBlue'

  const dropdownItemClass = isShell
    ? 'block px-4 py-2 text-center text-sm text-[#24354d] transition-colors hover:bg-[#f5f8fb]'
    : 'font-pretendard block px-4 py-2 text-center text-sm text-deepOceanNavy transition-colors hover:bg-foamWhite'

  const logoutButtonClass = isShell
    ? 'w-full rounded border border-[#344A64] px-3 py-1.5 text-sm text-[#344A64] transition-colors hover:bg-[#f5f8fb]'
    : 'font-pretendard w-full rounded border border-deepOceanNavy px-3 py-1.5 text-sm text-deepOceanNavy transition-colors hover:bg-foamWhite'

  const mainNav = (
    <nav
      className={`flex items-center ${isShell ? 'gap-12 text-base font-semibold text-[#24354d]' : 'justify-end gap-10'}`}
      aria-label={isShell ? '상단 메뉴' : '주요 메뉴'}
    >
      <Link to="/courses" className={navLinkClass}>
        과정 조회
      </Link>

      <div className="relative">
        <button
          type="button"
          onClick={() => setCommunityOpen((open) => !open)}
          onBlur={() => setTimeout(() => setCommunityOpen(false), 150)}
          className={communityButtonClass}
        >
          커뮤니티
          <ChevronDownIcon open={communityOpen} size={isShell ? 'md' : 'sm'} />
        </button>

        {communityOpen ? (
          <div
            className={`absolute left-1/2 top-full mt-2 w-28 -translate-x-1/2 rounded-lg border border-gray-100 bg-white py-1 shadow-lg ${
              isShell ? 'z-50' : ''
            }`}
          >
            {communityLinks.map((item) => (
              <a key={item} href={`/community/${item}`} className={dropdownItemClass}>
                {item}
              </a>
            ))}
          </div>
        ) : null}
      </div>

      <a href="/support" className={navLinkClass}>
        고객센터
      </a>
    </nav>
  )

  const userActions = isLoggedIn ? (
    <div className={`relative flex items-center ${isShell ? 'ml-14 gap-6 text-[#7b8795]' : 'gap-4'}`}>
      <button
        type="button"
        aria-label="알림"
        className={`relative transition-colors ${isShell ? 'hover:text-[#344A64]' : 'text-deepOceanNavy hover:text-waterlineBlue'}`}
      >
        {isShell ? <BellIcon /> : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
        )}
        <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#f06f64]" />
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={() => setUserMenuOpen((open) => !open)}
          onBlur={() => setTimeout(() => setUserMenuOpen(false), 150)}
          className={
            isShell
              ? 'flex items-center gap-2 text-base font-semibold text-[#5c6878] transition-colors hover:text-[#344A64]'
              : 'font-pretendard flex max-w-full items-center gap-2 text-base font-semibold text-deepOceanNavy transition-colors hover:text-waterlineBlue'
          }
        >
          <UserIcon filled={!isShell} />
          <span className={isShell ? undefined : 'truncate'}>{nickname}</span>
          <ChevronDownIcon open={userMenuOpen} size={isShell ? 'md' : 'sm'} />
        </button>

        {userMenuOpen ? (
          <div className={`absolute right-0 top-full mt-2 w-40 rounded-lg border border-gray-100 bg-white py-1 shadow-lg ${isShell ? 'z-50' : ''}`}>
            {profileMenuLinks.map((item) => (
              <Link key={item.label} to={item.to} className={dropdownItemClass} onClick={() => setUserMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="mt-1 border-t border-gray-100 px-3 pb-1 pt-1">
              <button type="button" onClick={handleLogout} className={logoutButtonClass}>
                로그아웃
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  ) : (
    <div className={`flex items-center ${isShell ? 'ml-14 gap-6' : 'gap-3'}`}>
      <Link
        to="/signup"
        className={
          isShell
            ? 'inline-flex min-w-[96px] items-center justify-center rounded border border-[#344A64] bg-white px-5 py-2 text-sm font-semibold text-[#344A64] transition-colors hover:bg-[#f5f8fb]'
            : 'font-pretendard inline-flex min-w-[96px] items-center justify-center whitespace-nowrap rounded border border-deepOceanNavy bg-white px-5 py-2 text-center text-sm font-semibold text-deepOceanNavy transition-colors hover:border-waterlineBlue hover:bg-waterlineBlue hover:text-white'
        }
      >
        회원가입
      </Link>
      <Link
        to="/login"
        className={
          isShell
            ? 'inline-flex min-w-[96px] items-center justify-center rounded border border-[#344A64] bg-[#344A64] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#5484B7]'
            : 'font-pretendard inline-flex min-w-[96px] items-center justify-center whitespace-nowrap rounded border border-[#344A64] bg-[#344A64] px-5 py-2 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:border-waterlineBlue hover:bg-waterlineBlue'
        }
      >
        로그인
      </Link>
    </div>
  )

  if (isShell) {
    return (
      <header className={`flex h-24 items-center justify-end bg-white px-10 ${headerPositionClass}`}>
        {mainNav}
        {userActions}
      </header>
    )
  }

  return (
    <header className={`site-header z-50 w-full min-w-desktop bg-[#fbfbfb] px-6 md:px-12 ${headerPositionClass}`}>
      <div className="mx-auto flex h-20 w-full max-w-desktop-content items-center justify-between">
        <Link to="/" aria-label="BootSignal 홈">
          <img src={logo} alt="BootSignal" className="h-11 w-auto" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {mainNav}
          {userActions}
        </div>
      </div>
    </header>
  )
}

import { useState } from 'react'
import logo from '../../assets/bootsignal_transparent.png'
import { clearAuthSession, getAuthSession } from '../../services/auth'

const communityLinks = ['게시판', 'Q&A', '모집', '아티클']
const userMenuLinks = [
  { label: '대시보드', href: '/dashboard' },
  { label: '찜 목록', href: '/my/favorites' },
  { label: '내가 쓴 글', href: '/my/posts' },
  { label: '일정', href: '/my/schedule' },
  { label: '내 정보', href: '/my/profile' },
  { label: '문의', href: '/my/inquiries' },
  { label: 'AI 포트폴리오', href: '/my/portfolio' },
]

interface HeaderProps {
  isLoggedIn?: boolean
  nickname?: string
}

function ChevronDownIcon({ open = false }: { open?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true">
      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Header({ isLoggedIn: isLoggedInProp, nickname: nicknameProp }: HeaderProps) {
  const session = getAuthSession()
  const isLoggedIn = isLoggedInProp ?? Boolean(session?.accessToken)
  const nickname = nicknameProp ?? session?.user?.nickname ?? '닉네임'
  const [communityOpen, setCommunityOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const isHomePage = typeof window !== 'undefined' && window.location.pathname === '/'
  const homeLink = isHomePage ? '#hero' : '/#hero'
  const courseLink = isHomePage ? '#courses' : '/#courses'

  const handleLogout = () => {
    clearAuthSession()
    window.location.href = '/'
  }

  return (
    <header className="site-header fixed left-0 right-0 top-0 z-50 w-full min-w-desktop bg-[#fbfbfb] px-6 md:px-12">
      <div className="mx-auto flex h-20 w-full max-w-desktop-content items-center justify-between">
        <a href={homeLink} aria-label="BootSignal 홈">
          <img src={logo} alt="BootSignal" className="h-11 w-auto" />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex items-center justify-end gap-10" aria-label="주요 메뉴">
            <a href={courseLink} className="font-pretendard text-base font-semibold text-deepOceanNavy transition-colors hover:text-waterlineBlue">
              과정 조회
            </a>

            <div className="relative">
              <button
                type="button"
                onClick={() => setCommunityOpen((open) => !open)}
                onBlur={() => setTimeout(() => setCommunityOpen(false), 150)}
                className="font-pretendard flex items-center gap-1 text-base font-semibold text-deepOceanNavy transition-colors hover:text-waterlineBlue"
              >
                커뮤니티
                <ChevronDownIcon open={communityOpen} />
              </button>

              {communityOpen ? (
                <div className="absolute left-1/2 top-full mt-2 w-28 -translate-x-1/2 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
                  {communityLinks.map((item) => (
                    <a key={item} href={`/community/${item}`} className="font-pretendard block px-4 py-2 text-center text-sm text-deepOceanNavy transition-colors hover:bg-foamWhite">
                      {item}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            <a href="/support" className="font-pretendard text-base font-semibold text-deepOceanNavy transition-colors hover:text-waterlineBlue">
              고객센터
            </a>
          </nav>

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <button type="button" aria-label="알림" className="relative text-deepOceanNavy transition-colors hover:text-waterlineBlue">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
                <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#f06f64]" />
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((open) => !open)}
                  onBlur={() => setTimeout(() => setUserMenuOpen(false), 150)}
                  className="font-pretendard flex max-w-full items-center gap-2 text-base font-semibold text-deepOceanNavy transition-colors hover:text-waterlineBlue"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="shrink-0" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="truncate">{nickname}</span>
                  <ChevronDownIcon open={userMenuOpen} />
                </button>

                {userMenuOpen ? (
                  <div className="absolute right-0 top-full mt-2 w-40 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
                    {userMenuLinks.map((item) => (
                      <a key={item.label} href={item.href} className="font-pretendard block px-4 py-2 text-center text-sm text-deepOceanNavy transition-colors hover:bg-foamWhite">
                        {item.label}
                      </a>
                    ))}
                    <div className="mt-1 border-t border-gray-100 px-3 pb-1 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="font-pretendard w-full rounded border border-deepOceanNavy px-3 py-1.5 text-sm text-deepOceanNavy transition-colors hover:bg-foamWhite"
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <a
                href="/signup"
                className="font-pretendard inline-flex min-w-[96px] items-center justify-center whitespace-nowrap rounded border border-deepOceanNavy bg-white px-5 py-2 text-center text-sm font-semibold text-deepOceanNavy transition-colors hover:border-waterlineBlue hover:bg-waterlineBlue hover:text-white"
              >
                회원가입
              </a>
              <a
                href="/login"
                className="font-pretendard inline-flex min-w-[96px] items-center justify-center whitespace-nowrap rounded border border-[#344A64] bg-[#344A64] px-5 py-2 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:border-waterlineBlue hover:bg-waterlineBlue"
              >
                로그인
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

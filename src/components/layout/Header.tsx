import { useState } from 'react'
import logo from '../../assets/bootsignal_transparent.png'

const communityLinks = ['게시판', 'Q&A', '모집', '아티클']
const userMenuLinks = ['대시보드', '찜 목록', '내가 쓴 글', '일정', '내 정보', '문의', 'AI 포트폴리오']

interface HeaderProps {
  isLoggedIn?: boolean
  nickname?: string
}

export default function Header({ isLoggedIn = false, nickname = '닉네임' }: HeaderProps) {
  const [communityOpen, setCommunityOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <header className="fixed left-0 right-0 top-0 z-50 w-full bg-transparent px-6 md:px-12">
      <div className="mx-auto flex h-24 w-full items-center justify-between">
      {/* Logo */}
      <a href="/">
        <img src={logo} alt="BootSignal" className="h-14 w-auto" />
      </a>

      {/* Nav */}
      <nav className="hidden items-center gap-14 md:flex">
        <a href="/courses" className="text-lg font-semibold text-deepOceanNavy hover:text-waterlineBlue transition-colors font-pretendard">
          과정 조회
        </a>

        {/* 커뮤니티 dropdown */}
        <div className="relative">
          <button
            onClick={() => setCommunityOpen(!communityOpen)}
            onBlur={() => setTimeout(() => setCommunityOpen(false), 150)}
            className="flex items-center gap-1 text-lg font-semibold text-deepOceanNavy hover:text-waterlineBlue transition-colors font-pretendard"
          >
            커뮤니티
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
              className={`transition-transform duration-200 ${communityOpen ? 'rotate-180' : ''}`}>
              <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {communityOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-28 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
              {communityLinks.map((item) => (
                <a key={item} href={`/community/${item}`}
                  className="block px-4 py-2 text-sm text-deepOceanNavy hover:bg-foamWhite transition-colors font-pretendard text-center">
                  {item}
                </a>
              ))}
            </div>
          )}
        </div>

        <a href="/support" className="text-lg font-semibold text-deepOceanNavy hover:text-waterlineBlue transition-colors font-pretendard">
          고객센터
        </a>

        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            {/* 알림 벨 */}
            <button className="relative text-deepOceanNavy hover:text-waterlineBlue transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zm0 16a2 2 0 01-2-2h4a2 2 0 01-2 2z" />
              </svg>
            </button>

            {/* 유저 메뉴 dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                onBlur={() => setTimeout(() => setUserMenuOpen(false), 150)}
                className="flex items-center gap-2 text-sm text-deepOceanNavy hover:text-waterlineBlue transition-colors font-pretendard"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                {nickname}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                  className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}>
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                  {userMenuLinks.map((item) => (
                    <a key={item} href={`/my/${item}`}
                      className="block px-4 py-2 text-sm text-deepOceanNavy hover:bg-foamWhite transition-colors font-pretendard text-center">
                      {item}
                    </a>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1 px-3 pb-1">
                    <button className="w-full text-sm px-3 py-1.5 rounded border border-deepOceanNavy text-deepOceanNavy hover:bg-foamWhite transition-colors font-pretendard">
                      로그아웃
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <a href="/signup"
              className="min-w-28 rounded border border-deepOceanNavy bg-white px-6 py-3 text-center text-base font-semibold text-deepOceanNavy hover:bg-deepOceanNavy hover:text-white transition-colors font-pretendard">
              회원가입
            </a>
            <a href="/login"
              className="min-w-28 rounded border border-transparent bg-deepOceanNavy px-6 py-3 text-center text-base font-semibold text-white hover:bg-waterlineBlue transition-colors font-pretendard">
              로그인
            </a>
          </div>
        )}
      </nav>
      </div>
    </header>
  )
}

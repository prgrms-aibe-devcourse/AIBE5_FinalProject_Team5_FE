import { useState } from 'react'
import logo from '../../assets/bootsignal_transparent.png'

const communityLinks = ['ê²Œì‹œ??, 'Q&A', 'ëª¨ì§‘', '?„í‹°??]
const userMenuLinks = ['?€?œë³´??, 'ì°?ëª©ë¡', '?´ê? ??ê¸€', '?¼ì •', '???•ë³´', 'ë¬¸ì˜', 'AI ?¬íŠ¸?´ë¦¬??]

interface HeaderProps {
  isLoggedIn?: boolean
  nickname?: string
}

/** ?¬ì´???ë‹¨ ?¤ë¹„ê²Œì´???¤ë” */
export default function Header({ isLoggedIn = false, nickname = '?‰ë„¤?? }: HeaderProps) {
  const [communityOpen, setCommunityOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <header className="fixed left-0 right-0 top-0 z-50 w-full bg-[#fbfbfb] px-6 md:px-12">
      <div className="mx-auto flex h-24 w-full max-w-desktop-content items-center justify-between">
      {/* Logo */}
      <a href="/">
        <img src={logo} alt="BootSignal" className="h-11 w-auto" />
      </a>

      {/* ?¤ë¹„ê²Œì´??ë°?(ë©”ë‰´) */}
      <nav className="hidden items-center gap-10 md:flex">
        <a href="/courses" className="text-base font-semibold text-deepOceanNavy hover:text-waterlineBlue transition-colors font-pretendard">
          ê³¼ì • ì¡°íšŒ
        </a>

        {/* ì»¤ë??ˆí‹° dropdown */}
        <div className="relative">
          <button
            onClick={() => setCommunityOpen(!communityOpen)}
            onBlur={() => setTimeout(() => setCommunityOpen(false), 150)}
            className="flex items-center gap-1 text-base font-semibold text-deepOceanNavy hover:text-waterlineBlue transition-colors font-pretendard"
          >
            ì»¤ë??ˆí‹°
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"
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

        <a href="/support" className="text-base font-semibold text-deepOceanNavy hover:text-waterlineBlue transition-colors font-pretendard">
          ê³ ê°?¼í„°
        </a>

        {/* ë¡œê·¸???¬ë????°ë¥¸ ? ì? ë©”ë‰´ ??ê³ ì • ?ˆë¹„ë¡?nav ?œí”„??ë°©ì? */}
        <div className="flex w-56 shrink-0 items-center justify-end">
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            {/* ?Œë¦¼ ë²?*/}
            <button
              type="button"
              aria-label="?Œë¦¼"
              className="relative text-deepOceanNavy hover:text-waterlineBlue transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
            </button>

            {/* ? ì? ë©”ë‰´ dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                onBlur={() => setTimeout(() => setUserMenuOpen(false), 150)}
                className="flex max-w-full items-center gap-2 text-base font-semibold text-deepOceanNavy hover:text-waterlineBlue transition-colors font-pretendard"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="shrink-0">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="truncate">{nickname}</span>
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
                      ë¡œê·¸?„ì›ƒ
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <a href="/signup"
              className="min-w-24 rounded border border-deepOceanNavy bg-white px-5 py-2 text-center text-sm font-semibold text-deepOceanNavy hover:border-waterlineBlue hover:bg-waterlineBlue hover:text-white transition-colors font-pretendard">
              ?Œì›ê°€??
            </a>
            <a href="/login"
              className="min-w-24 rounded border border-transparent bg-deepOceanNavy px-5 py-2 text-center text-sm font-semibold text-white hover:bg-waterlineBlue transition-colors font-pretendard">
              ë¡œê·¸??
            </a>
          </div>
        )}
        </div>
      </nav>
      </div>
    </header>
  )
}

import { useLayoutEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { communitySections } from '../communitySections'

const navItems = Object.values(communitySections)

export default function CommunityTabs() {
  const { pathname } = useLocation()
  const containerRef = useRef<HTMLDivElement>(null)
  const activeButtonRef = useRef<HTMLAnchorElement>(null)
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const el = activeButtonRef.current
    const container = containerRef.current
    if (!el || !container) return
    const cr = container.getBoundingClientRect()
    const er = el.getBoundingClientRect()
    setIndicator({ left: er.left - cr.left, width: er.width })
  }, [pathname])

  return (
    <nav aria-label="커뮤니티 메뉴" role="tablist">
      <div
        ref={containerRef}
        className="relative inline-flex items-center gap-1 rounded-2xl border border-mistSkyBlue/40 bg-white/40 p-1.5 shadow-[0_4px_20px_rgba(52,74,100,0.10)] backdrop-blur-md"
      >
        {/* 슬라이딩 인디케이터 */}
        <span
          className="pointer-events-none absolute top-1.5 h-[calc(100%-0.75rem)] rounded-xl bg-deepOceanNavy shadow-[0_2px_8px_rgba(52,74,100,0.22)] transition-all duration-200 ease-out"
          style={{ left: indicator.left, width: indicator.width }}
          aria-hidden="true"
        />

        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.listPath)
          return (
            <NavLink
              key={item.listPath}
              to={item.listPath}
              role="tab"
              ref={isActive ? activeButtonRef : null}
              className={`relative z-10 whitespace-nowrap rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors duration-150 md:px-8 md:text-base ${
                isActive
                  ? 'text-white'
                  : 'text-deepOceanNavy/60 hover:text-deepOceanNavy'
              }`}
            >
              {item.label}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

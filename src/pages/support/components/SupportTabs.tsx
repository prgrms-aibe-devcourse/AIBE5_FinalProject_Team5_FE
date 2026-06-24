import { useLayoutEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const supportTabs = [
  { label: '공지사항', path: '/support/notices' },
  { label: '과정 인증 가이드', path: '/support/certification' },
] as const

export default function SupportTabs() {
  const { pathname } = useLocation()
  const containerRef = useRef<HTMLDivElement>(null)
  const activeButtonRef = useRef<HTMLAnchorElement>(null)
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const el = activeButtonRef.current
      const container = containerRef.current
      if (!el || !container) return
      const cr = container.getBoundingClientRect()
      const er = el.getBoundingClientRect()
      setIndicator({ left: er.left - cr.left, width: er.width })
    }

    updateIndicator()
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [pathname])

  return (
    <nav aria-label="고객센터 메뉴" role="tablist" className="w-full sm:w-auto">
      <div
        ref={containerRef}
        className="relative flex w-full items-stretch gap-0.5 rounded-2xl border border-mistSkyBlue/40 bg-white/40 p-1 shadow-[0_4px_20px_rgba(52,74,100,0.10)] backdrop-blur-md sm:inline-flex sm:w-auto sm:items-center sm:gap-1 sm:p-1.5"
      >
        <span
          className="pointer-events-none absolute top-1 h-[calc(100%-0.5rem)] rounded-xl bg-deepOceanNavy shadow-[0_2px_8px_rgba(52,74,100,0.22)] transition-all duration-200 ease-out sm:top-1.5 sm:h-[calc(100%-0.75rem)]"
          style={{ left: indicator.left, width: indicator.width }}
          aria-hidden="true"
        />

        {supportTabs.map((item) => {
          const isActive = pathname.startsWith(item.path)
          return (
            <NavLink
              key={item.path}
              to={item.path}
              role="tab"
              ref={isActive ? activeButtonRef : null}
              className={`relative z-10 min-w-0 flex-1 rounded-xl px-1 py-2 text-center text-xs font-semibold leading-tight transition-colors duration-150 sm:flex-none sm:whitespace-nowrap sm:px-6 sm:py-2.5 sm:text-sm md:px-8 md:text-base ${
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

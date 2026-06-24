import { useLayoutEffect, useRef, useState } from 'react'

export type TabItem<T extends string> = {
  key: T
  label: string
}

type TabsProps<T extends string> = {
  tabs: TabItem<T>[]
  activeTab: T
  onTabChange: (tab: T) => void
  ariaLabel: string
  /** 제공 시 탭 라벨 옆에 건수 표시 */
  tabCounts?: Record<T, number>
  className?: string
}

export default function Tabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  ariaLabel,
  tabCounts,
  className = '',
}: TabsProps<T>) {
  const showCounts = tabCounts != null
  const containerRef = useRef<HTMLDivElement>(null)
  const activeButtonRef = useRef<HTMLButtonElement>(null)
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const el = activeButtonRef.current
    const container = containerRef.current
    if (!el || !container) return
    const cr = container.getBoundingClientRect()
    const er = el.getBoundingClientRect()
    setIndicator({ left: er.left - cr.left, width: er.width })
  }, [activeTab])

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex max-w-full flex-wrap justify-end gap-0.5 rounded-2xl border border-mistSkyBlue/40 bg-white/40 p-1 shadow-[0_4px_20px_rgba(52,74,100,0.10)] backdrop-blur-md sm:gap-1 sm:p-1.5 ${className}`.trim()}
      role="tablist"
      aria-label={ariaLabel}
    >
      {/* 슬라이딩 인디케이터 */}
      <span
        className="pointer-events-none absolute top-1.5 h-[calc(100%-0.75rem)] rounded-xl bg-deepOceanNavy shadow-[0_2px_8px_rgba(52,74,100,0.22)] transition-all duration-200 ease-out"
        style={{ left: indicator.left, width: indicator.width }}
        aria-hidden="true"
      />

      {tabs.map((tab) => {
        const isActive = activeTab === tab.key
        const count = tabCounts?.[tab.key]

        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            ref={isActive ? activeButtonRef : null}
            onClick={() => onTabChange(tab.key)}
            className={`relative z-10 whitespace-nowrap rounded-xl px-2.5 py-1.5 font-pretendard text-xs font-semibold transition-colors duration-150 sm:px-4 sm:py-2.5 sm:text-sm ${
              isActive
                ? 'text-white'
                : 'text-deepOceanNavy/60 hover:text-deepOceanNavy'
            }`}
          >
            {tab.label}
            {showCounts ? (
              <span className={`ml-1.5 tabular-nums ${isActive ? 'text-white/80' : 'text-softAquaBlue'}`}>
                {count}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

import { useLayoutEffect, useRef, useState } from 'react'

export type CourseDetailTab = 'info' | 'reviews'

interface CourseDetailTabsProps {
  activeTab: CourseDetailTab
  onTabChange: (tab: CourseDetailTab) => void
}

const TABS: { id: CourseDetailTab; label: string; disabled?: boolean }[] = [
  { id: 'info', label: '과정 정보' },
  { id: 'reviews', label: '후기' },
]

export default function CourseDetailTabs({ activeTab, onTabChange }: CourseDetailTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLButtonElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const el = activeRef.current
    const container = containerRef.current
    if (!el || !container) return
    const containerRect = container.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    setIndicatorStyle({
      left: elRect.left - containerRect.left,
      width: elRect.width,
    })
  }, [activeTab])

  return (
    <div className="flex items-center" role="tablist" aria-label="과정 상세 탭">
      <div
        ref={containerRef}
        className="relative flex items-center gap-1 rounded-2xl border border-mistSkyBlue/40 bg-white/40 p-1.5 shadow-[0_4px_20px_rgba(52,74,100,0.10)] backdrop-blur-md"
      >
        {/* 슬라이딩 인디케이터 */}
        <span
          className="pointer-events-none absolute top-1.5 h-[calc(100%-0.75rem)] rounded-xl bg-deepOceanNavy shadow-[0_2px_8px_rgba(52,74,100,0.22)] transition-all duration-200 ease-out"
          style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          aria-hidden="true"
        />

        {TABS.map(({ id, label, disabled }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              ref={isActive ? activeRef : null}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-disabled={disabled}
              disabled={disabled}
              onClick={() => !disabled && onTabChange(id)}
              className={`relative z-10 whitespace-nowrap rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors duration-150 md:px-8 md:text-base ${
                isActive
                  ? 'text-white'
                  : disabled
                    ? 'cursor-not-allowed text-mistSkyBlue/50'
                    : 'text-deepOceanNavy/60 hover:text-deepOceanNavy'
              }`}
            >
              {label}
              {disabled ? <span className="ml-1.5 text-xs font-normal opacity-60">(준비 중)</span> : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

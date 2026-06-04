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

// 탭 컴포넌트
export default function Tabs<T extends string>({
  tabs, // 탭 목록
  activeTab, // 활성화 탭
  onTabChange, // 탭 변경
  ariaLabel, // 탭 라벨
  tabCounts, // 탭 카운트
  className = '', // 탭 컨테이너 클래스
}: TabsProps<T>) {
  const showCounts = tabCounts != null

  return (
    <div
      className={`inline-flex flex-wrap gap-1 rounded-2xl border border-mistSkyBlue/45 bg-white p-1.5 shadow-[0_1px_2px_rgba(52,74,100,0.04)] ${className}`.trim()}
      role="tablist"
      aria-label={ariaLabel}
    >
      {/* 탭 목록 반복 처리 */}
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key
        const count = tabCounts?.[tab.key]

        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.key)}
            className={`rounded-xl px-4 py-2.5 font-pretendard text-sm font-semibold transition-all ${
              isActive
                ? 'bg-gradient-to-r from-mistSkyBlue/55 via-softAquaBlue/40 to-mistSkyBlue/45 text-deepOceanNavy shadow-[0_1px_3px_rgba(52,74,100,0.06)]'
                : 'text-secondary hover:bg-foamWhite/80 hover:text-deepOceanNavy'
            }`}
          >
            {tab.label}
            {showCounts ? (
              <span className={`ml-1.5 tabular-nums ${isActive ? 'text-waterlineBlue' : 'text-softAquaBlue'}`}>
                {count}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

export type CourseDetailTab = 'info' | 'reviews'

interface CourseDetailTabsProps {
  activeTab: CourseDetailTab
  onTabChange: (tab: CourseDetailTab) => void
}

const TABS: { id: CourseDetailTab; label: string; disabled?: boolean }[] = [
  { id: 'info', label: '과정 정보' },
  { id: 'reviews', label: '후기', disabled: true },
]

export default function CourseDetailTabs({ activeTab, onTabChange }: CourseDetailTabsProps) {
  return (
    <div className="flex gap-2 border-b border-mistSkyBlue/50" role="tablist" aria-label="과정 상세 탭">
      {TABS.map(({ id, label, disabled }) => { // 탭 목록 반복 처리
        const isActive = activeTab === id
        
        return ( // 탭 버튼 반환
          <button key={id} type="button" role="tab"
            aria-selected={isActive} // 활성화 상태 표시
            aria-disabled={disabled} disabled={disabled} // 비활성화 상태 표시
            onClick={() => !disabled && onTabChange(id)} // 탭 변경 감지 
            className={`rounded-t-lg px-5 py-3 text-base font-semibold transition-colors md:px-6 md:text-lg ${
              isActive // 활성화 상태 여부 
                ? 'bg-gradient-to-r from-mistSkyBlue/55 via-softAquaBlue/40 to-mistSkyBlue/45 text-deepOceanNavy'
                : disabled // 비활성화 상태 여부 
                  ? 'cursor-not-allowed text-softAquaBlue/80'
                  : 'text-secondary hover:bg-foamWhite/80 hover:text-deepOceanNavy'
            }`}
          >
            {label} {/* 탭 라벨 */}
            {disabled ? ( // 비활성화 상태 여부 표시
              <span className="ml-1.5 text-sm font-normal text-softAquaBlue">(준비 중)</span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

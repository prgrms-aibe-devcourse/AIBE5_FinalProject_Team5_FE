import type { StatusTab } from '../../AdminCertificationsPage'

const STATUS_TABS: { key: StatusTab; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'PENDING', label: '대기' },
  { key: 'APPROVED', label: '승인' },
  { key: 'REJECTED', label: '반려' },
]

type CertificationStatusTabsProps = {
  activeTab: StatusTab
  tabCounts: Record<StatusTab, number>
  onTabChange: (tab: StatusTab) => void
}

// 관리자 인증 관리 상태 탭
export default function CertificationStatusTabs({
  activeTab,
  tabCounts,
  onTabChange,
}: CertificationStatusTabsProps) {
  return (
    <div
      className="mb-5 inline-flex flex-wrap gap-1 rounded-2xl border border-mistSkyBlue/45 bg-white p-1.5 shadow-[0_1px_2px_rgba(52,74,100,0.04)]"
      role="tablist"
      aria-label="인증 요청 상태 필터"
    >
      {STATUS_TABS.map((tab) => { // 인증 요청 상태 탭 목록을 순회하며 탭 버튼 생성
        const isActive = activeTab === tab.key
        const count = tabCounts[tab.key]

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
            <span className={`ml-1.5 tabular-nums ${isActive ? 'text-waterlineBlue' : 'text-softAquaBlue'}`}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

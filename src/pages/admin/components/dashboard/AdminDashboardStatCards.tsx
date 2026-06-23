import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { adminStatCards, type AdminStatCardIcon } from '../../data/adminDashboardData'

const dashboardIconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

// 관리자 통계 카드 아이콘
function StatCardIcon({ icon }: { icon: AdminStatCardIcon }) {
  switch (icon) {
    case 'users':
      return (
        <svg {...dashboardIconProps} aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="3.2" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    case 'auth':
      return (
        <svg {...dashboardIconProps} aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="12" cy="11" r="2.5" />
          <path d="M8 18v-1a4 4 0 0 1 8 0v1" />
        </svg>
      )
    case 'inquiry':
      return (
        <svg {...dashboardIconProps} aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    case 'report':
      return (
        <svg {...dashboardIconProps} aria-hidden="true">
          <path d="M4 4h16l-6.5 9.5V20l-3-1.5v-5.5z" />
        </svg>
      )
  }
}

type StatCardProps = {
  label: string // 통계 카드 라벨
  value: string // 통계 카드 값
  icon: ReactNode // 통계 카드 아이콘
  iconWrapClass: string // 통계 카드 아이콘 랩 클래스
  to?: string // 통계 카드 링크
}

// 관리자 통계 카드
function StatCard({ label, value, icon, iconWrapClass, to }: StatCardProps) {
  const body = (
    <article className="glass-panel flex h-full flex-col rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-pretendard text-sm font-semibold text-[#64748b]">{label}</p>
          <p className="mt-2 font-pretendard text-3xl font-bold tracking-tight text-deepOceanNavy">{value}</p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconWrapClass}`}>
          {icon}
        </div>
      </div>
    </article>
  )

  if (to) { // 통계 카드 링크가 있으면 링크로 감싸기
    return (
      <Link to={to} className="block flex-1">
        {body}
      </Link>
    )
  }

  return <div className="flex-1">{body}</div>
}

// 관리자 대시보드 통계 카드 영역
export default function AdminDashboardStatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {adminStatCards.map((card) => ( // 관리자 통계 카드 데이터를 순회하며 통계 카드 컴포넌트 생성
        <StatCard
          key={card.label}
          label={card.label}
          value={card.value}
          iconWrapClass={card.iconWrapClass}
          to={card.to}
          icon={<StatCardIcon icon={card.icon} />}
        />
      ))}
    </div>
  )
}

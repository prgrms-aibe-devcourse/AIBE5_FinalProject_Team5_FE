import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { AdminDashboardSummary } from '../../../../services/admin'

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

type StatCardIconName = 'users' | 'course' | 'auth' | 'review' | 'report'

function StatCardIcon({ icon }: { icon: StatCardIconName }) {
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
    case 'course':
      return (
        <svg {...dashboardIconProps} aria-hidden="true">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
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
    case 'review':
      return (
        <svg {...dashboardIconProps} aria-hidden="true">
          <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.3L12 14.8 6.2 17l.9-5.3L3.2 7.7l5.4-.8z" />
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
  label: string
  value: string
  icon: ReactNode
  iconWrapClass: string
  to?: string
}

function StatCard({ label, value, icon, iconWrapClass, to }: StatCardProps) {
  const body = (
    <article className="glass-panel group flex h-full flex-col rounded-2xl p-5 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(30,58,95,0.12)] hover:ring-1 hover:ring-waterlineBlue/30">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-pretendard text-sm font-semibold text-[#64748b] transition-colors duration-200 group-hover:text-deepOceanNavy">
            {label}
          </p>
          <p className="mt-2 font-pretendard text-3xl font-bold tracking-tight text-deepOceanNavy transition-colors duration-200 group-hover:text-waterlineBlue">
            {value}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 ${iconWrapClass}`}
        >
          {icon}
        </div>
      </div>
    </article>
  )

  if (to) {
    return (
      <Link to={to} className="block flex-1 active:scale-[0.99]">
        {body}
      </Link>
    )
  }

  return <div className="flex-1">{body}</div>
}

type StatCardConfig = {
  label: string
  value: number
  iconWrapClass: string
  icon: StatCardIconName
  to?: string
}

function buildStatCards(summary: AdminDashboardSummary): StatCardConfig[] {
  return [
    {
      label: '전체 회원',
      value: summary.userCount,
      iconWrapClass: 'bg-foamWhite text-deepOceanNavy',
      icon: 'users',
    },
    {
      label: '전체 과정',
      value: summary.courseCount,
      iconWrapClass: 'bg-[#eef4fa] text-waterlineBlue',
      icon: 'course',
    },
    {
      label: '전체 리뷰',
      value: summary.reviewCount,
      iconWrapClass: 'bg-[#fef9ec] text-[#d97706]',
      icon: 'review',
    },
    {
      label: '대기 수료 인증',
      value: summary.pendingVerificationCount,
      iconWrapClass: 'bg-[#fff1eb] text-[#ea580c]',
      icon: 'auth',
      to: '/admin/certifications',
    },
    {
      label: '신고 건수',
      value: summary.reportCount,
      iconWrapClass: 'bg-[#fef2f2] text-[#dc2626]',
      icon: 'report',
      to: '/admin/reports',
    },
  ]
}

type AdminDashboardStatCardsProps = {
  summary: AdminDashboardSummary
}

export default function AdminDashboardStatCards({ summary }: AdminDashboardStatCardsProps) {
  const cards = buildStatCards(summary)

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map((card) => (
        <StatCard
          key={card.label}
          label={card.label}
          value={card.value.toLocaleString()}
          iconWrapClass={card.iconWrapClass}
          to={card.to}
          icon={<StatCardIcon icon={card.icon} />}
        />
      ))}
    </div>
  )
}

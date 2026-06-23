import { Link } from 'react-router-dom'
import StatusBadge from '../../admin/components/certification/StatusBadge'
import { formatRequestedDate } from '../../../utils/formatRequestedDate'
import type { UserCertificationRequest } from '../data/certifications'
import DashboardCard from './DashboardCard'
import DashboardCardEmptyState from './DashboardCardEmptyState'
import DashboardCardMoreLink from './DashboardCardMoreLink'

type DashboardCertificationHistoryCardProps = {
  requests: UserCertificationRequest[]
  isLoading?: boolean
}

export default function DashboardCertificationHistoryCard({
  requests,
  isLoading = false,
}: DashboardCertificationHistoryCardProps) {
  return (
    <DashboardCard
      title="인증 신청 이력"
      className="h-full"
      action={<DashboardCardMoreLink to="/dashboard/profile" ariaLabel="인증 신청 이력 전체 보기" />}
    >
      {isLoading ? (
        <DashboardCardEmptyState message="인증 신청 이력을 불러오는 중…" />
      ) : requests.length > 0 ? (
        <ul>
          {requests.map((request, index) => (
            <li
              key={request.id}
              className={index < requests.length - 1 ? 'border-b border-mistSkyBlue/25' : ''}
            >
              <Link
                to="/dashboard/profile"
                state={{ verificationId: request.id }}
                className="group flex items-start justify-between gap-3 py-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 font-pretendard text-sm font-semibold leading-snug text-deepOceanNavy transition-colors group-hover:text-waterlineBlue">
                    {request.courseName}
                  </p>
                  <p className="mt-1 font-pretendard text-xs text-secondary">
                    <time dateTime={request.requestedAt}>인증 요청일 {formatRequestedDate(request.requestedAt)}</time>
                  </p>
                </div>
                <StatusBadge status={request.status} />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <DashboardCardEmptyState message="인증 신청 이력이 없습니다." />
      )}
    </DashboardCard>
  )
}

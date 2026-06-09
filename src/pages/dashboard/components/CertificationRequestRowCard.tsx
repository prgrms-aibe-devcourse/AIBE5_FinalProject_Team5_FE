import StatusBadge from '../../admin/components/certification/StatusBadge'
import { formatRequestedDate } from '../../../utils/formatRequestedDate'
import type { UserCertificationRequest } from '../data/certifications'

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-softAquaBlue" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

type CertificationRequestRowCardProps = {
  request: UserCertificationRequest
  onViewDocuments?: (request: UserCertificationRequest) => void
}

export default function CertificationRequestRowCard({ request, onViewDocuments }: CertificationRequestRowCardProps) {
  const hasDocuments = request.documents.length > 0
  const isRejected = request.status === 'REJECTED'
  const canViewDetails = hasDocuments || (isRejected && Boolean(request.rejectReason))

  return (
    <article className="rounded-xl border border-mistSkyBlue/35 bg-white/55 p-4 shadow-[0_2px_8px_rgba(30,58,95,0.08)] backdrop-blur-sm font-pretendard sm:p-5">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-deepOceanNavy sm:text-[0.9375rem]">
            {request.courseName}
          </h3>
          <p className="mt-2 inline-flex items-center gap-1.5 font-pretendard text-xs text-primary/90">
            <CalendarIcon />
            <time dateTime={request.requestedAt}>인증 요청일 | {formatRequestedDate(request.requestedAt)}</time>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <StatusBadge status={request.status} />
          {canViewDetails && onViewDocuments ? (
            <button
              type="button"
              onClick={() => onViewDocuments(request)}
              className="inline-flex h-8 items-center rounded-lg border border-mistSkyBlue/60 bg-white px-3 font-pretendard text-xs font-semibold text-deepOceanNavy shadow-[0_1px_2px_rgba(52,74,100,0.05)] transition-all hover:border-waterlineBlue hover:bg-waterlineBlue hover:text-white hover:shadow-[0_2px_8px_rgba(84,132,183,0.22)]"
            >
              상세 보기
            </button>
          ) : null}
        </div>
      </div>
    </article>
  )
}

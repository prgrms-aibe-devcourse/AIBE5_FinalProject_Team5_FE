import type { CertificationStatus } from '../../AdminCertificationsPage'

const STATUS_LABEL: Record<CertificationStatus, string> = {
  PENDING: '대기',
  APPROVED: '승인',
  REJECTED: '반려',
}

const STATUS_BADGE: Record<
  CertificationStatus,
  { dot: string; wrap: string; text: string }
> = {
  PENDING: {
    dot: 'bg-[#94a3b8]',
    wrap: 'bg-[#f1f5f9] ring-1 ring-[#e2e8f0]',
    text: 'text-[#64748b]',
  },
  APPROVED: {
    dot: 'bg-[#22c55e]',
    wrap: 'bg-[#ecfdf3] ring-1 ring-[#bbf7d0]',
    text: 'text-[#15803d]',
  },
  REJECTED: {
    dot: 'bg-[#dc2626]',
    wrap: 'bg-red-50 ring-1 ring-red-200/80',
    text: 'text-[#b91c1c]',
  },
}

type StatusBadgeProps = {
  status: CertificationStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = STATUS_BADGE[status]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-pretendard text-xs font-semibold ${style.wrap} ${style.text}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  )
}

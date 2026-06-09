import type { UserInquiryStatus } from '../data/inquiries'

const STATUS_LABEL: Record<UserInquiryStatus, string> = {
  PENDING: '대기',
  COMPLETED: '완료',
}

const STATUS_BADGE: Record<UserInquiryStatus, { dot: string; wrap: string; text: string }> = {
  PENDING: {
    dot: 'bg-[#94a3b8]',
    wrap: 'bg-[#f1f5f9] ring-1 ring-[#e2e8f0]',
    text: 'text-[#64748b]',
  },
  COMPLETED: {
    dot: 'bg-[#22c55e]',
    wrap: 'bg-[#ecfdf3] ring-1 ring-[#bbf7d0]',
    text: 'text-[#15803d]',
  },
}

type InquiryStatusBadgeProps = {
  status: UserInquiryStatus
}

export default function InquiryStatusBadge({ status }: InquiryStatusBadgeProps) {
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

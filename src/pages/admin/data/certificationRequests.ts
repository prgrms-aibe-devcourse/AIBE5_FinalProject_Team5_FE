import type { StatusTab } from '../AdminCertificationsPage'

export const CERTIFICATION_STATUS_TABS: { key: StatusTab; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'PENDING', label: '대기' },
  { key: 'APPROVED', label: '승인' },
  { key: 'REJECTED', label: '반려' },
]

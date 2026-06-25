import type { Report, ReportStatusTab } from '../AdminReportsPage'

export const REPORT_STATUS_TABS: { key: ReportStatusTab; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'PENDING', label: '대기' },
  { key: 'COMPLETED', label: '처리완료' },
]

import type { Inquiry } from '../AdminInquiriesPage'

export const INQUIRY_STATUS_TABS: { key: Inquiry['status'] | 'ALL'; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'PENDING', label: '대기' },
  { key: 'COMPLETED', label: '완료' },
]

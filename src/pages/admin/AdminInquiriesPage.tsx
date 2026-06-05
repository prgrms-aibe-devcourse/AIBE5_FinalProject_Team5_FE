import { useEffect, useMemo, useState } from 'react'
import Pagination from '../../components/common/Pagination'
import AdminShell from './components/AdminShell'
import Tabs from '../../components/common/Tabs'
import AdminPageHeader from './components/AdminPageHeader'
import InquiryList from './components/inquiry/InquiryList'
import InquiryDetailModal from './components/modal/InquiryDetailModal'
import { INQUIRY_STATUS_TABS, initialInquiries } from './data/inquiries'

export type InquiryStatus = 'PENDING' | 'COMPLETED'

export type Inquiry = {
  id: number
  userName: string
  title: string
  status: InquiryStatus
  requestedAt: string
  content: string
  profileImageUrl?: string
  adminReply?: string
}

export type InquiryStatusTab = 'ALL' | InquiryStatus

export const PAGE_SIZE = 10

// 관리자 문의 관리 페이지
export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState(initialInquiries)
  const [viewId, setViewId] = useState<number | null>(null)
  const [statusTab, setStatusTab] = useState<InquiryStatusTab>('ALL')
  const [currentPage, setCurrentPage] = useState(1)

  const viewInquiry = useMemo(
    () => inquiries.find((item) => item.id === viewId) ?? null,
    [inquiries, viewId],
  )

  const tabCounts = useMemo(
    () => ({
      ALL: inquiries.length,
      PENDING: inquiries.filter((item) => item.status === 'PENDING').length,
      COMPLETED: inquiries.filter((item) => item.status === 'COMPLETED').length,
    }),
    [inquiries],
  )

  const filteredInquiries = useMemo(() => {
    if (statusTab === 'ALL') return inquiries
    return inquiries.filter((item) => item.status === statusTab)
  }, [inquiries, statusTab])

  const totalPages = Math.max(1, Math.ceil(filteredInquiries.length / PAGE_SIZE))

  const paginatedInquiries = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredInquiries.slice(start, start + PAGE_SIZE)
  }, [filteredInquiries, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [statusTab])

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  const completeInquiry = (id: number, reply: string) => {
    setInquiries((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'COMPLETED', adminReply: reply } : item,
      ),
    )
    setViewId(null)
  }

  return (
    <AdminShell>
      {/* 관리자 문의 관리 헤더 */}
      <AdminPageHeader title="문의 관리" className="mb-6" />

      {/* 관리자 문의 관리 상태 탭 */}
      <Tabs<InquiryStatusTab>
        tabs={INQUIRY_STATUS_TABS}
        activeTab={statusTab}
        tabCounts={tabCounts}
        onTabChange={setStatusTab}
        ariaLabel="문의 상태 필터"
        className="mb-5"
      />

      {/* 관리자 문의 관리 문의 리스트 */}
      <InquiryList
        inquiries={paginatedInquiries}
        isEmpty={filteredInquiries.length === 0}
        onView={setViewId}
      />

      {/* 관리자 문의 관리 문의 리스트 페이지네이션 */}
      {filteredInquiries.length > 0 ? (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} className="mt-6" />
      ) : null}

      {/* 관리자 문의 관리 문의 상세 모달 */}
      {viewInquiry ? (
        <InquiryDetailModal
          inquiry={viewInquiry}
          onClose={() => setViewId(null)}
          onComplete={completeInquiry}
        />
      ) : null}
    </AdminShell>
  )
}

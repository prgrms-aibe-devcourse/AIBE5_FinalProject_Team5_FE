import { useEffect, useMemo, useState } from 'react'
import Pagination from '../../components/common/Pagination'
import AdminShell from './components/AdminShell'
import AdminPageHeader from './components/AdminPageHeader'
import CertificationRequestList from './components/certification/CertificationRequestList'
import CertificationStatusTabs from './components/certification/CertificationStatusTabs'
import CertificationReviewModal from './components/modal/CertificationReviewModal'
import { initialCertificationRequests } from './data/certificationRequests'

export type CertificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export type ProofDocument = {
  id: number
  name: string
  uploadedAt: string
}

export type CertificationRequest = {
  id: number
  userName: string
  courseName: string
  status: CertificationStatus
  requestedAt: string
  documents: ProofDocument[]
  rejectReason?: string
}

export type StatusTab = 'ALL' | CertificationStatus

export const PAGE_SIZE = 10

export default function AdminCertificationsPage() {
  const [requests, setRequests] = useState(initialCertificationRequests)
  const [reviewId, setReviewId] = useState<number | null>(null)
  const [statusTab, setStatusTab] = useState<StatusTab>('ALL')
  const [currentPage, setCurrentPage] = useState(1)

  const reviewRequest = useMemo(
    () => requests.find((item) => item.id === reviewId) ?? null,
    [requests, reviewId],
  )

  const tabCounts = useMemo(
    () => ({
      ALL: requests.length,
      PENDING: requests.filter((item) => item.status === 'PENDING').length,
      APPROVED: requests.filter((item) => item.status === 'APPROVED').length,
      REJECTED: requests.filter((item) => item.status === 'REJECTED').length,
    }),
    [requests],
  )

  const filteredRequests = useMemo(() => {
    if (statusTab === 'ALL') return requests
    return requests.filter((item) => item.status === statusTab)
  }, [requests, statusTab])

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / PAGE_SIZE))

  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredRequests.slice(start, start + PAGE_SIZE)
  }, [filteredRequests, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [statusTab])

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  const updateStatus = (id: number, status: CertificationStatus, rejectReason?: string) => {
    setRequests((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              ...(status === 'REJECTED' && rejectReason ? { rejectReason } : {}),
              ...(status === 'APPROVED' ? { rejectReason: undefined } : {}),
            }
          : item,
      ),
    )
    setReviewId(null)
  }

  return (
    <AdminShell>
      {/* 관리자 인증 관리 헤더 */}
      <AdminPageHeader title="인증 관리" className="mb-6" />

      {/* 관리자 인증 관리 상태 탭 */}
      <CertificationStatusTabs activeTab={statusTab} tabCounts={tabCounts} onTabChange={setStatusTab} />

      {/* 관리자 인증 관리 요청 리스트 */}
      <CertificationRequestList
        requests={paginatedRequests}
        isEmpty={filteredRequests.length === 0}
        onReview={setReviewId}
      />

      {/* 관리자 인증 관리 요청 리스트 페이지네이션 */}
      {filteredRequests.length > 0 ? (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} className="mt-6" />
      ) : null}

      {/* 관리자 인증 관리 요청 리스트 모달 */}
      {reviewRequest ? (
        <CertificationReviewModal
          request={reviewRequest} // 관리자 인증 관리 요청 리스트 모달 요청
          onClose={() => setReviewId(null)} // 관리자 인증 관리 요청 리스트 모달 닫기
          onApprove={(id) => updateStatus(id, 'APPROVED')} // 관리자 인증 관리 요청 리스트 모달 승인
          onReject={(id, reason) => updateStatus(id, 'REJECTED', reason)} // 관리자 인증 관리 요청 리스트 모달 반려
        />
      ) : null}
    </AdminShell>
  )
}

import { useCallback, useEffect, useMemo, useState } from 'react'
import Pagination from '../../components/common/Pagination'
import Tabs from '../../components/common/Tabs'
import { ApiError } from '../../services/ApiError'
import { getAdminVerifications } from '../../services/verification'
import AdminShell from './components/AdminShell'
import AdminPageHeader from './components/AdminPageHeader'
import CertificationRequestList from './components/certification/CertificationRequestList'
import CertificationReviewModal from './components/modal/CertificationReviewModal'
import { CERTIFICATION_STATUS_TABS } from './data/certificationRequests'

import type { CertificationDocumentType } from '../../dashboard/data/certifications'

export type CertificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export type ProofDocument = {
  id: number
  name: string
  type: CertificationDocumentType
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

const INITIAL_TAB_COUNTS: Record<StatusTab, number> = {
  ALL: 0,
  PENDING: 0,
  APPROVED: 0,
  REJECTED: 0,
}

async function loadTabCounts(): Promise<Record<StatusTab, number>> {
  const base = { page: 0, size: 1 }
  const [all, pending, approved, rejected] = await Promise.all([
    getAdminVerifications(base),
    getAdminVerifications({ ...base, status: 'PENDING' }),
    getAdminVerifications({ ...base, status: 'APPROVED' }),
    getAdminVerifications({ ...base, status: 'REJECTED' }),
  ])

  return {
    ALL: all.totalElements,
    PENDING: pending.totalElements,
    APPROVED: approved.totalElements,
    REJECTED: rejected.totalElements,
  }
}

// 관리자 인증 관리 페이지 컴포넌트
export default function AdminCertificationsPage() {
  const [requests, setRequests] = useState<CertificationRequest[]>([])
  const [reviewId, setReviewId] = useState<number | null>(null)
  const [statusTab, setStatusTab] = useState<StatusTab>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [tabCounts, setTabCounts] = useState(INITIAL_TAB_COUNTS)
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const requestParams = useMemo(
    () => ({
      page: Math.max(0, currentPage - 1),
      size: PAGE_SIZE,
      ...(statusTab !== 'ALL' ? { status: statusTab } : {}),
    }),
    [currentPage, statusTab],
  )

  const refreshData = useCallback(() => {
    setRefreshKey((key) => key + 1)
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [statusTab])

  useEffect(() => {
    setIsLoading(true)
    setFetchError(null)

    getAdminVerifications(requestParams)
      .then((data) => {
        setRequests(data.content)
        setTotalPages(Math.max(1, data.totalPages))
        setTabCounts((prev) => ({ ...prev, [statusTab]: data.totalElements }))
      })
      .catch((err: unknown) => {
        setRequests([])
        setTotalPages(1)
        setFetchError(
          err instanceof ApiError ? err.message : '인증 신청 목록을 불러올 수 없습니다.',
        )
      })
      .finally(() => setIsLoading(false))
  }, [requestParams, statusTab, refreshKey])

  useEffect(() => {
    loadTabCounts()
      .then(setTabCounts)
      .catch(() => {
        // 탭 건수는 실패해도 목록은 별도로 동작하도록 무시
      })
  }, [refreshKey])

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  const handleProcessed = () => {
    refreshData()
  }

  const isEmpty = !isLoading && !fetchError && requests.length === 0

  return (
    <AdminShell>
      {/* 관리자 인증 관리 헤더 */}
      <AdminPageHeader title="인증 관리" className="mb-6" />

      {/* 관리자 인증 관리 상태 탭 */}
      <Tabs<StatusTab>
        tabs={CERTIFICATION_STATUS_TABS}
        activeTab={statusTab}
        tabCounts={tabCounts}
        onTabChange={setStatusTab}
        ariaLabel="인증 요청 상태 필터"
        className="mb-5"
      />

      {isLoading ? (
        <p className="py-20 text-center font-pretendard text-sm text-secondary">
          인증 신청 목록을 불러오는 중…
        </p>
      ) : fetchError ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-mistSkyBlue/35 bg-white/60 px-6 py-20 text-center shadow-[0_8px_32px_rgba(30,58,95,0.12)] backdrop-blur-md">
          <p className="font-pretendard text-sm font-semibold text-deepOceanNavy">{fetchError}</p>
        </div>
      ) : (
        <>
          {/* 관리자 인증 관리 요청 리스트 */}
          <CertificationRequestList
            requests={requests}
            isEmpty={isEmpty}
            onReview={setReviewId}
          />

          {/* 관리자 인증 관리 요청 리스트 페이지네이션 */}
          {requests.length > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="mt-6"
            />
          ) : null}
        </>
      )}

      {/* 관리자 인증 관리 요청 리스트 모달 */}
      {reviewId !== null ? (
        <CertificationReviewModal
          verificationId={reviewId}
          onClose={() => setReviewId(null)}
          onProcessed={handleProcessed}
        />
      ) : null}
    </AdminShell>
  )
}

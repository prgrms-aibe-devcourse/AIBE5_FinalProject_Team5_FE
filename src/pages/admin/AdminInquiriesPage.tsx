import { useCallback, useEffect, useMemo, useState } from 'react'
import Pagination from '../../components/common/Pagination'
import AdminShell from './components/AdminShell'
import Tabs from '../../components/common/Tabs'
import AdminPageHeader from './components/AdminPageHeader'
import InquiryList from './components/inquiry/InquiryList'
import InquiryDetailModal from './components/modal/InquiryDetailModal'
import { INQUIRY_STATUS_TABS } from './data/inquiries'
import { getAdminInquiries, answerInquiry } from '../../services/inquiry'
import { ApiError } from '../../services/ApiError'

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

const INITIAL_TAB_COUNTS: Record<InquiryStatusTab, number> = {
  ALL: 0,
  PENDING: 0,
  COMPLETED: 0,
}

async function loadTabCounts(): Promise<Record<InquiryStatusTab, number>> {
  const base = { page: 0, size: 1 }
  const [all, pending, completed] = await Promise.all([
    getAdminInquiries(base),
    getAdminInquiries({ ...base, status: 'PENDING' }),
    getAdminInquiries({ ...base, status: 'COMPLETED' }),
  ])

  return {
    ALL: all.totalElements,
    PENDING: pending.totalElements,
    COMPLETED: completed.totalElements,
  }
}

// 관리자 문의 관리 페이지
export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [viewId, setViewId] = useState<number | null>(null)
  const [statusTab, setStatusTab] = useState<InquiryStatusTab>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [tabCounts, setTabCounts] = useState(INITIAL_TAB_COUNTS)
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const viewInquiry = useMemo(
    () => inquiries.find((item) => item.id === viewId) ?? null,
    [inquiries, viewId],
  )

  const requestParams = useMemo(
    () => ({
      page: Math.max(0, currentPage - 1),
      size: PAGE_SIZE,
      status: statusTab,
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

    getAdminInquiries(requestParams)
      .then((data) => {
        const mapped: Inquiry[] = data.content.map((item) => ({
          id: item.inquiryId,
          userName: item.userNickname || item.userName || '사용자',
          title: item.title,
          status: item.status,
          requestedAt: item.requestedAt || '',
          content: item.content,
          profileImageUrl: item.profileImageUrl || undefined,
          adminReply: item.adminReply || undefined,
        }))
        setInquiries(mapped)
        setTotalPages(Math.max(1, data.totalPages))
        setTabCounts((prev) => ({ ...prev, [statusTab]: data.totalElements }))
      })
      .catch((err: unknown) => {
        setInquiries([])
        setTotalPages(1)
        setFetchError(
          err instanceof ApiError ? err.message : '문의 목록을 불러올 수 없습니다.',
        )
      })
      .finally(() => setIsLoading(false))
  }, [requestParams, statusTab, refreshKey])

  useEffect(() => {
    loadTabCounts()
      .then(setTabCounts)
      .catch(() => {})
  }, [refreshKey])

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  const completeInquiry = async (id: number, reply: string) => {
    try {
      await answerInquiry(id, { adminReply: reply })
      refreshData()
      setViewId(null)
    } catch (err: unknown) {
      alert(err instanceof ApiError ? err.message : '답변 등록에 실패했습니다.')
    }
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

      {isLoading ? (
        <p className="py-20 text-center font-pretendard text-sm text-secondary">
          문의 목록을 불러오는 중…
        </p>
      ) : fetchError ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-mistSkyBlue/35 bg-white/60 px-6 py-20 text-center shadow-[0_8px_32px_rgba(30,58,95,0.12)] backdrop-blur-md">
          <p className="font-pretendard text-sm font-semibold text-deepOceanNavy">{fetchError}</p>
        </div>
      ) : (
        <>
          {/* 관리자 문의 관리 문의 리스트 */}
          <InquiryList
            inquiries={inquiries}
            isEmpty={inquiries.length === 0}
            onView={setViewId}
          />

          {/* 관리자 문의 관리 문의 리스트 페이지네이션 */}
          {inquiries.length > 0 ? (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} className="mt-6" />
          ) : null}
        </>
      )}

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

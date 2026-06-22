import { useCallback, useEffect, useMemo, useState } from 'react'
import Pagination from '../../components/common/Pagination'
import Tabs from '../../components/common/Tabs'
import AdminShell from './components/AdminShell'
import AdminPageHeader from './components/AdminPageHeader'
import ReportList from './components/report/ReportList'
import ReportDetailModal from './components/modal/ReportDetailModal'
import { REPORT_STATUS_TABS } from './data/reports'
import { getAdminReports, processReport } from '../../services/report'
import { ApiError } from '../../services/ApiError'

export type ReportStatus = 'PENDING' | 'COMPLETED'

export type ReportContentAction = 'HIDE' | 'INVALID_REASON'

export type ReportType = 'REVIEW' | 'POST' | 'COMMENT'

export type Report = {
  id: number
  reporterName: string
  reportedAt: string
  type: ReportType
  /** 신고 대상 식별 (작성자·콘텐츠 요약) */
  targetLabel: string
  reasonCategory: string
  reasonDetail: string
  /** 신고된 콘텐츠 본문 */
  contentBody: string
  contentUrl: string
  status: ReportStatus
  profileImageUrl?: string
  contentAction?: ReportContentAction
}

export type ReportStatusTab = 'ALL' | ReportStatus

export const PAGE_SIZE = 10

const INITIAL_TAB_COUNTS: Record<ReportStatusTab, number> = {
  ALL: 0,
  PENDING: 0,
  COMPLETED: 0,
}

async function loadTabCounts(): Promise<Record<ReportStatusTab, number>> {
  const base = { page: 0, size: 1 }
  const [all, pending, completed] = await Promise.all([
    getAdminReports(base),
    getAdminReports({ ...base, status: 'PENDING' }),
    getAdminReports({ ...base, status: 'COMPLETED' }),
  ])

  return {
    ALL: all.totalElements,
    PENDING: pending.totalElements,
    COMPLETED: completed.totalElements,
  }
}

// 관리자 신고 관리 페이지
export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [viewId, setViewId] = useState<number | null>(null)
  const [statusTab, setStatusTab] = useState<ReportStatusTab>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [tabCounts, setTabCounts] = useState(INITIAL_TAB_COUNTS)
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const viewReport = useMemo(
    () => reports.find((item) => item.id === viewId) ?? null,
    [reports, viewId],
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

    getAdminReports(requestParams)
      .then((data) => {
        const mapped: Report[] = data.content.map((item) => ({
          id: item.reportId,
          reporterName: item.reporterNickname || item.reporterName || '신고자',
          reportedAt: item.reportedAt || '',
          type: item.targetType,
          targetLabel: item.targetLabel || '대상 정보 없음',
          reasonCategory: item.reasonCategory || '',
          reasonDetail: item.reasonDetail || '',
          contentBody: item.contentBody || '',
          contentUrl: item.contentUrl || '',
          status: item.status,
          profileImageUrl: item.profileImageUrl || undefined,
          contentAction: item.contentAction || undefined,
        }))
        setReports(mapped)
        setTotalPages(Math.max(1, data.totalPages))
        setTabCounts((prev) => ({ ...prev, [statusTab]: data.totalElements }))
      })
      .catch((err: unknown) => {
        setReports([])
        setTotalPages(1)
        setFetchError(
          err instanceof ApiError ? err.message : '신고 목록을 불러올 수 없습니다.',
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

  const completeReport = async (id: number, contentAction: ReportContentAction) => {
    try {
      await processReport(id, {
        status: 'COMPLETED',
        action: contentAction,
      })
      refreshData()
      setViewId(null)
    } catch (err: unknown) {
      alert(err instanceof ApiError ? err.message : '신고 처리에 실패했습니다.')
    }
  }

  return (
    <AdminShell>
      {/* 관리자 신고 관리 헤더 */}
      <AdminPageHeader title="신고 내역" className="mb-6" />

      {/* 관리자 신고 관리 상태 탭 */}
      <Tabs<ReportStatusTab>
        tabs={REPORT_STATUS_TABS}
        activeTab={statusTab}
        tabCounts={tabCounts}
        onTabChange={setStatusTab}
        ariaLabel="신고 상태 필터"
        className="mb-5"
      />

      {isLoading ? (
        <p className="py-20 text-center font-pretendard text-sm text-secondary">
          신고 목록을 불러오는 중…
        </p>
      ) : fetchError ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-mistSkyBlue/35 bg-white/60 px-6 py-20 text-center shadow-[0_8px_32px_rgba(30,58,95,0.12)] backdrop-blur-md">
          <p className="font-pretendard text-sm font-semibold text-deepOceanNavy">{fetchError}</p>
        </div>
      ) : (
        <>
          {/* 관리자 신고 관리 신고 리스트 */}
          <ReportList
            reports={reports}
            isEmpty={reports.length === 0}
            onView={setViewId}
          />

          {/* 관리자 신고 관리 신고 리스트 페이지네이션 */}
          {reports.length > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="mt-6"
            />
          ) : null}
        </>
      )}

      {/* 관리자 신고 관리 신고 상세 모달 */}
      {viewReport ? (
        <ReportDetailModal
          report={viewReport}
          onClose={() => setViewId(null)}
          onComplete={completeReport}
        />
      ) : null}
    </AdminShell>
  )
}

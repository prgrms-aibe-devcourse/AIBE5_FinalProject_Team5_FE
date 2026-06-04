import { useEffect, useMemo, useState } from 'react'
import Pagination from '../../components/common/Pagination'
import Tabs from '../../components/common/Tabs'
import AdminShell from './components/AdminShell'
import AdminPageHeader from './components/AdminPageHeader'
import ReportList from './components/report/ReportList'
import ReportDetailModal from './components/modal/ReportDetailModal'
import { REPORT_STATUS_TABS, initialReports } from './data/reports'

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

// 관리자 신고 관리 페이지
export default function AdminReportsPage() {
  const [reports, setReports] = useState(initialReports)
  const [viewId, setViewId] = useState<number | null>(null)
  const [statusTab, setStatusTab] = useState<ReportStatusTab>('ALL')
  const [currentPage, setCurrentPage] = useState(1)

  const viewReport = useMemo(
    () => reports.find((item) => item.id === viewId) ?? null,
    [reports, viewId],
  )

  const tabCounts = useMemo(
    () => ({
      ALL: reports.length,
      PENDING: reports.filter((item) => item.status === 'PENDING').length,
      COMPLETED: reports.filter((item) => item.status === 'COMPLETED').length,
    }),
    [reports],
  )

  const filteredReports = useMemo(() => {
    if (statusTab === 'ALL') return reports
    return reports.filter((item) => item.status === statusTab)
  }, [reports, statusTab])

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / PAGE_SIZE))

  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredReports.slice(start, start + PAGE_SIZE)
  }, [filteredReports, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [statusTab])

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  const completeReport = (id: number, contentAction: ReportContentAction) => {
    setReports((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'COMPLETED', contentAction } : item,
      ),
    )
    setViewId(null)
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

      {/* 관리자 신고 관리 신고 리스트 */}
      <ReportList
        reports={paginatedReports}
        isEmpty={filteredReports.length === 0}
        onView={setViewId}
      />

      {/* 관리자 신고 관리 신고 리스트 페이지네이션 */}
      {filteredReports.length > 0 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="mt-6"
        />
      ) : null}

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

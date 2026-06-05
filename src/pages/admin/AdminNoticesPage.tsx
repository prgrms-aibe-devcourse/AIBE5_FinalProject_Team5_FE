import { useEffect, useMemo, useState } from 'react'
import Pagination from '../../components/common/Pagination'
import AdminShell from './components/AdminShell'
import AdminPageHeader from './components/AdminPageHeader'
import NoticeComposeForm, { type NoticeComposePayload } from './components/notice/NoticeComposeForm'
import NoticeList from './components/notice/NoticeList'
import NoticeDetailModal from './components/modal/NoticeDetailModal'
import { initialNotices } from './data/notices'

export type Notice = {
  id: number
  title: string
  content: string
  sentAt: string
  sentBy: string
}

export const PAGE_SIZE = 10

function todayIsoDate() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// 관리자 공지 관리 페이지
export default function AdminNoticesPage() {
  const [notices, setNotices] = useState(initialNotices)
  const [viewId, setViewId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [nextId, setNextId] = useState(initialNotices.length + 1)

  const viewNotice = useMemo(
    () => notices.find((item) => item.id === viewId) ?? null,
    [notices, viewId],
  )

  const totalPages = Math.max(1, Math.ceil(notices.length / PAGE_SIZE))

  const paginatedNotices = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return notices.slice(start, start + PAGE_SIZE)
  }, [notices, currentPage])

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  const sendNotice = (payload: NoticeComposePayload) => {
    const newNotice: Notice = {
      id: nextId,
      title: payload.title,
      content: payload.content,
      sentAt: todayIsoDate(),
      sentBy: '관리자',
    }
    setNotices((prev) => [newNotice, ...prev])
    setNextId((id) => id + 1)
    setCurrentPage(1)
  }

  return (
    <AdminShell>
      {/* 관리자 공지 관리 헤더 */}
      <AdminPageHeader
        title="공지 관리"
        description="전체 회원에게 공지를 발송하고 발송 내역을 확인합니다."
        className="mb-6"
      />

      {/* 공지 발송 폼 영역 */}
      <NoticeComposeForm onSend={sendNotice} />

      {/* 발송 공지 내역*/}
      <h2 className="mb-5 font-pretendard text-base font-bold text-deepOceanNavy">발송 내역</h2>
      <NoticeList notices={paginatedNotices} isEmpty={notices.length === 0} onView={setViewId} />

      {/* 페이지네이션 */}
      {notices.length > 0 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="mt-6"
        />
      ) : null}

      {/* 공지 상세 모달 */}
      {viewNotice ? <NoticeDetailModal notice={viewNotice} onClose={() => setViewId(null)} /> : null}
    </AdminShell>
  )
}

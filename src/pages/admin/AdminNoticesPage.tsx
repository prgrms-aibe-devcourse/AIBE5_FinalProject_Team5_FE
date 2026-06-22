import { useEffect, useMemo, useState } from 'react'
import Pagination from '../../components/common/Pagination'
import AdminShell from './components/AdminShell'
import AdminPageHeader from './components/AdminPageHeader'
import NoticeComposeForm, { type NoticeComposePayload } from './components/notice/NoticeComposeForm'
import NoticeList from './components/notice/NoticeList'
import NoticeDetailModal from './components/modal/NoticeDetailModal'
import Toast from '../../components/common/Toast'
import {
  getAdminNotices,
  createAdminNotice,
  deleteAdminNotice,
  type AdminNoticeResponse,
} from '../../services/notice'

export const PAGE_SIZE = 10

// 관리자 공지 관리 페이지
export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<AdminNoticeResponse[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewId, setViewId] = useState<number | null>(null)
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [toast, setToast] = useState<{ message: string; variant?: 'info' | 'error' } | null>(null)

  const viewNotice = useMemo(
    () => notices.find((item) => item.id === viewId) ?? null,
    [notices, viewId],
  )

  const showToast = (message: string, variant: 'info' | 'error' = 'info') => {
    setToast({ message, variant })
    window.setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev))
    }, 3000)
  }

  const fetchNotices = async (page: number) => {
    setIsLoading(true)
    setError(null)
    try {
      // BE page는 0-based
      const res = await getAdminNotices(page - 1, PAGE_SIZE)
      setNotices(res.content ?? [])
      setTotalPages(Math.max(1, res.totalPages))
    } catch (err: any) {
      console.error(err)
      setError('공지 목록을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchNotices(currentPage)
  }, [currentPage])

  const sendNotice = async (payload: NoticeComposePayload) => {
    try {
      await createAdminNotice({
        title: payload.title,
        content: payload.content,
      })
      showToast('공지가 정상적으로 발송되었습니다.', 'info')
      // 1페이지로 돌아가서 목록 새로고침
      if (currentPage === 1) {
        void fetchNotices(1)
      } else {
        setCurrentPage(1)
      }
    } catch (err: any) {
      console.error(err)
      showToast(err.message || '공지 발송 중 오류가 발생했습니다.', 'error')
    }
  }

  const handleDeleteNotice = async (id: number) => {
    try {
      await deleteAdminNotice(id)
      showToast('공지가 삭제되었습니다.', 'info')
      setViewId(null) // 모달 닫기
      
      // 만약 현재 페이지에 데이터가 1개만 남아있었고, 현재 페이지가 1보다 크다면 이전 페이지로 이동
      if (notices.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1)
      } else {
        void fetchNotices(currentPage)
      }
    } catch (err: any) {
      console.error(err)
      showToast(err.message || '공지 삭제 중 오류가 발생했습니다.', 'error')
    }
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

      {/* 발송 공지 내역 */}
      <h2 className="mb-5 font-pretendard text-base font-bold text-deepOceanNavy">발송 내역</h2>
      
      {isLoading ? (
        <div className="py-12 text-center text-secondary font-pretendard text-sm">
          불러오는 중...
        </div>
      ) : error ? (
        <div className="py-12 text-center text-rose-500 font-pretendard text-sm">
          {error}
        </div>
      ) : (
        <NoticeList notices={notices} isEmpty={notices.length === 0} onView={setViewId} />
      )}

      {/* 페이지네이션 */}
      {!isLoading && !error && notices.length > 0 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="mt-6"
        />
      ) : null}

      {/* 공지 상세 모달 */}
      {viewNotice ? (
        <NoticeDetailModal
          notice={viewNotice}
          onClose={() => setViewId(null)}
          onDelete={handleDeleteNotice}
        />
      ) : null}

      {/* 토스트 알림 */}
      {toast ? (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      ) : null}
    </AdminShell>
  )
}

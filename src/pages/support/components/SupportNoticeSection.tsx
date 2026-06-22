import { useEffect, useState } from 'react'
import Pagination from '../../../components/common/Pagination'
import {
  communityListItemLinkClass,
  communityListItemTitleClass,
} from '../../community/components/CommunityListItem'
import { getNotices, type NoticeResponse } from '../../../services/notice'
import SupportNoticeDetailModal from './modal/SupportNoticeDetailModal'

const PAGE_SIZE = 10

// 고객센터 - 공지사항 목록
export default function SupportNoticeSection() {
  const [notices, setNotices] = useState<NoticeResponse[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [selectedNotice, setSelectedNotice] = useState<NoticeResponse | null>(null)

  const fetchNotices = async (page: number) => {
    setIsLoading(true)
    setError(null)
    try {
      // BE page는 0-based
      const res = await getNotices(page - 1, PAGE_SIZE)
      setNotices(res.content ?? [])
      setTotalPages(Math.max(1, res.totalPages))
      setTotalElements(res.totalElements ?? 0)
    } catch (err: any) {
      console.error(err)
      setError('공지사항을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchNotices(currentPage)
  }, [currentPage])

  return (
    <>
      {/* 공지사항 목록 */}
      <section aria-label="공지사항 목록">
        {/* 공지사항 목록 헤더 (전체 공지사항 개수) */}
        <div className="mb-4 flex items-center justify-start">
          <p className="font-pretendard text-sm text-secondary">
            전체 <span className="font-semibold text-deepOceanNavy">{totalElements}</span>건
          </p>
        </div>
        
        {/* 공지사항 목록 */}
        {isLoading ? (
          <div className="rounded-xl border border-mistSkyBlue/30 px-6 py-16 text-center text-secondary font-pretendard text-sm">
            불러오는 중...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-rose-100 bg-rose-50/20 px-6 py-16 text-center text-rose-500 font-pretendard text-sm">
            {error}
          </div>
        ) : notices.length === 0 ? ( // 공지사항 목록이 없을 경우
          <div className="rounded-xl border border-dashed border-mistSkyBlue/45 px-6 py-16 text-center">
            <p className="font-pretendard text-sm font-semibold text-deepOceanNavy">등록된 공지가 없습니다.</p>
          </div>
        ) : ( // 공지사항 목록이 있을 경우
          <ul className="flex flex-col gap-4">
            {notices.map((notice) => (
              <li key={notice.id}>
                <button
                  type="button"
                  onClick={() => setSelectedNotice(notice)}
                  className={`${communityListItemLinkClass} w-full text-left`}
                >
                  <h3 className={communityListItemTitleClass}>{notice.title}</h3>
                  <div className="mt-2.5 font-pretendard text-sm text-secondary">
                    <time dateTime={notice.postedAt.replace(/\./g, '-')}>{notice.postedAt}</time>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* 페이지네이션 */}
        {!isLoading && !error && notices.length > 0 ? (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-8"
          />
        ) : null}
      </section>

      {/* 공지사항 상세 모달 */}
      {selectedNotice ? (
        <SupportNoticeDetailModal notice={selectedNotice} onClose={() => setSelectedNotice(null)} />
      ) : null}
    </>
  )
}

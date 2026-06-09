import { useState } from 'react'
import Pagination, { usePaginatedList } from '../../../components/common/Pagination'
import {
  communityListItemLinkClass,
  communityListItemTitleClass,
} from '../../community/components/CommunityListItem'
import type { SupportNotice } from '../data/supportData'
import SupportNoticeDetailModal from './modal/SupportNoticeDetailModal'

const PAGE_SIZE = 10

type SupportNoticeSectionProps = {
  notices: SupportNotice[]
}

// 고객센터 - 공지사항 목록
export default function SupportNoticeSection({ notices }: SupportNoticeSectionProps) {
  const [selectedNotice, setSelectedNotice] = useState<SupportNotice | null>(null)
  const { currentPage, totalPages, displayedItems, onPageChange } = usePaginatedList(notices, PAGE_SIZE)

  return (
    <>
      {/* 공지사항 목록 */}
      <section aria-label="공지사항 목록">
        {/* 공지사항 목록 헤더 (전체 공지사항 개수) */}
        <div className="mb-4 flex items-center justify-start">
          <p className="font-pretendard text-sm text-secondary">
            전체 <span className="font-semibold text-deepOceanNavy">{notices.length}</span>건
          </p>
        </div>
        
        {/* 공지사항 목록*/}
        {displayedItems.length === 0 ? ( // 공지사항 목록이 없을 경우
          <div className="rounded-xl border border-dashed border-mistSkyBlue/45 px-6 py-16 text-center">
            <p className="font-pretendard text-sm font-semibold text-deepOceanNavy">등록된 공지가 없습니다.</p>
          </div>
        ) : ( // 공지사항 목록이 있을 경우
          <ul className="flex flex-col gap-4">
            {displayedItems.map((notice) => (
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
        {notices.length > 0 ? (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
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

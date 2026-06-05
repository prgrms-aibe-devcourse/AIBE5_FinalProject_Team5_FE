import Pagination, { usePaginatedList } from '../../components/common/Pagination'
import { mockQnaItems } from './data/mockQna'
import { COMMUNITY_LIST_MAX_ITEMS } from './communitySections'
import CommunityListItem from './components/CommunityListItem'

// Q&A 목록 페이지
export default function CommunityQnaPage() {
  // Q&A 목록 데이터 + 페이지네이션 처리
  const { currentPage, totalPages, displayedItems, onPageChange } = usePaginatedList(
    mockQnaItems,
    COMMUNITY_LIST_MAX_ITEMS,
  )

  return (
    <div>
      {/* Q&A 목록 리스트 */}
      <ul className="divide-y divide-mistSkyBlue/35">
        {displayedItems.map((q) => (
          // Q&A 목록 단일 항목
          <CommunityListItem
            key={q.id}
            to={`/community/qna/${q.id}`}
            state={{ title: q.title }}
            title={q.title}
            meta={{
              author: q.author,
              createdAt: q.createdAt,
              views: q.views,
              comments: q.comments,
            }}
          />
        ))}
      </ul>

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="mt-8"
      />
    </div>
  )
}

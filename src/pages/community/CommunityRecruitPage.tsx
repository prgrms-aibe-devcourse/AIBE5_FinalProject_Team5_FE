import Pagination, { usePaginatedList } from '../../components/common/Pagination'
import { mockRecruitItems } from './data/mockRecruit'
import { COMMUNITY_LIST_MAX_ITEMS } from './communitySections'
import CommunityListItem from './components/CommunityListItem'

// 모집 목록 페이지
export default function CommunityRecruitPage() {
  // 모집 목록 데이터 + 페이지네이션 처리
  const { currentPage, totalPages, displayedItems, onPageChange } = usePaginatedList(
    mockRecruitItems,
    COMMUNITY_LIST_MAX_ITEMS,
  )

  return (
    <div>
      {/* 모집 목록 리스트 */}
      <ul className="divide-y divide-mistSkyBlue/35">
        {displayedItems.map((item) => (
          // 모집 목록 단일 항목
          <CommunityListItem
            key={item.id}
            to={`/community/recruit/${item.id}`}
            state={{ title: item.title }}
            title={item.title}
            meta={{
              author: item.company,
              createdAt: item.createdAt,
              views: item.views,
              comments: item.comments,
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

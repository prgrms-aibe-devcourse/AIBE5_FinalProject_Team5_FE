import Pagination, { usePaginatedList } from '../../components/common/Pagination'
import { mockPosts } from './data/mockPosts'
import { COMMUNITY_LIST_MAX_ITEMS } from './communitySections'
import CommunityListItem from './components/CommunityListItem'

// 게시판 목록 페이지
export default function CommunityPostsPage() {
  // 게시판 목록 데이터 + 페이지네이션 처리
  const { currentPage, totalPages, displayedItems, onPageChange } = usePaginatedList(
    mockPosts,
    COMMUNITY_LIST_MAX_ITEMS,
  )

  return (
    <div>
      {/* 게시판 목록 리스트 */}
      <ul className="divide-y divide-mistSkyBlue/35">
        {displayedItems.map((post) => (
          // 게시판 목록 단일 항목
          <CommunityListItem
            key={post.id}
            to={`/community/posts/${post.id}`}
            state={{ title: post.title }}
            title={post.title}
            meta={{
              author: post.author,
              createdAt: post.createdAt,
              views: post.views,
              comments: post.comments,
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

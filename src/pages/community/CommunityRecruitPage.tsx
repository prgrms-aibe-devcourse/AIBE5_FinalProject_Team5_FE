import Pagination from '../../components/common/Pagination'
import CommunityListItem from './components/CommunityListItem'
import { useCommunityPostList } from './hooks/useCommunityPostList'

// 모집 목록 페이지
// API: services/post.getPosts — GET /api/posts?postType=PROJECT_RECRUIT
export default function CommunityRecruitPage() {
  const { posts, currentPage, setCurrentPage, totalPages, isLoading, fetchError } =
    useCommunityPostList('PROJECT_RECRUIT')

  return (
    <div>
      {isLoading ? (
        <p className="py-10 text-center text-sm text-secondary">불러오는 중...</p>
      ) : fetchError ? (
        <p className="py-10 text-center text-sm text-red-500">{fetchError}</p>
      ) : posts.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {posts.map((item) => (
            <CommunityListItem
              key={item.id}
              to={`/community/recruit/${item.id}`}
              state={{ title: item.title }}
              title={item.title}
              meta={{
                author: item.author,
                createdAt: item.createdAt,
              }}
            />
          ))}
        </ul>
      ) : (
        <p className="py-10 text-center text-sm text-secondary">모집 글이 없습니다.</p>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        className="mt-8"
      />
    </div>
  )
}

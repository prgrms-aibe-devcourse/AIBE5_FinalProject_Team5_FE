import Pagination from '../../components/common/Pagination'
import CommunityListItem from './components/CommunityListItem'
import { useCommunityPostList } from './hooks/useCommunityPostList'

// Q&A 목록 페이지
// API: services/post.getPosts — GET /api/posts?postType=QNA
export default function CommunityQnaPage() {
  const { posts, currentPage, setCurrentPage, totalPages, isLoading, fetchError } =
    useCommunityPostList('QNA')

  return (
    <div>
      {isLoading ? (
        <p className="py-10 text-center text-sm text-secondary">불러오는 중...</p>
      ) : fetchError ? (
        <p className="py-10 text-center text-sm text-red-500">{fetchError}</p>
      ) : posts.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {posts.map((q) => (
            <CommunityListItem
              key={q.id}
              variant="qna"
              to={`/community/qna/${q.id}`}
              state={{ title: q.title }}
              title={q.title}
              meta={{
                author: q.author,
                createdAt: q.createdAt,
                updatedAt: q.updatedAt,
              }}
            />
          ))}
        </ul>
      ) : (
        <p className="py-10 text-center text-sm text-secondary">질문이 없습니다.</p>
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

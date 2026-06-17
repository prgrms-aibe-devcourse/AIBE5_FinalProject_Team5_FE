import Pagination from '../../components/common/Pagination'
import CommunityListItem from './components/CommunityListItem'
import { useCommunityPostList } from './hooks/useCommunityPostList'

// 게시판 목록 페이지
// API: services/post.getPosts — GET /api/posts?postType=BOARD
export default function CommunityPostsPage() {
  const { posts, currentPage, setCurrentPage, totalPages, isLoading, fetchError } =
    useCommunityPostList('BOARD')

  return (
    <div>
      {isLoading ? (
        <p className="py-10 text-center text-sm text-secondary">불러오는 중...</p>
      ) : fetchError ? (
        <p className="py-10 text-center text-sm text-red-500">{fetchError}</p>
      ) : posts.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {posts.map((post) => (
            <CommunityListItem
              key={post.id}
              variant="board"
              to={`/community/posts/${post.id}`}
              state={{ title: post.title }}
              title={post.title}
              meta={{
                author: post.author,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
              }}
            />
          ))}
        </ul>
      ) : (
        <p className="py-10 text-center text-sm text-secondary">게시글이 없습니다.</p>
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

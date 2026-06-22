import { useLocation } from 'react-router-dom'
import Pagination from '../../components/common/Pagination'
import CommunityListItem from './components/CommunityListItem'
import { useCommunityPostList } from './hooks/useCommunityPostList'
import {
  COMMUNITY_POST_TYPE_BY_SECTION,
  getCommunityPostPath,
  getCommunitySectionFromPath,
  POST_TYPE_TO_CARD_TYPE,
  type WritableCommunitySectionKey,
} from './communitySections'
import type { PostType } from '../../services/post'

const EMPTY_MESSAGE_BY_TYPE: Record<PostType, string> = {
  BOARD: '게시글이 없습니다.',
  QNA: '질문이 없습니다.',
  PROJECT_RECRUIT: '모집 글이 없습니다.',
}

function isWritableSection(section: ReturnType<typeof getCommunitySectionFromPath>): section is WritableCommunitySectionKey {
  return section === 'posts' || section === 'qna' || section === 'recruit'
}

// 게시판 · Q&A · 모집 통합 목록 페이지
// API: services/post.getPosts — GET /api/posts?postType=...
export default function CommunityPostListPage() {
  const { pathname } = useLocation()
  const sectionKey = getCommunitySectionFromPath(pathname)

  if (!isWritableSection(sectionKey)) return null

  const postType = COMMUNITY_POST_TYPE_BY_SECTION[sectionKey]
  const { posts, currentPage, setCurrentPage, totalPages, isLoading, fetchError } = useCommunityPostList(postType)

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
              variant={POST_TYPE_TO_CARD_TYPE[post.postType]}
              to={getCommunityPostPath(post.id)}
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
        <p className="py-10 text-center text-sm text-secondary">{EMPTY_MESSAGE_BY_TYPE[postType]}</p>
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

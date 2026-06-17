import { useLocation, useParams } from 'react-router-dom'
import CommunityDetailCard from './components/CommunityDetailCard'
import CommunityCommentsCard from './components/CommunityCommentsCard'
import CommunityCommentsSection from './components/CommunityCommentsSection'
import { formatCommunityDate } from '../../utils/formatRequestedDate'
import { usePostDetail } from './hooks/usePostDetail'

// Q&A 상세 페이지
// API: services/post.getPost — GET /api/posts/{postId}
export default function CommunityQnaDetailPage() {
  const { qnaId } = useParams<{ qnaId: string }>()
  const location = useLocation()
  const fallbackTitle = (location.state as { title?: string } | null)?.title?.trim()
  const { post, isLoading, fetchError } = usePostDetail(qnaId)

  if (isLoading) {
    return <p className="py-10 text-center text-sm text-secondary">불러오는 중...</p>
  }

  if (fetchError || !post) {
    return <p className="py-10 text-center text-sm text-red-500">{fetchError ?? '질문을 찾을 수 없습니다.'}</p>
  }

  const title = post.title || fallbackTitle || '질문 제목'

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <CommunityDetailCard
        title={title}
        meta={[
          <span key="author" className="font-medium text-deepOceanNavy/80">
            {post.author}
          </span>,
          <time key="date" dateTime={post.createdAt}>
            {formatCommunityDate(post.createdAt)}
          </time>,
        ]}
      >
        <section aria-label="상세 내역">
          <h3 className="text-base font-semibold text-deepOceanNavy">상세 내역</h3>
          <p className="mt-4 whitespace-pre-wrap">{post.content}</p>
        </section>
      </CommunityDetailCard>

      <CommunityCommentsCard>
        <CommunityCommentsSection resourceKey={`qna:${qnaId ?? 'unknown'}`} />
      </CommunityCommentsCard>
    </div>
  )
}

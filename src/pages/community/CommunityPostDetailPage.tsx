import { useLocation, useParams } from 'react-router-dom'
import { getMockPostDetail } from './data/mockPostDetail'
import CommunityDetailCard from './components/CommunityDetailCard'
import CommunityCommentsCard from './components/CommunityCommentsCard'
import CommunityCommentsSection from './components/CommunityCommentsSection'
import { formatCommunityDate } from '../../utils/formatRequestedDate'

// 게시글 상세 페이지 컴포넌트
export default function CommunityPostDetailPage() {
  // 게시글 데이터
  const { postId } = useParams<{ postId: string }>() // 게시글 ID
  const location = useLocation() // 현재 위치
  const title = (location.state as { title?: string } | null)?.title?.trim() || '게시글 제목'
  const detail = getMockPostDetail(postId) // 게시글 상세 데이터

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* 게시글 상세 카드 */}
      <CommunityDetailCard
        title={title}
        meta={[
          <span key="author" className="font-medium text-deepOceanNavy/80">
            {detail.author}
          </span>,
          <time key="date" dateTime={detail.createdAt}>
            {formatCommunityDate(detail.createdAt)}
          </time>,
          <span key="views" className="tabular-nums">
            조회 {detail.views.toLocaleString()}
          </span>,
        ]}
      > 
        {/* 게시글 상세 내역 */}
        <section aria-label="상세 내역">
          <h3 className="text-base font-semibold text-deepOceanNavy">상세 내역</h3>
          <p className="mt-4">{detail.body}</p>
          <p className="mt-4 text-secondary">
            API 연동 후 실제 게시글 내용이 이 영역에 표시됩니다.
          </p>
        </section>
      </CommunityDetailCard>

      {/* 게시글 댓글 카드 */}
      <CommunityCommentsCard>
        {/* 게시글 댓글 섹션 */}
        <CommunityCommentsSection resourceKey={`posts:${postId ?? 'unknown'}`} />
      </CommunityCommentsCard>
    </div>
  )
}

import { useLocation, useParams } from 'react-router-dom'
import { getMockQnaDetail } from './data/mockQnaDetail'
import CommunityDetailCard from './components/CommunityDetailCard'
import CommunityCommentsCard from './components/CommunityCommentsCard'
import CommunityCommentsSection from './components/CommunityCommentsSection'
import { formatCommunityDate } from '../../utils/formatRequestedDate'

export default function CommunityQnaDetailPage() {
  // Q&A 데이터
  const { qnaId } = useParams<{ qnaId: string }>()
  const location = useLocation()
  const title = (location.state as { title?: string } | null)?.title?.trim() || '질문 제목'
  const detail = getMockQnaDetail(qnaId)

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Q&A 상세 카드 */}
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
        {/* Q&A 상세 내역 */}
        <section aria-label="상세 내역">
          <h3 className="text-base font-semibold text-deepOceanNavy">상세 내역</h3>
          <p className="mt-4">{detail.body}</p>
          <p className="mt-4 text-secondary">
            API 연동 후 실제 질문 내용이 이 영역에 표시됩니다.
          </p>
        </section>
      </CommunityDetailCard>

      {/* Q&A 댓글 카드 */}
      <CommunityCommentsCard>
        {/* Q&A 댓글 섹션 */}
        <CommunityCommentsSection resourceKey={`qna:${qnaId ?? 'unknown'}`} />
      </CommunityCommentsCard>
    </div>
  )
}

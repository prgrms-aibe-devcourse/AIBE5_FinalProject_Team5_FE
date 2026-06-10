import { useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { getMockPostDetail } from './data/mockPostDetail'
import CommunityDetailCard from './components/CommunityDetailCard'
import CommunityCommentsCard from './components/CommunityCommentsCard'
import CommunityCommentsSection from './components/CommunityCommentsSection'
import { formatCommunityDate } from '../../utils/formatRequestedDate'
import ReportModal from '../../components/common/ReportModal'

// 게시글 상세 페이지 컴포넌트
export default function CommunityPostDetailPage() {
  const { postId } = useParams<{ postId: string }>()
  const location = useLocation()
  const title = (location.state as { title?: string } | null)?.title?.trim() || '게시글 제목'
  const detail = getMockPostDetail(postId)

  const [reportOpen, setReportOpen] = useState(false)
  const postNumericId = parseInt(postId ?? '0', 10) || 0

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
        actions={
          <button
            type="button"
            onClick={() => setReportOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-mistSkyBlue/50 px-3 py-1.5 font-pretendard text-xs font-medium text-secondary transition-colors hover:border-[#dc2626]/40 hover:bg-[#fef2f2] hover:text-[#dc2626]"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            신고하기
          </button>
        }
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
        <CommunityCommentsSection resourceKey={`posts:${postId ?? 'unknown'}`} />
      </CommunityCommentsCard>

      {/* 게시글 신고 모달 */}
      {reportOpen ? (
        <ReportModal
          targetType="POST"
          targetId={postNumericId}
          onClose={() => setReportOpen(false)}
        />
      ) : null}
    </div>
  )
}

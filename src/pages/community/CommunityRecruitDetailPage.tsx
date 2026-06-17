import { useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import CommunityDetailCard from './components/CommunityDetailCard'
import CommunityCommentsCard from './components/CommunityCommentsCard'
import CommunityCommentsSection from './components/CommunityCommentsSection'
import { formatCommunityDate } from '../../utils/formatRequestedDate'
import ReportModal from '../../components/common/ReportModal'
import { usePostDetail } from './hooks/usePostDetail'

// ?? ??? ????
// API: services/post.getPost ??GET /api/posts/{postId}
export default function CommunityRecruitDetailPage() {
  const { recruitId } = useParams<{ recruitId: string }>()
  const location = useLocation()
  const fallbackTitle = (location.state as { title?: string } | null)?.title?.trim()
  const { post, isLoading, fetchError } = usePostDetail(recruitId, 'PROJECT_RECRUIT')

  const [reportOpen, setReportOpen] = useState(false)
  const postNumericId = parseInt(recruitId ?? '0', 10) || 0

  if (isLoading) {
    return <p className="flex min-h-[60vh] items-center justify-center text-center text-sm text-secondary">????? ??..</p>
  }

  if (fetchError || !post) {
    return <p className="flex min-h-[60vh] items-center justify-center text-center text-sm text-red-500">{fetchError ?? '?? ????? ????????.'}</p>
  }

  const title = post.title || fallbackTitle || '?? ???'

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <CommunityDetailCard
        title={title}
        type="recruit"
        meta={[
          <span key="author" className="inline-flex items-center gap-1.5 font-medium">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {post.author}
          </span>,
          <span key="date" className="inline-flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <time dateTime={post.createdAt}>{formatCommunityDate(post.createdAt)}</time>
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
        <section aria-label="신고">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </section>
      </CommunityDetailCard>

      <CommunityCommentsCard>
        <CommunityCommentsSection postId={post.id} />
      </CommunityCommentsCard>

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

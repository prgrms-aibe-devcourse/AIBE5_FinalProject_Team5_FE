import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import CommunityDetailCard from './components/CommunityDetailCard'
import CommunityCommentsCard from './components/CommunityCommentsCard'
import CommunityCommentsSection from './components/CommunityCommentsSection'
import CommunityDetailBreadcrumb from './components/CommunityDetailBreadcrumb'
import { formatCommunityDate } from '../../utils/formatRequestedDate'
import { getStoredUser } from '../../services/auth'
import ReportModal from '../../components/common/ReportModal'
import { usePostDetail } from './hooks/usePostDetail'
import {
  communitySections,
  POST_TYPE_TO_CARD_TYPE,
  POST_TYPE_TO_SECTION,
} from './communitySections'

const STORAGE_KEY = 'community-recent-visits'
const MAX_COMMUNITY_RECENT_VISITS = 5

type CommunityRecentVisit = {
  path: string
  title: string
  section: string
  visitedAt: string
}

function loadCommunityRecentVisits(): CommunityRecentVisit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CommunityRecentVisit[]
    return Array.isArray(parsed) ? parsed.slice(0, MAX_COMMUNITY_RECENT_VISITS) : []
  } catch {
    return []
  }
}

function addCommunityRecentVisit(visit: Pick<CommunityRecentVisit, 'path' | 'title' | 'section'>) {
  const visits = loadCommunityRecentVisits().filter((item) => item.path !== visit.path)
  const next: CommunityRecentVisit[] = [{ ...visit, visitedAt: new Date().toISOString() }, ...visits].slice(
    0,
    MAX_COMMUNITY_RECENT_VISITS,
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

const DEFAULT_TITLE_BY_TYPE = {
  BOARD: '게시글 상세',
  QNA: '질문 상세',
  PROJECT_RECRUIT: '모집 상세',
} as const

type CommunityPostDetailLocationState = {
  title?: string
  editCommentId?: number
}

// 게시판 · Q&A · 모집 통합 상세 페이지
// API: services/post.getPost — GET /api/posts/{postId}
export default function CommunityPostDetailPage() {
  const { postId } = useParams<{ postId: string }>()
  const location = useLocation()
  const locationState = (location.state as CommunityPostDetailLocationState | null) ?? null
  const fallbackTitle = locationState?.title?.trim()
  const editCommentId = locationState?.editCommentId ?? null
  const { post, isLoading, fetchError } = usePostDetail(postId)

  const [reportOpen, setReportOpen] = useState(false)
  const postNumericId = parseInt(postId ?? '0', 10) || 0

  useEffect(() => {
    if (!post) return
    const sectionKey = POST_TYPE_TO_SECTION[post.postType]
    addCommunityRecentVisit({
      path: location.pathname,
      title: post.title || fallbackTitle || communitySections[sectionKey].label,
      section: communitySections[sectionKey].label,
    })
  }, [post, location.pathname, fallbackTitle])

  if (isLoading) {
    return (
      <p className="flex min-h-[60vh] items-center justify-center text-center text-sm text-secondary">
        불러오는 중...
      </p>
    )
  }

  if (fetchError || !post) {
    return (
      <p className="flex min-h-[60vh] items-center justify-center text-center text-sm text-red-500">
        {fetchError ?? '게시글을 불러올 수 없습니다.'}
      </p>
    )
  }

  const sectionKey = POST_TYPE_TO_SECTION[post.postType]
  const title = post.title || fallbackTitle || DEFAULT_TITLE_BY_TYPE[post.postType]
  const storedUser = getStoredUser()
  const isOwnPost = storedUser != null && post.author === storedUser.nickname

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <CommunityDetailBreadcrumb section={sectionKey} />

      <CommunityDetailCard
        title={title}
        type={POST_TYPE_TO_CARD_TYPE[post.postType]}
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
          isOwnPost ? undefined : (
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
          )
        }
      >
        <section aria-label="본문">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </section>
      </CommunityDetailCard>

      <CommunityCommentsCard>
        <CommunityCommentsSection postId={post.id} initialEditCommentId={editCommentId} />
      </CommunityCommentsCard>

      {reportOpen ? (
        <ReportModal targetType="POST" targetId={postNumericId} onClose={() => setReportOpen(false)} />
      ) : null}
    </div>
  )
}

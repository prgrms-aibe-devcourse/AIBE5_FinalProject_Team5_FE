import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/common/Pagination'
import Tabs from '../../components/common/Tabs'
import {
  MY_POST_TABS,
  getUserActivityEditPath,
  getUserActivityPath,
  type MyPostTab,
  type UserActivityItem,
} from './data/posts'
import DashboardShell from './components/DashboardShell'
import MyPostRowCard from './components/MyPostRowCard'
import DeleteConfirmModal from './components/modal/DeleteConfirmModal'
import {
  getMyPageComments,
  getMyPagePosts,
  getMyPageReviews,
  type MyPagePostType,
} from '../../services/mypage'
import { deletePost } from '../../services/post'

const PAGE_SIZE = 10

const EMPTY_MESSAGES: Record<MyPostTab, { title: string; description: string }> = {
  POST: { title: '작성한 게시글이 없습니다', description: '게시판에 글을 작성해 보세요.' },
  REVIEW: { title: '작성한 리뷰가 없습니다', description: '수강 후기나 경험을 리뷰로 남겨 보세요.' },
  QNA: { title: '작성한 Q&A 글이 없습니다', description: 'Q&A에 질문을 남겨 보세요.' },
  RECRUIT: { title: '작성한 모집 글이 없습니다', description: '모집 게시판에 글을 작성해 보세요.' },
  COMMENT: { title: '작성한 댓글이 없습니다', description: '관심 있는 글에 댓글을 남겨 보세요.' },
}

function formatIsoToDateLabel(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd}`
}

function tabToPostType(tab: Extract<MyPostTab, 'POST' | 'QNA' | 'RECRUIT'>): MyPagePostType {
  if (tab === 'POST') return 'BOARD'
  if (tab === 'QNA') return 'QNA'
  return 'PROJECT_RECRUIT'
}

function tabToBoardLabel(tab: MyPostTab) {
  if (tab === 'POST') return '게시판'
  if (tab === 'QNA') return 'Q&A'
  if (tab === 'RECRUIT') return '모집'
  if (tab === 'REVIEW') return '리뷰'
  return '댓글'
}

function isPostTab(tab: MyPostTab): tab is Extract<MyPostTab, 'POST' | 'QNA' | 'RECRUIT'> {
  return tab === 'POST' || tab === 'QNA' || tab === 'RECRUIT'
}

// 내가 쓴 글 페이지 (게시글·Q&A·모집·댓글)
export default function MyPostsPage() {
  const navigate = useNavigate()

  // --- 탭·페이지 ---
  const [activeTab, setActiveTab] = useState<MyPostTab>('POST')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<UserActivityItem | null>(null)
  const [items, setItems] = useState<UserActivityItem[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [tabCounts, setTabCounts] = useState<Record<MyPostTab, number>>({
    POST: 0,
    QNA: 0,
    RECRUIT: 0,
    COMMENT: 0,
    REVIEW: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const emptyMessage = EMPTY_MESSAGES[activeTab]

  const requestParams = useMemo(() => {
    return {
      page: Math.max(0, currentPage - 1),
      size: PAGE_SIZE,
      sort: 'createdAt,desc',
    }
  }, [currentPage])

  useEffect(() => {
    setIsLoading(true)
    setFetchError(null)

    const load = async () => {
      if (activeTab === 'COMMENT') {
        const data = await getMyPageComments(requestParams)
        setItems(
          data.items.map((it) => ({
            id: it.id,
            kind: 'comment',
            title: it.titleOrContent,
            board: tabToBoardLabel(activeTab),
            createdAt: formatIsoToDateLabel(it.createdAt),
          })),
        )
        setTotalPages(Math.max(1, data.totalPages))
        setTabCounts((prev) => ({ ...prev, COMMENT: data.totalElements }))
        return
      }

      if (activeTab === 'REVIEW') {
        const data = await getMyPageReviews(requestParams)
        setItems(
          data.items.map((it) => ({
            id: it.id,
            kind: 'post',
            title: it.titleOrContent,
            board: tabToBoardLabel(activeTab),
            createdAt: formatIsoToDateLabel(it.createdAt),
          })),
        )
        setTotalPages(Math.max(1, data.totalPages))
        setTabCounts((prev) => ({ ...prev, REVIEW: data.totalElements }))
        return
      }

      const type = tabToPostType(activeTab)
      const data = await getMyPagePosts({ ...requestParams, type })
      setItems(
        data.items.map((it) => ({
          id: it.id,
          kind: 'post',
          title: it.titleOrContent,
          board: tabToBoardLabel(activeTab),
          createdAt: formatIsoToDateLabel(it.createdAt),
        })),
      )
      setTotalPages(Math.max(1, data.totalPages))
      setTabCounts((prev) => ({ ...prev, [activeTab]: data.totalElements }))
    }

    load()
      .catch((err: unknown) => {
        setFetchError(err instanceof Error ? err.message : '목록을 불러올 수 없습니다.')
        setItems([])
        setTotalPages(1)
      })
      .finally(() => setIsLoading(false))
  }, [activeTab, requestParams])

  useEffect(() => {
    const loadCounts = async () => {
      const base = { page: 0, size: 1, sort: 'createdAt,desc' }
      const [board, qna, recruit, comments, reviews] = await Promise.all([
        getMyPagePosts({ ...base, type: 'BOARD' }),
        getMyPagePosts({ ...base, type: 'QNA' }),
        getMyPagePosts({ ...base, type: 'PROJECT_RECRUIT' }),
        getMyPageComments(base),
        getMyPageReviews(base),
      ])
      setTabCounts({
        POST: board.totalElements,
        QNA: qna.totalElements,
        RECRUIT: recruit.totalElements,
        COMMENT: comments.totalElements,
        REVIEW: reviews.totalElements,
      })
    }

    loadCounts().catch(() => {
      // 카운트는 실패해도 목록은 별도로 동작하도록 무시
    })
  }, [])

  // --- 이벤트 핸들러 ---
  const handleEdit = (item: UserActivityItem) => {
    navigate(getUserActivityEditPath(item))
  }

  const handleDeleteRequest = (item: UserActivityItem) => {
    setDeleteTarget(item)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return

    setActionError(null)

    if (isPostTab(activeTab) && deleteTarget.kind === 'post') {
      try {
        setIsDeleting(true)
        await deletePost(deleteTarget.id)
      } catch (err: unknown) {
        setActionError(err instanceof Error ? err.message : '게시글 삭제 중 오류가 발생했습니다.')
        return
      } finally {
        setIsDeleting(false)
      }
    }

    setItems((prev) => prev.filter((item) => !(item.kind === deleteTarget.kind && item.id === deleteTarget.id)))
    setTabCounts((prev) => ({ ...prev, [activeTab]: Math.max(0, (prev[activeTab] ?? 0) - 1) }))

    setDeleteTarget(null)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab])

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  return (
    <DashboardShell title="내가 쓴 글" description="커뮤니티에 작성한 글을 확인합니다.">
      {/* 탭 필터 */}
      <Tabs<MyPostTab>
        tabs={MY_POST_TABS}
        activeTab={activeTab}
        tabCounts={tabCounts}
        onTabChange={setActiveTab}
        ariaLabel="내가 쓴 글 분류"
        className="mb-6"
      />

      {/* 글 목록 / 빈 상태 */}
      {actionError ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 font-pretendard text-sm text-red-600">
          {actionError}
        </p>
      ) : null}
      {isLoading ? (
        <div className="flex items-center justify-center rounded-2xl border border-mistSkyBlue/35 bg-white/60 px-6 py-16 text-center shadow-[0_8px_32px_rgba(30,58,95,0.12)] backdrop-blur-md">
          <p className="font-pretendard text-sm text-secondary">불러오는 중...</p>
        </div>
      ) : fetchError ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-mistSkyBlue/35 bg-white/60 px-6 py-16 text-center shadow-[0_8px_32px_rgba(30,58,95,0.12)] backdrop-blur-md">
          <p className="font-pretendard text-sm font-semibold text-deepOceanNavy">목록을 불러올 수 없습니다</p>
          <p className="mt-1 font-pretendard text-xs text-secondary">{fetchError}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-mistSkyBlue/35 bg-white/60 px-6 py-20 text-center shadow-[0_8px_32px_rgba(30,58,95,0.12)] backdrop-blur-md">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foamWhite text-waterlineBlue ring-1 ring-mistSkyBlue/50">
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 7h16M4 12h16M4 17h10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="mt-4 font-pretendard text-sm font-semibold text-deepOceanNavy">{emptyMessage.title}</p>
          <p className="mt-1 font-pretendard text-xs text-secondary">{emptyMessage.description}</p>
        </div>
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li key={`${item.kind}-${item.id}`}>
                <MyPostRowCard
                  item={item}
                  onOpenDetail={
                    activeTab === 'REVIEW'
                      ? undefined
                      : () => navigate(getUserActivityPath(item))
                  }
                  onEdit={activeTab === 'REVIEW' ? undefined : () => handleEdit(item)}
                  onDelete={() => handleDeleteRequest(item)}
                />
              </li>
            ))}
          </ul>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-8"
          />
        </>
      )}
      {/* 삭제 확인 모달 */}
      {deleteTarget ? (
        <DeleteConfirmModal
          targetTitle={deleteTarget.title}
          targetLabel={deleteTarget.kind === 'comment' ? '댓글' : '글'}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeleting}
        />
      ) : null}
    </DashboardShell>
  )
}

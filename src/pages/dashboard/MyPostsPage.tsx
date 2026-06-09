import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/common/Pagination'
import Tabs from '../../components/common/Tabs'
import {
  MY_POST_TABS,
  buildMyActivities,
  countMyActivitiesByTab,
  filterMyActivities,
  getUserActivityEditPath,
  getUserActivityPath,
  myComments,
  myPosts,
  type MyPostTab,
  type UserActivityItem,
  type UserComment,
  type UserPost,
} from './data/posts'
import DashboardShell from './components/DashboardShell'
import MyPostRowCard from './components/MyPostRowCard'
import DeleteConfirmModal from './components/modal/DeleteConfirmModal'

const PAGE_SIZE = 10

const EMPTY_MESSAGES: Record<MyPostTab, { title: string; description: string }> = {
  ALL: { title: '작성한 글이 없습니다', description: '커뮤니티에 첫 글을 작성해 보세요.' },
  POST: { title: '작성한 게시글이 없습니다', description: '게시판에 글을 작성해 보세요.' },
  QNA: { title: '작성한 Q&A 글이 없습니다', description: 'Q&A에 질문을 남겨 보세요.' },
  RECRUIT: { title: '작성한 모집 글이 없습니다', description: '모집 게시판에 글을 작성해 보세요.' },
  COMMENT: { title: '작성한 댓글이 없습니다', description: '관심 있는 글에 댓글을 남겨 보세요.' },
}

// 내가 쓴 글 페이지 (게시글·Q&A·모집·댓글)
export default function MyPostsPage() {
  const navigate = useNavigate()

  // --- 탭·페이지·더미 데이터 ---
  const [activeTab, setActiveTab] = useState<MyPostTab>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [posts, setPosts] = useState<UserPost[]>(() => [...myPosts])
  const [comments, setComments] = useState<UserComment[]>(() => [...myComments])
  const [deleteTarget, setDeleteTarget] = useState<UserActivityItem | null>(null)

  const allActivities = useMemo(() => buildMyActivities(posts, comments), [posts, comments])

  const filteredActivities = useMemo(
    () => filterMyActivities(allActivities, activeTab),
    [activeTab, allActivities],
  )

  const tabCounts = useMemo(() => countMyActivitiesByTab(allActivities), [allActivities])

  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / PAGE_SIZE))
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredActivities.slice(start, start + PAGE_SIZE)
  }, [currentPage, filteredActivities])

  // --- 이벤트 핸들러 ---
  const handleEdit = (item: UserActivityItem) => {
    navigate(getUserActivityEditPath(item))
  }

  const handleDeleteRequest = (item: UserActivityItem) => {
    setDeleteTarget(item)
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return

    if (deleteTarget.kind === 'comment') {
      setComments((prev) => prev.filter((comment) => comment.id !== deleteTarget.id))
    } else {
      setPosts((prev) => prev.filter((post) => post.id !== deleteTarget.id))
    }

    setDeleteTarget(null)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab])

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  const emptyMessage = EMPTY_MESSAGES[activeTab]

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
      {filteredActivities.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-mistSkyBlue/45 bg-white px-6 py-20 text-center shadow-[0_2px_12px_rgba(52,74,100,0.06)]">
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
            {paginatedItems.map((item) => (
              <li key={`${item.kind}-${item.id}`}>
                <MyPostRowCard
                  item={item}
                  onOpenDetail={() => navigate(getUserActivityPath(item))}
                  onEdit={() => handleEdit(item)}
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
        />
      ) : null}
    </DashboardShell>
  )
}

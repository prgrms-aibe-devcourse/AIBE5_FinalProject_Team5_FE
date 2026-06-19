import { useEffect, useRef, useState } from 'react'
import ReportModal from '../../../components/common/ReportModal'
import { getStoredUser, getStoredUserId } from '../../../services/auth'
import { isAuthenticated } from '../../../services/authToken'
import {
  createPostComment,
  deletePostComment,
  getPostComments,
  updatePostComment,
  type PostComment,
} from '../../../services/comment'

function formatRelative(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  const diffMs = Date.now() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return '방금'
  if (diffMin < 60) return `${diffMin}분 전`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH}시간 전`
  const diffD = Math.floor(diffH / 24)
  return `${diffD}일 전`
}

function isOwnComment(comment: PostComment): boolean {
  const userId = getStoredUserId()
  if (userId != null && comment.userId === userId) return true

  const user = getStoredUser()
  if (!user) return false
  return comment.author === user.nickname
}

type CommentActionMenuProps = {
  comment: PostComment
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  onReport: () => void
  disabled?: boolean
}

function CommentActionMenu({
  comment,
  isOpen,
  onToggle,
  onClose,
  onEdit,
  onDelete,
  onReport,
  disabled = false,
}: CommentActionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const ownComment = isOwnComment(comment)

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) onClose()
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [isOpen, onClose])

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-label="댓글 메뉴"
        aria-expanded={isOpen}
        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-secondary/70 transition-colors hover:bg-mistSkyBlue/25 hover:text-deepOceanNavy disabled:opacity-50"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="5" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="12" cy="19" r="1.8" />
        </svg>
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-1 min-w-[7.5rem] overflow-hidden rounded-lg border border-mistSkyBlue/45 bg-white py-1 shadow-[0_8px_24px_rgba(36,57,84,0.14)]"
        >
          {ownComment ? (
            <>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onClose()
                  onEdit()
                }}
                className="block w-full px-3 py-2 text-left font-pretendard text-xs text-deepOceanNavy transition-colors hover:bg-foamWhite"
              >
                수정
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onClose()
                  onDelete()
                }}
                className="block w-full px-3 py-2 text-left font-pretendard text-xs text-[#dc2626] transition-colors hover:bg-[#fef2f2]"
              >
                삭제
              </button>
            </>
          ) : (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onClose()
                onReport()
              }}
              className="block w-full px-3 py-2 text-left font-pretendard text-xs text-[#dc2626] transition-colors hover:bg-[#fef2f2]"
            >
              신고
            </button>
          )}
        </div>
      ) : null}
    </div>
  )
}

type CommunityCommentsSectionProps = {
  postId: number
  initialEditCommentId?: number | null
}

const COMMENT_MAX_LENGTH = 255

export default function CommunityCommentsSection({
  postId,
  initialEditCommentId = null,
}: CommunityCommentsSectionProps) {
  const canWriteComment = isAuthenticated()
  const [comments, setComments] = useState<PostComment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [value, setValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reportTargetId, setReportTargetId] = useState<number | null>(null)
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editDraft, setEditDraft] = useState('')
  const [editError, setEditError] = useState<string | null>(null)
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null)
  const [openMenuCommentId, setOpenMenuCommentId] = useState<number | null>(null)
  const initialEditHandled = useRef(false)

  useEffect(() => {
    if (!Number.isFinite(postId) || postId <= 0) {
      setComments([])
      setFetchError('댓글을 불러올 게시글 ID가 올바르지 않습니다.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setFetchError(null)
    initialEditHandled.current = false

    getPostComments(postId, {
      page: 0,
      size: initialEditCommentId ? 100 : 10,
      sort: 'createdAt,ASC',
    })
      .then((page) => setComments(page.content))
      .catch((err: unknown) => {
        setComments([])
        setFetchError(err instanceof Error ? err.message : '댓글을 불러오는 중 오류가 발생했습니다.')
      })
      .finally(() => setIsLoading(false))
  }, [postId, initialEditCommentId])

  useEffect(() => {
    if (!initialEditCommentId || isLoading || initialEditHandled.current) return

    const target = comments.find((comment) => comment.id === initialEditCommentId)
    if (!target || !isOwnComment(target)) return

    initialEditHandled.current = true
    setEditingCommentId(target.id)
    setEditDraft(target.content)
    setEditError(null)
    setOpenMenuCommentId(null)

    requestAnimationFrame(() => {
      document.getElementById(`community-comment-${target.id}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    })
  }, [initialEditCommentId, isLoading, comments])

  const handleSubmit = async () => {
    const content = value.trim()
    if (!content) return
    if (isSubmitting) return

    setIsSubmitting(true)
    setFetchError(null)

    try {
      const created = await createPostComment(postId, { content })
      setComments((prev) => [created, ...prev])
      setValue('')
    } catch (err: unknown) {
      setFetchError(err instanceof Error ? err.message : '댓글 등록 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const startEdit = (comment: PostComment) => {
    if (!isOwnComment(comment)) return
    setEditingCommentId(comment.id)
    setEditDraft(comment.content)
    setEditError(null)
    setDeleteConfirmId(null)
    setOpenMenuCommentId(null)
  }

  const cancelEdit = () => {
    setEditingCommentId(null)
    setEditDraft('')
    setEditError(null)
  }

  const handleSaveEdit = async (commentId: number) => {
    const content = editDraft.trim()
    if (!content) {
      setEditError('댓글 내용을 입력해 주세요.')
      return
    }
    if (content.length > COMMENT_MAX_LENGTH) {
      setEditError(`댓글은 ${COMMENT_MAX_LENGTH}자 이내로 입력해 주세요.`)
      return
    }

    setIsSavingEdit(true)
    setEditError(null)

    try {
      const updated = await updatePostComment(commentId, { content })
      setComments((prev) => prev.map((comment) => (comment.id === commentId ? updated : comment)))
      cancelEdit()
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : '댓글 수정 중 오류가 발생했습니다.')
    } finally {
      setIsSavingEdit(false)
    }
  }

  const handleDelete = async (commentId: number) => {
    setDeletingCommentId(commentId)
    setFetchError(null)

    try {
      await deletePostComment(commentId)
      setComments((prev) => prev.filter((comment) => comment.id !== commentId))
      if (editingCommentId === commentId) cancelEdit()
      setDeleteConfirmId(null)
      setOpenMenuCommentId(null)
    } catch (err: unknown) {
      setFetchError(err instanceof Error ? err.message : '댓글 삭제 중 오류가 발생했습니다.')
    } finally {
      setDeletingCommentId(null)
    }
  }

  return (
    <section aria-label="댓글" className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <h3 className="text-base font-semibold text-deepOceanNavy">댓글</h3>
        <p className="text-sm text-secondary tabular-nums">총 {comments.length}개</p>
      </div>

      {canWriteComment ? (
        <div className="rounded-xl border border-mistSkyBlue/40 bg-foamWhite/45 p-4 shadow-[0_3px_14px_rgba(52,74,100,0.05)] md:p-5">
          <label className="sr-only" htmlFor="community-comment-input">
            댓글 입력
          </label>
          <div>
            <textarea
              id="community-comment-input"
              value={value}
              onChange={(e) => setValue(e.target.value.slice(0, COMMENT_MAX_LENGTH))}
              placeholder="댓글을 입력하세요"
              rows={3}
              className="w-full resize-none rounded-lg border border-mistSkyBlue/45 bg-white px-3 py-2.5 text-sm leading-relaxed text-deepOceanNavy outline-none transition-colors placeholder:text-softAquaBlue focus:border-waterlineBlue"
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-secondary tabular-nums">
              {value.length}/{COMMENT_MAX_LENGTH}
            </p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!value.trim() || isSubmitting}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-waterlineBlue px-3 text-xs font-semibold text-white transition-colors hover:bg-[#005EB8] disabled:cursor-not-allowed disabled:bg-mistSkyBlue/70"
              aria-label="댓글 전송"
            >
              등록
            </button>
          </div>
        </div>
      ) : null}

      <div>
        {isLoading ? (
          <p className="rounded-lg border border-mistSkyBlue/30 bg-white px-4 py-6 text-center text-sm text-secondary">
            댓글을 불러오는 중...
          </p>
        ) : fetchError ? (
          <p className="rounded-lg border border-red-200 bg-red-50/70 px-4 py-6 text-center text-sm text-red-500">
            {fetchError}
          </p>
        ) : comments.length === 0 ? (
          <p className="rounded-lg border border-mistSkyBlue/30 bg-white px-4 py-6 text-center text-sm text-secondary">
            아직 댓글이 없습니다.
          </p>
        ) : (
          <ul className="space-y-2">
            {comments.map((comment) => {
              const isEditing = editingCommentId === comment.id
              const ownComment = isOwnComment(comment)
              const showMenu = isAuthenticated() && !isEditing

              return (
                <li
                  key={comment.id}
                  id={`community-comment-${comment.id}`}
                  className="rounded-lg border border-mistSkyBlue/30 bg-white px-4 py-4 md:px-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-deepOceanNavy/85">{comment.author}</span>
                    <div className="flex shrink-0 items-center gap-2">
                      <time dateTime={comment.createdAt} className="text-xs text-softAquaBlue">
                        {formatRelative(comment.createdAt)}
                      </time>
                      {showMenu ? (
                        <CommentActionMenu
                          comment={comment}
                          isOpen={openMenuCommentId === comment.id}
                          onToggle={() =>
                            setOpenMenuCommentId((prev) => (prev === comment.id ? null : comment.id))
                          }
                          onClose={() => setOpenMenuCommentId(null)}
                          onEdit={() => startEdit(comment)}
                          onDelete={() => setDeleteConfirmId(comment.id)}
                          onReport={() => {
                            if (ownComment) return
                            setReportTargetId(comment.id)
                          }}
                        />
                      ) : null}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="mt-2 rounded-lg border border-mistSkyBlue/30 bg-white p-3">
                      <textarea
                        value={editDraft}
                        onChange={(e) => {
                          setEditDraft(e.target.value.slice(0, COMMENT_MAX_LENGTH))
                          setEditError(null)
                        }}
                        rows={Math.min(8, Math.max(2, editDraft.split('\n').length + 1))}
                        disabled={isSavingEdit}
                        autoFocus
                        aria-label="댓글 수정"
                        className="block w-full resize-none border-0 bg-white p-0 text-[15px] leading-relaxed text-deepOceanNavy/90 outline-none focus:ring-0"
                      />
                      <div className="mt-2 flex items-center justify-between gap-2 border-t border-mistSkyBlue/25 pt-2">
                        <p className="text-[11px] tabular-nums text-softAquaBlue">
                          {editDraft.trim().length}/{COMMENT_MAX_LENGTH}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={isSavingEdit}
                            className="rounded-md px-2.5 py-1 font-pretendard text-xs text-secondary transition-colors hover:bg-white/80 hover:text-deepOceanNavy disabled:opacity-50"
                          >
                            취소
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleSaveEdit(comment.id)}
                            disabled={isSavingEdit || !editDraft.trim()}
                            className="rounded-md bg-waterlineBlue px-2.5 py-1 font-pretendard text-xs font-semibold text-white transition-colors hover:bg-[#005EB8] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isSavingEdit ? '수정 중...' : '수정'}
                          </button>
                        </div>
                      </div>
                      {editError ? <p className="mt-2 text-xs text-red-500">{editError}</p> : null}
                    </div>
                  ) : (
                    <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-deepOceanNavy/90">
                      {comment.content}
                    </p>
                  )}

                  {deleteConfirmId === comment.id ? (
                    <div className="mt-3 rounded-lg border border-red-200 bg-red-50/80 px-3 py-3">
                      <p className="text-xs leading-relaxed text-red-700">이 댓글을 삭제할까요?</p>
                      <div className="mt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          disabled={deletingCommentId === comment.id}
                          className="rounded-lg px-2.5 py-1 text-xs font-semibold text-deepOceanNavy transition-colors hover:bg-white/80"
                        >
                          취소
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(comment.id)}
                          disabled={deletingCommentId === comment.id}
                          className="rounded-lg bg-[#CA3838] px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-[#B52F2F] disabled:opacity-60"
                        >
                          {deletingCommentId === comment.id ? '삭제 중...' : '삭제'}
                        </button>
                      </div>
                    </div>
                  ) : null}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {reportTargetId !== null ? (
        <ReportModal
          targetType="COMMENT"
          targetId={reportTargetId}
          onClose={() => setReportTargetId(null)}
        />
      ) : null}
    </section>
  )
}

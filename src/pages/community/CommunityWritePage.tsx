import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ApiError } from '../../services/ApiError'
import { isAuthenticated } from '../../services/auth'
import { createPost, getPost, updatePost } from '../../services/post'
import {
  COMMUNITY_POST_TYPE_BY_SECTION,
  communitySections,
  getCommunityDetailPath,
  getCommunitySectionFromPath,
  type WritableCommunitySectionKey,
} from './communitySections'

const TITLE_MAX = 100
const CONTENT_MAX = 5000

function getPageCopy(sectionKey: WritableCommunitySectionKey, isEditMode: boolean) {
  if (isEditMode) {
    return {
      title: `${communitySections[sectionKey].label} 수정`,
      description: '작성한 내용을 확인한 뒤 저장해 주세요.',
    }
  }

  if (sectionKey === 'qna') {
    return {
      title: '질문 작성',
      description: '궁금한 점을 구체적으로 적어 주시면 더 빠르게 답변을 받을 수 있어요.',
    }
  }

  if (sectionKey === 'recruit') {
    return {
      title: '모집글 등록',
      description: '모집 대상, 일정, 지원 방법을 명확히 작성해 주세요.',
    }
  }

  return {
    title: '게시글 작성',
    description: '수강 경험과 정보를 커뮤니티에 공유해 보세요.',
  }
}

function getFieldCopy(sectionKey: WritableCommunitySectionKey) {
  if (sectionKey === 'qna') {
    return {
      titlePlaceholder: '질문 제목을 입력하세요',
      contentPlaceholder: '상황, 시도한 방법, 궁금한 점을 자세히 작성해 주세요.',
      contentLabel: '질문 내용',
    }
  }

  if (sectionKey === 'recruit') {
    return {
      titlePlaceholder: '모집 제목을 입력하세요',
      contentPlaceholder: '모집 대상, 진행 일정, 지원 방법, 마감일 등을 작성해 주세요.',
      contentLabel: '모집 내용',
    }
  }

  return {
    titlePlaceholder: '제목을 입력하세요',
    contentPlaceholder: '내용을 자유롭게 작성해 주세요.',
    contentLabel: '본문',
  }
}

function FormSkeleton() {
  return (
    <div className="animate-pulse space-y-6 rounded-2xl border border-mistSkyBlue/40 bg-white/70 p-6 md:p-8">
      <div className="h-5 w-32 rounded bg-mistSkyBlue/40" />
      <div className="space-y-2">
        <div className="h-4 w-16 rounded bg-mistSkyBlue/35" />
        <div className="h-11 w-full rounded-lg bg-mistSkyBlue/30" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-16 rounded bg-mistSkyBlue/35" />
        <div className="h-56 w-full rounded-lg bg-mistSkyBlue/30" />
      </div>
    </div>
  )
}

// 커뮤니티 작성/수정 페이지 (게시판, Q&A, 모집)
export default function CommunityWritePage() {
  const { pathname } = useLocation()
  const { postId, qnaId, recruitId } = useParams<{ postId?: string; qnaId?: string; recruitId?: string }>()
  const navigate = useNavigate()
  const sectionKey = getCommunitySectionFromPath(pathname)
  const isEditMode = pathname.includes('/edit/')

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [titleError, setTitleError] = useState<string | null>(null)
  const [contentError, setContentError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingPost, setIsLoadingPost] = useState(false)

  const writableSectionKey =
    sectionKey && sectionKey !== 'article' ? (sectionKey as WritableCommunitySectionKey) : null
  const rawTargetId =
    writableSectionKey === 'posts' ? postId : writableSectionKey === 'qna' ? qnaId : recruitId
  const targetPostId = rawTargetId ? Number(rawTargetId) : null

  const pageCopy = useMemo(
    () => (writableSectionKey ? getPageCopy(writableSectionKey, isEditMode) : null),
    [writableSectionKey, isEditMode],
  )
  const fieldCopy = useMemo(
    () => (writableSectionKey ? getFieldCopy(writableSectionKey) : null),
    [writableSectionKey],
  )

  useEffect(() => {
    if (!isEditMode || !targetPostId || Number.isNaN(targetPostId)) return
    setIsLoadingPost(true)
    getPost(targetPostId)
      .then((post) => {
        setTitle(post.title)
        setContent(post.content)
      })
      .catch((err: unknown) => {
        setSubmitError(err instanceof Error ? err.message : '게시글 정보를 불러올 수 없습니다.')
      })
      .finally(() => setIsLoadingPost(false))
  }, [isEditMode, targetPostId])

  if (!isAuthenticated()) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(pathname)}`} replace />
  }

  if (!writableSectionKey || !pageCopy || !fieldCopy) return null

  const section = communitySections[writableSectionKey]
  if (!('writeLabel' in section) || !('writePath' in section)) return null

  if (isEditMode && (!targetPostId || Number.isNaN(targetPostId))) {
    return <Navigate to={section.listPath} replace />
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()
    let hasError = false

    if (!trimmedTitle) {
      setTitleError('제목을 입력해 주세요.')
      hasError = true
    } else if (trimmedTitle.length > TITLE_MAX) {
      setTitleError(`제목은 ${TITLE_MAX}자 이내로 입력해 주세요.`)
      hasError = true
    } else {
      setTitleError(null)
    }

    if (!trimmedContent) {
      setContentError('내용을 입력해 주세요.')
      hasError = true
    } else if (trimmedContent.length > CONTENT_MAX) {
      setContentError(`내용은 ${CONTENT_MAX.toLocaleString()}자 이내로 입력해 주세요.`)
      hasError = true
    } else {
      setContentError(null)
    }

    if (hasError) return

    setSubmitError(null)
    setIsSubmitting(true)

    try {
      const post =
        isEditMode && targetPostId
          ? await updatePost(targetPostId, {
              title: trimmedTitle,
              content: trimmedContent,
            })
          : await createPost({
              postType: COMMUNITY_POST_TYPE_BY_SECTION[writableSectionKey],
              title: trimmedTitle,
              content: trimmedContent,
            })

      navigate(getCommunityDetailPath(writableSectionKey, post.id), {
        state: { title: post.title },
      })
    } catch (err) {
      if (err instanceof ApiError) {
        setSubmitError(err.message)
      } else {
        setSubmitError(isEditMode ? '게시글 수정 중 오류가 발생했습니다.' : '게시글 등록 중 오류가 발생했습니다.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormDisabled = isSubmitting || isLoadingPost
  const cancelPath = isEditMode ? '/dashboard/posts' : section.listPath

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-deepOceanNavy md:text-3xl">{pageCopy.title}</h1>
        <p className="text-sm leading-relaxed text-secondary md:text-[0.9375rem]">{pageCopy.description}</p>
      </header>

      {isLoadingPost ? (
        <FormSkeleton />
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="relative overflow-hidden rounded-2xl border border-mistSkyBlue/40 bg-white/75 shadow-[0_8px_32px_rgba(30,58,95,0.10)] backdrop-blur-sm"
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-softAquaBlue/20 to-transparent"
            aria-hidden="true"
          />

          <div className="relative space-y-6 p-6 md:p-8">
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="community-write-title" className="text-sm font-semibold text-deepOceanNavy">
                  제목 <span className="text-red-500">*</span>
                </label>
                <span className="text-xs tabular-nums text-secondary">
                  {title.trim().length}/{TITLE_MAX}
                </span>
              </div>
              <input
                id="community-write-title"
                type="text"
                value={title}
                maxLength={TITLE_MAX}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={fieldCopy.titlePlaceholder}
                disabled={isFormDisabled}
                className="w-full rounded-xl border border-mistSkyBlue/45 bg-white px-4 py-3 text-sm text-deepOceanNavy outline-none transition-all placeholder:text-softAquaBlue focus:border-waterlineBlue focus:ring-2 focus:ring-waterlineBlue/15 disabled:cursor-not-allowed disabled:opacity-60"
              />
              {titleError ? <p className="mt-2 text-xs text-red-500">{titleError}</p> : null}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="community-write-body" className="text-sm font-semibold text-deepOceanNavy">
                  {fieldCopy.contentLabel} <span className="text-red-500">*</span>
                </label>
                <span className="text-xs tabular-nums text-secondary">
                  {content.trim().length.toLocaleString()}/{CONTENT_MAX.toLocaleString()}
                </span>
              </div>
              <textarea
                id="community-write-body"
                rows={14}
                value={content}
                maxLength={CONTENT_MAX}
                onChange={(e) => setContent(e.target.value)}
                placeholder={fieldCopy.contentPlaceholder}
                disabled={isFormDisabled}
                className="w-full resize-y rounded-xl border border-mistSkyBlue/45 bg-white px-4 py-3 text-sm leading-relaxed text-deepOceanNavy outline-none transition-all placeholder:text-softAquaBlue focus:border-waterlineBlue focus:ring-2 focus:ring-waterlineBlue/15 disabled:cursor-not-allowed disabled:opacity-60"
              />
              {contentError ? <p className="mt-2 text-xs text-red-500">{contentError}</p> : null}
            </div>

            {submitError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {submitError}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col-reverse gap-2.5 border-t border-mistSkyBlue/35 bg-foamWhite/50 px-6 py-4 sm:flex-row sm:justify-end sm:gap-3 md:px-8">
            <Link
              to={cancelPath}
              className="inline-flex w-full items-center justify-center rounded-xl border border-mistSkyBlue/60 bg-white px-5 py-2.5 text-sm font-semibold text-deepOceanNavy transition-colors hover:border-waterlineBlue hover:text-waterlineBlue sm:w-auto"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={isFormDisabled}
              className="inline-flex w-full items-center justify-center rounded-xl bg-waterlineBlue px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(0,94,184,0.28)] transition-all hover:bg-[#005EB8] hover:shadow-[0_6px_18px_rgba(0,94,184,0.32)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isSubmitting ? (isEditMode ? '수정 중...' : '등록 중...') : isEditMode ? '수정 완료' : '등록하기'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

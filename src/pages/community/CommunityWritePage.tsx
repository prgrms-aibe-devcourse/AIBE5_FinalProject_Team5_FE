import { type FormEvent, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '../../services/ApiError'
import { isAuthenticated } from '../../services/auth'
import { createPost } from '../../services/post'
import {
  COMMUNITY_POST_TYPE_BY_SECTION,
  communitySections,
  getCommunityDetailPath,
  getCommunitySectionFromPath,
  type WritableCommunitySectionKey,
} from './communitySections'

// 커뮤니티 작성 페이지 컴포넌트 (게시판, Q&A, 모집)
export default function CommunityWritePage() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const sectionKey = getCommunitySectionFromPath(pathname)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [titleError, setTitleError] = useState<string | null>(null)
  const [contentError, setContentError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isAuthenticated()) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(pathname)}`} replace />
  }

  if (!sectionKey || sectionKey === 'article') return null

  const writableSectionKey = sectionKey as WritableCommunitySectionKey
  const section = communitySections[writableSectionKey]
  if (!('writeLabel' in section) || !('writePath' in section)) return null

  const titlePlaceholder =
    writableSectionKey === 'qna'
      ? '질문 제목을 입력하세요'
      : writableSectionKey === 'recruit'
        ? '모집 제목을 입력하세요'
        : '제목을 입력하세요'

  const bodyPlaceholder =
    writableSectionKey === 'qna'
      ? '궁금한 내용을 자세히 작성해 주세요.'
      : writableSectionKey === 'recruit'
        ? '모집 내용, 지원 방법, 마감일 등을 작성해 주세요.'
        : '내용을 작성해 주세요.'

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()
    let hasError = false

    if (!trimmedTitle) {
      setTitleError('제목을 입력해 주세요.')
      hasError = true
    } else {
      setTitleError(null)
    }

    if (!trimmedContent) {
      setContentError('내용을 입력해 주세요.')
      hasError = true
    } else {
      setContentError(null)
    }

    if (hasError) return

    setSubmitError(null)
    setIsSubmitting(true)

    try {
      const post = await createPost({
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
        setSubmitError('게시글 등록 중 오류가 발생했습니다.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-xl glass-panel p-6 shadow-sm md:p-8">
      <h2 className="text-xl font-bold text-deepOceanNavy md:text-2xl">{section.writeLabel}</h2>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="community-write-title" className="text-sm font-semibold text-deepOceanNavy">
            제목
          </label>
          <input
            id="community-write-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={titlePlaceholder}
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg border border-mistSkyBlue/45 bg-white px-3 py-2.5 text-sm text-deepOceanNavy outline-none transition-colors placeholder:text-softAquaBlue focus:border-waterlineBlue disabled:cursor-not-allowed disabled:opacity-60"
          />
          {titleError ? <p className="mt-1.5 text-xs text-red-500">{titleError}</p> : null}
        </div>

        <div>
          <label htmlFor="community-write-body" className="text-sm font-semibold text-deepOceanNavy">
            내용
          </label>
          <textarea
            id="community-write-body"
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={bodyPlaceholder}
            disabled={isSubmitting}
            className="mt-2 w-full resize-y rounded-lg border border-mistSkyBlue/45 bg-white px-3 py-2.5 text-sm leading-relaxed text-deepOceanNavy outline-none transition-colors placeholder:text-softAquaBlue focus:border-waterlineBlue disabled:cursor-not-allowed disabled:opacity-60"
          />
          {contentError ? <p className="mt-1.5 text-xs text-red-500">{contentError}</p> : null}
        </div>

        {submitError ? <p className="text-sm text-red-500">{submitError}</p> : null}

        <div className="flex flex-col-reverse gap-2.5 pt-2 sm:flex-row sm:flex-wrap sm:justify-end sm:gap-3">
          <Link
            to={section.listPath}
            className="inline-flex w-full items-center justify-center rounded-lg border border-mistSkyBlue/60 bg-white px-4 py-2.5 text-sm font-semibold text-deepOceanNavy transition-colors hover:border-waterlineBlue hover:text-waterlineBlue sm:w-auto"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-lg bg-waterlineBlue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#005EB8] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSubmitting ? '등록 중...' : '등록'}
          </button>
        </div>
      </form>
    </div>
  )
}

import { useEffect, useState } from 'react'
import {
  COURSE_REVIEW_MODAL_BODY,
  COURSE_REVIEW_MODAL_FOOTER,
  COURSE_REVIEW_MODAL_HEADER,
  COURSE_REVIEW_MODAL_OVERLAY,
  COURSE_REVIEW_MODAL_PANEL,
} from './courseReviewModalLayout.ts'

interface CourseGeneralReviewModalProps {
  isOpen: boolean
  mode?: 'create' | 'edit'
  initialValues?: { overallRating: number; content: string }
  onClose: () => void
  onBack?: () => void
  onSubmit?: (payload: { overallRating: number; content: string }) => void
  isSubmitting?: boolean
  submitError?: string | null
}

function StarButton({
  filled,
  onClick,
  label,
}: {
  filled: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`p-0.5 transition-transform hover:scale-110 ${filled ? 'text-[#F18D1E]' : 'text-mistSkyBlue/70'}`}
    >
      <svg className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M10 1.8l2.5 5.09 5.62.82-4.06 3.95.96 5.59L10 14.6l-5.02 2.64.96-5.59L1.88 7.7l5.62-.82L10 1.8z" />
      </svg>
    </button>
  )
}

export default function CourseGeneralReviewModal({
  isOpen,
  mode = 'create',
  initialValues,
  onClose,
  onBack,
  onSubmit,
  isSubmitting = false,
  submitError = null,
}: CourseGeneralReviewModalProps) {
  const [overallRating, setOverallRating] = useState(0)
  const [content, setContent] = useState('')
  const isEditMode = mode === 'edit'

  useEffect(() => {
    if (!isOpen) return

    if (initialValues) {
      setOverallRating(initialValues.overallRating)
      setContent(initialValues.content)
    } else {
      setOverallRating(0)
      setContent('')
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, initialValues])

  if (!isOpen) return null

  const isSubmitEnabled = overallRating > 0 && content.trim().length >= 10

  return (
    <div
      className={COURSE_REVIEW_MODAL_OVERLAY}
      role="dialog"
      aria-modal="true"
      aria-label={isEditMode ? '일반 후기 수정' : '일반 후기 작성'}
      onClick={onClose}
    >
      <div
        className={COURSE_REVIEW_MODAL_PANEL}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={COURSE_REVIEW_MODAL_HEADER}>
          <h2 className="text-lg font-bold text-deepOceanNavy sm:text-xl md:text-2xl">
            {isEditMode ? '일반 후기 수정' : '일반 후기 작성'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="일반 후기 작성 모달 닫기"
            className="rounded-lg p-2 text-secondary transition-colors hover:bg-white/80 hover:text-deepOceanNavy"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={`${COURSE_REVIEW_MODAL_BODY} space-y-4`}>
          <article className="rounded-xl border border-mistSkyBlue/45 bg-white p-4 shadow-[0_2px_10px_rgba(52,74,100,0.06)] sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <p className="text-base font-semibold text-deepOceanNavy md:text-lg">전체 평점</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, idx) => {
                  const value = idx + 1
                  return (
                    <StarButton
                      key={value}
                      filled={value <= overallRating}
                      onClick={() => setOverallRating(value)}
                      label={`전체 평점 ${value}점`}
                    />
                  )
                })}
                <span className="ml-2 text-sm font-semibold text-deepOceanNavy/80">{overallRating > 0 ? `${overallRating}점` : ''}</span>
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-mistSkyBlue/45 bg-white p-4 shadow-[0_2px_10px_rgba(52,74,100,0.06)] sm:p-5">
            <p className="text-base font-semibold text-deepOceanNavy md:text-lg">후기 내용</p>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="과정에 대한 전체적인 후기를 작성해 주세요. (최소 10자)"
              className="mt-3 h-36 w-full resize-none rounded-xl border border-mistSkyBlue/65 bg-foamWhite/30 p-3 text-sm text-deepOceanNavy outline-none transition-colors placeholder:text-secondary/70 focus:border-waterlineBlue sm:h-44 sm:p-4 sm:text-base"
            />
          </article>
        </div>

        {submitError ? (
          <div className="shrink-0 px-4 sm:px-6 md:px-7">
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
              {submitError}
            </div>
          </div>
        ) : null}

        <div className={COURSE_REVIEW_MODAL_FOOTER}>
          <div className="flex items-center justify-end gap-2">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                disabled={isSubmitting}
                className="inline-flex min-w-24 items-center justify-center rounded-lg border border-mistSkyBlue/60 bg-white px-5 py-2.5 text-sm font-semibold text-deepOceanNavy transition-colors hover:bg-foamWhite/60 disabled:cursor-not-allowed disabled:opacity-60"
              >
                이전
              </button>
            ) : null}
            <button
              type="button"
              disabled={!isSubmitEnabled || isSubmitting}
              onClick={() => onSubmit?.({ overallRating, content: content.trim() })}
              className="inline-flex min-w-24 items-center justify-center rounded-lg bg-deepOceanNavy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-waterlineBlue disabled:cursor-not-allowed disabled:bg-secondary/50"
            >
              {isSubmitting ? '저장 중...' : isEditMode ? '저장' : '제출'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

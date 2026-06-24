import { useEffect, useMemo, useState } from 'react'
import CourseReviewStepProgress from './CourseReviewStepProgress.tsx'
import {
  COURSE_REVIEW_MODAL_BODY,
  COURSE_REVIEW_MODAL_FOOTER,
  COURSE_REVIEW_MODAL_HEADER,
  COURSE_REVIEW_MODAL_OVERLAY,
  COURSE_REVIEW_MODAL_PANEL,
} from './courseReviewModalLayout.ts'

interface CourseVerifiedReviewStep3QualityModalProps {
  isOpen: boolean
  mode?: 'create' | 'edit'
  initialValues?: {
    instructorDeliveryRating: number
    curriculumRating: number
    employmentSupportRating: number
  }
  onClose: () => void
  onBack?: () => void
  onNext?: (payload: {
    instructorDeliveryRating: number
    curriculumRating: number
    employmentSupportRating: number
  }) => void
}

function StarButton({ filled, onClick, label }: { filled: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`p-0.5 transition-transform hover:scale-110 ${filled ? 'text-[#F18D1E]' : 'text-mistSkyBlue/70'}`}
    >
      <svg className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M10 1.8l2.5 5.09 5.62.82-4.06 3.95.96 5.59L10 14.6l-5.02 2.64.96-5.59L1.88 7.7l5.62-.82L10 1.8z" />
      </svg>
    </button>
  )
}

function RatingField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <article className="rounded-xl border border-mistSkyBlue/45 bg-white px-3 py-3 shadow-[0_2px_10px_rgba(52,74,100,0.06)] sm:px-4 sm:py-4 md:px-5">
      <div className="flex flex-col gap-2 sm:grid sm:items-center sm:gap-3 md:grid-cols-[170px_1fr]">
        <p className="text-base font-semibold text-deepOceanNavy sm:text-lg">{label}</p>
        <div className="flex flex-wrap items-center gap-0.5">
          {Array.from({ length: 5 }, (_, idx) => {
            const score = idx + 1
            return (
              <StarButton
                key={`${label}-${score}`}
                filled={score <= value}
                onClick={() => onChange(score)}
                label={`${label} ${score}점`}
              />
            )
          })}
          <span className="ml-1 text-xs font-semibold text-deepOceanNavy/80 sm:ml-2 sm:text-sm">{value > 0 ? `${value}점` : ''}</span>
        </div>
      </div>
    </article>
  )
}

export default function CourseVerifiedReviewStep3QualityModal({
  isOpen,
  mode = 'create',
  initialValues,
  onClose,
  onBack,
  onNext,
}: CourseVerifiedReviewStep3QualityModalProps) {
  const [instructorDeliveryRating, setInstructorDeliveryRating] = useState(0)
  const [curriculumRating, setCurriculumRating] = useState(0)
  const [employmentSupportRating, setEmploymentSupportRating] = useState(0)
  const isEditMode = mode === 'edit'

  useEffect(() => {
    if (!isOpen) return

    if (initialValues) {
      setInstructorDeliveryRating(initialValues.instructorDeliveryRating)
      setCurriculumRating(initialValues.curriculumRating)
      setEmploymentSupportRating(initialValues.employmentSupportRating)
    } else {
      setInstructorDeliveryRating(0)
      setCurriculumRating(0)
      setEmploymentSupportRating(0)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, initialValues])

  const isNextEnabled = useMemo(
    () => instructorDeliveryRating > 0 && curriculumRating > 0 && employmentSupportRating > 0,
    [curriculumRating, employmentSupportRating, instructorDeliveryRating],
  )

  if (!isOpen) return null

  return (
    <div
      className={COURSE_REVIEW_MODAL_OVERLAY}
      role="dialog"
      aria-modal="true"
      aria-label="인증 후기 작성 3단계"
      onClick={onClose}
    >
      <div
        className={COURSE_REVIEW_MODAL_PANEL}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={COURSE_REVIEW_MODAL_HEADER}>
          <h2 className="text-lg font-bold text-deepOceanNavy sm:text-xl md:text-2xl">
            {isEditMode ? '후기 수정' : '후기 작성'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="후기 작성 모달 닫기"
            className="rounded-lg p-2 text-secondary transition-colors hover:bg-white/80 hover:text-deepOceanNavy"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={COURSE_REVIEW_MODAL_BODY}>
          <CourseReviewStepProgress currentStep={3} />

          <div className="space-y-3">
            <RatingField label="강사 전달력" value={instructorDeliveryRating} onChange={setInstructorDeliveryRating} />
            <RatingField label="커리큘럼" value={curriculumRating} onChange={setCurriculumRating} />
            <RatingField label="취업 지원 만족도" value={employmentSupportRating} onChange={setEmploymentSupportRating} />
          </div>
        </div>

        <div className={COURSE_REVIEW_MODAL_FOOTER}>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex min-w-24 items-center justify-center rounded-lg border border-mistSkyBlue/60 bg-white px-5 py-2.5 text-sm font-semibold text-deepOceanNavy transition-colors hover:bg-foamWhite/60"
            >
              이전
            </button>
            <button
              type="button"
              disabled={!isNextEnabled}
              onClick={() =>
                onNext?.({
                  instructorDeliveryRating,
                  curriculumRating,
                  employmentSupportRating,
                })
              }
              className="inline-flex min-w-24 items-center justify-center rounded-lg bg-deepOceanNavy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-waterlineBlue disabled:cursor-not-allowed disabled:bg-secondary/50"
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

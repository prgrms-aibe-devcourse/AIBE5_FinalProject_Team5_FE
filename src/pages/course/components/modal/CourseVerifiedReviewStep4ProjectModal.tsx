import { useEffect, useMemo, useState } from 'react'
import CourseReviewStepProgress from './CourseReviewStepProgress.tsx'

interface CourseVerifiedReviewStep4ProjectModalProps {
  isOpen: boolean
  mode?: 'create' | 'edit'
  initialValues?: {
    projectCount: string
    projectAchievementRating: number
    toolSupportRating: number
    mentoringSatisfactionRating: number
  }
  onClose: () => void
  onBack?: () => void
  onNext?: (payload: {
    projectCount: string
    projectAchievementRating: number
    toolSupportRating: number
    mentoringSatisfactionRating: number
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
    <article className="rounded-xl border border-mistSkyBlue/45 bg-white px-4 py-4 shadow-[0_2px_10px_rgba(52,74,100,0.06)] md:px-5">
      <div className="grid items-center gap-3 md:grid-cols-[170px_1fr]">
        <p className="text-lg font-semibold text-deepOceanNavy">{label}</p>
        <div className="flex items-center gap-1">
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
          <span className="ml-2 text-sm font-semibold text-deepOceanNavy/80">{value > 0 ? `${value}점` : ''}</span>
        </div>
      </div>
    </article>
  )
}

export default function CourseVerifiedReviewStep4ProjectModal({
  isOpen,
  mode = 'create',
  initialValues,
  onClose,
  onBack,
  onNext,
}: CourseVerifiedReviewStep4ProjectModalProps) {
  const [projectCount, setProjectCount] = useState('')
  const [projectAchievementRating, setProjectAchievementRating] = useState(0)
  const [toolSupportRating, setToolSupportRating] = useState(0)
  const [mentoringSatisfactionRating, setMentoringSatisfactionRating] = useState(0)
  const isEditMode = mode === 'edit'

  useEffect(() => {
    if (!isOpen) return

    if (initialValues) {
      setProjectCount(initialValues.projectCount)
      setProjectAchievementRating(initialValues.projectAchievementRating)
      setToolSupportRating(initialValues.toolSupportRating)
      setMentoringSatisfactionRating(initialValues.mentoringSatisfactionRating)
    } else {
      setProjectCount('')
      setProjectAchievementRating(0)
      setToolSupportRating(0)
      setMentoringSatisfactionRating(0)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, initialValues])

  const isNextEnabled = useMemo(() => {
    const hasProjectCount = !!projectCount && Number(projectCount) > 0
    const hasRatings = projectAchievementRating > 0 && toolSupportRating > 0 && mentoringSatisfactionRating > 0
    return hasProjectCount && hasRatings
  }, [
    mentoringSatisfactionRating,
    projectAchievementRating,
    projectCount,
    toolSupportRating,
  ])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-deepOceanNavy/45 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label="인증 후기 작성 4단계"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90dvh] w-full max-w-[720px] flex-col overflow-hidden rounded-2xl border border-mistSkyBlue/50 glass-modal shadow-[0_18px_50px_rgba(36,57,84,0.28)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-mistSkyBlue/45 bg-gradient-to-r from-mistSkyBlue/55 via-softAquaBlue/40 to-waterlineBlue/20 px-6 py-4 md:px-7">
          <h2 className="text-xl font-bold text-deepOceanNavy md:text-2xl">
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

        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-7 md:px-7 md:pb-7">
          <CourseReviewStepProgress currentStep={4} />

          <div className="space-y-3">
            <article className="rounded-xl border border-mistSkyBlue/45 bg-white px-4 py-3.5 shadow-[0_2px_10px_rgba(52,74,100,0.06)] md:px-5">
              <div className="grid items-center gap-3 md:grid-cols-[170px_1fr]">
                <p className="text-lg font-semibold text-deepOceanNavy">프로젝트 수</p>
                <input
                  type="number"
                  min={1}
                  value={projectCount}
                  onChange={(event) => setProjectCount(event.target.value)}
                  placeholder="프로젝트 수를 입력해주세요"
                  className="h-12 w-full rounded-2xl border border-mistSkyBlue/65 bg-foamWhite/40 px-5 text-base font-semibold text-deepOceanNavy outline-none transition-colors placeholder:text-secondary/75 focus:border-waterlineBlue"
                />
              </div>
            </article>

            <RatingField label="프로젝트 성취도" value={projectAchievementRating} onChange={setProjectAchievementRating} />
            <RatingField label="툴 지원" value={toolSupportRating} onChange={setToolSupportRating} />
            <RatingField label="멘토링 만족도" value={mentoringSatisfactionRating} onChange={setMentoringSatisfactionRating} />
          </div>
        </div>

        <div className="border-t border-mistSkyBlue/45 px-6 py-4 md:px-7">
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
                  projectCount,
                  projectAchievementRating,
                  toolSupportRating,
                  mentoringSatisfactionRating,
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

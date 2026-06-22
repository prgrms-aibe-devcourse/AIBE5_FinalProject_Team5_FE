import { useEffect, useMemo, useState } from 'react'
import CourseReviewStepProgress from './CourseReviewStepProgress.tsx'

interface CourseVerifiedReviewStep2RatingModalProps {
  isOpen: boolean
  mode?: 'create' | 'edit'
  initialValues?: {
    courseDifficulty: string
    progressSpeed: string
    teamProjectDifficulty: string
    avgSelfStudyHours: string
  }
  onClose: () => void
  onBack?: () => void
  onNext?: (payload: {
    courseDifficulty: string
    progressSpeed: string
    teamProjectDifficulty: string
    avgSelfStudyHours: string
  }) => void
}

function SegmentField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <article className="rounded-xl border border-mistSkyBlue/45 bg-white px-4 py-3.5 shadow-[0_2px_10px_rgba(52,74,100,0.06)] md:px-5">
      <div className="grid items-center gap-3 md:grid-cols-[170px_1fr]">
        <p className="text-lg font-semibold text-deepOceanNavy">{label}</p>
        <div
          className="rounded-2xl border border-mistSkyBlue/65 bg-white p-1"
          style={{ display: 'grid', gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
        >
          {options.map((option) => {
            const isSelected = value === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                className={`rounded-xl px-3 py-2.5 text-base font-semibold transition-colors ${
                  isSelected ? 'bg-mistSkyBlue/55 text-deepOceanNavy' : 'text-secondary hover:bg-foamWhite/60'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>
    </article>
  )
}

export default function CourseVerifiedReviewStep2RatingModal({
  isOpen,
  mode = 'create',
  initialValues,
  onClose,
  onBack,
  onNext,
}: CourseVerifiedReviewStep2RatingModalProps) {
  const [courseDifficulty, setCourseDifficulty] = useState('')
  const [progressSpeed, setProgressSpeed] = useState('')
  const [teamProjectDifficulty, setTeamProjectDifficulty] = useState('')
  const [avgSelfStudyHours, setAvgSelfStudyHours] = useState('')
  const isEditMode = mode === 'edit'

  useEffect(() => {
    if (!isOpen) return

    if (initialValues) {
      setCourseDifficulty(initialValues.courseDifficulty)
      setProgressSpeed(initialValues.progressSpeed)
      setTeamProjectDifficulty(initialValues.teamProjectDifficulty)
      setAvgSelfStudyHours(initialValues.avgSelfStudyHours)
    } else {
      setCourseDifficulty('')
      setProgressSpeed('')
      setTeamProjectDifficulty('')
      setAvgSelfStudyHours('')
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, initialValues])

  const isNextEnabled = useMemo(() => {
    return (
      !!courseDifficulty &&
      !!progressSpeed &&
      !!teamProjectDifficulty &&
      !!avgSelfStudyHours &&
      Number(avgSelfStudyHours) > 0
    )
  }, [avgSelfStudyHours, courseDifficulty, progressSpeed, teamProjectDifficulty])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-deepOceanNavy/45 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label="인증 후기 작성 2단계"
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
          <CourseReviewStepProgress currentStep={2} />

          <div className="space-y-3">
            <SegmentField
              label="과정 난이도"
              value={courseDifficulty}
              onChange={setCourseDifficulty}
              options={[
                { value: 'high', label: '상' },
                { value: 'medium', label: '중' },
                { value: 'low', label: '하' },
              ]}
            />

            <SegmentField
              label="진도 속도"
              value={progressSpeed}
              onChange={setProgressSpeed}
              options={[
                { value: 'slow', label: '느림' },
                { value: 'moderate', label: '적당' },
                { value: 'fast', label: '빠름' },
              ]}
            />

            <SegmentField
              label="팀플 난이도"
              value={teamProjectDifficulty}
              onChange={setTeamProjectDifficulty}
              options={[
                { value: 'high', label: '상' },
                { value: 'medium', label: '중' },
                { value: 'low', label: '하' },
              ]}
            />

            <article className="rounded-xl border border-mistSkyBlue/45 bg-white px-4 py-3.5 shadow-[0_2px_10px_rgba(52,74,100,0.06)] md:px-5">
              <div className="grid items-center gap-3 md:grid-cols-[170px_1fr]">
                <p className="text-lg font-semibold text-deepOceanNavy">하루 평균 자습 시간</p>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    value={avgSelfStudyHours}
                    onChange={(event) => setAvgSelfStudyHours(event.target.value)}
                    placeholder="시간을 입력해주세요"
                    className="h-12 w-full rounded-2xl border border-mistSkyBlue/65 bg-foamWhite/40 px-5 pr-12 text-base font-semibold text-deepOceanNavy outline-none transition-colors placeholder:text-secondary/75 focus:border-waterlineBlue"
                  />
                  <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-sm font-semibold text-secondary">
                    시간
                  </span>
                </div>
              </div>
            </article>
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
                  courseDifficulty,
                  progressSpeed,
                  teamProjectDifficulty,
                  avgSelfStudyHours,
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

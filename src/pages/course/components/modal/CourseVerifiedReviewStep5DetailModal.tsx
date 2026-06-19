import { useEffect, useState } from 'react'
import CourseReviewStepProgress from './CourseReviewStepProgress.tsx'
import CourseFilterSelect from '../CourseFilterSelect.tsx'
import type { CourseFilterConfig } from '../../../../services/course.ts'

interface CourseVerifiedReviewStep5DetailModalProps {
  isOpen: boolean
  onClose: () => void
  onBack?: () => void
  onSubmit?: (payload: {
    completionStatus: string
    dropoutMajorReason: string
    dropoutSubReason: string
    collaborationComment: string
    employmentStatus: string
  }) => void
  isSubmitting?: boolean
  submitError?: string | null
}

const DROPOUT_MAJOR_REASON_FILTER: CourseFilterConfig = {
  id: 'dropoutMajorReason',
  label: '포기 사유(대분류)',
  options: [
    { value: 'difficulty', label: '난이도' },
    { value: 'schedule', label: '시간/일정' },
    { value: 'career', label: '진로 변경' },
    { value: 'etc', label: '기타' },
  ],
}

const DROPOUT_SUB_REASON_OPTIONS: Record<string, { value: string; label: string }[]> = {
  difficulty: [
    { value: 'too_hard', label: '강의 난이도가 높음' },
    { value: 'base_lack', label: '기초 지식 부족' },
  ],
  schedule: [
    { value: 'work_conflict', label: '업무 병행 어려움' },
    { value: 'personal_schedule', label: '개인 일정 충돌' },
  ],
  career: [
    { value: 'change_goal', label: '진로 목표 변경' },
    { value: 'other_program', label: '타 교육 선택' },
  ],
  etc: [
    { value: 'etc_other', label: '기타' },
  ],
}

function SegmentControl({
  value,
  options,
  onChange,
}: {
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <div className="grid grid-cols-2 rounded-2xl border border-mistSkyBlue/65 bg-white p-1 sm:grid-cols-3">
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
  )
}

export default function CourseVerifiedReviewStep5DetailModal({
  isOpen,
  onClose,
  onBack,
  onSubmit,
  isSubmitting = false,
  submitError = null,
}: CourseVerifiedReviewStep5DetailModalProps) {
  const [completionStatus, setCompletionStatus] = useState('dropout')
  const [dropoutMajorReason, setDropoutMajorReason] = useState('')
  const [dropoutSubReason, setDropoutSubReason] = useState('')
  const [collaborationComment, setCollaborationComment] = useState('')
  const [employmentStatus, setEmploymentStatus] = useState('employed')

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const requiresDropoutReason = completionStatus === 'dropout'
  const canSubmit = !requiresDropoutReason || (dropoutMajorReason && dropoutSubReason)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-deepOceanNavy/45 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label="인증 후기 작성 5단계"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90dvh] w-full max-w-[720px] flex-col overflow-hidden rounded-2xl border border-mistSkyBlue/50 glass-modal shadow-[0_18px_50px_rgba(36,57,84,0.28)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-mistSkyBlue/45 bg-gradient-to-r from-mistSkyBlue/55 via-softAquaBlue/40 to-waterlineBlue/20 px-6 py-4 md:px-7">
          <h2 className="text-xl font-bold text-deepOceanNavy md:text-2xl">후기 작성</h2>
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
          <CourseReviewStepProgress currentStep={5} />

          <div className="space-y-4">
            <article className="rounded-xl border border-mistSkyBlue/45 bg-white p-4 shadow-[0_2px_10px_rgba(52,74,100,0.06)] md:p-5">
              <div className="grid items-center gap-3 md:grid-cols-[190px_1fr]">
                <p className="text-lg font-semibold text-deepOceanNavy">수료 여부</p>
                <SegmentControl
                  value={completionStatus}
                  onChange={setCompletionStatus}
                  options={[
                    { value: 'completed', label: '수료' },
                    { value: 'ongoing', label: '수강 중' },
                    { value: 'dropout', label: '중도 포기' },
                  ]}
                />
              </div>

              {requiresDropoutReason ? (
                <div className="mt-4 border-t border-mistSkyBlue/35 pt-4">
                  <div className="grid items-center gap-3 md:grid-cols-1">
                    <p className="text-lg font-semibold text-deepOceanNavy">중도 포기 사유</p>
                    <CourseFilterSelect
                      filter={DROPOUT_MAJOR_REASON_FILTER}
                      value={dropoutMajorReason}
                      onChange={(value) => {
                        setDropoutMajorReason(value)
                        setDropoutSubReason('')
                      }}
                    />
                    <CourseFilterSelect
                      filter={{
                        id: 'dropoutSubReason',
                        label: '포기 사유(중분류)',
                        options: DROPOUT_SUB_REASON_OPTIONS[dropoutMajorReason] ?? [],
                      }}
                      value={dropoutSubReason}
                      onChange={setDropoutSubReason}
                    />
                  </div>
                </div>
              ) : null}

              {completionStatus === 'completed' ? (
                <div className="mt-4 border-t border-mistSkyBlue/35 pt-4">
                  <div className="grid items-center gap-3 md:grid-cols-[190px_1fr]">
                    <p className="text-lg font-semibold text-deepOceanNavy">6개월 내 취업</p>
                    <div className="grid grid-cols-2 rounded-2xl border border-mistSkyBlue/65 bg-white p-1">
                      {[
                        { value: 'employed', label: '취업' },
                        { value: 'preparing', label: '준비중' },
                      ].map((option) => {
                        const isSelected = employmentStatus === option.value
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setEmploymentStatus(option.value)}
                            className={`rounded-xl px-4 py-2.5 text-base font-semibold transition-colors ${
                              isSelected ? 'bg-mistSkyBlue/55 text-deepOceanNavy' : 'text-secondary hover:bg-foamWhite/60'
                            }`}
                          >
                            {option.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ) : null}
            </article>

            <article className="rounded-xl border border-mistSkyBlue/45 bg-white p-4 shadow-[0_2px_10px_rgba(52,74,100,0.06)] md:p-5">
              <p className="text-lg font-semibold text-deepOceanNavy">자유 후기</p>
              <textarea
                value={collaborationComment}
                onChange={(event) => setCollaborationComment(event.target.value)}
                placeholder="과정 전반에 대한 의견을 자유롭게 작성해 주세요."
                className="mt-3 h-40 w-full resize-none rounded-xl border border-mistSkyBlue/65 bg-foamWhite/30 p-4 text-base text-deepOceanNavy outline-none transition-colors placeholder:text-secondary/70 focus:border-waterlineBlue"
              />
            </article>

          </div>
        </div>

        {submitError ? (
          <div className="px-6 md:px-7">
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
              {submitError}
            </div>
          </div>
        ) : null}

        <div className="border-t border-mistSkyBlue/45 px-6 py-4 md:px-7">
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="inline-flex min-w-24 items-center justify-center rounded-lg border border-mistSkyBlue/60 bg-white px-5 py-2.5 text-sm font-semibold text-deepOceanNavy transition-colors hover:bg-foamWhite/60 disabled:cursor-not-allowed disabled:opacity-60"
            >
              이전
            </button>
            <button
              type="button"
              disabled={!canSubmit || isSubmitting}
              onClick={() =>
                onSubmit?.({
                  completionStatus,
                  dropoutMajorReason,
                  dropoutSubReason,
                  collaborationComment,
                  employmentStatus,
                })
              }
              className="inline-flex min-w-24 items-center justify-center rounded-lg bg-deepOceanNavy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-waterlineBlue disabled:cursor-not-allowed disabled:bg-secondary/50"
            >
              {isSubmitting ? '제출 중...' : '제출'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

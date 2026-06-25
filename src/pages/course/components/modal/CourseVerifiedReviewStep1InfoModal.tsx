import { useEffect, useState } from 'react'
import CourseReviewStepProgress from './CourseReviewStepProgress.tsx'
import CourseFilterSelect from '../CourseFilterSelect.tsx'
import type { CourseFilterConfig } from '../../../../services/course.ts'
import {
  COURSE_REVIEW_MODAL_BODY,
  COURSE_REVIEW_MODAL_FOOTER,
  COURSE_REVIEW_MODAL_HEADER,
  COURSE_REVIEW_MODAL_OVERLAY,
  COURSE_REVIEW_MODAL_PANEL,
} from './courseReviewModalLayout.ts'

interface CourseVerifiedReviewStep1InfoModalProps {
  isOpen: boolean
  mode?: 'create' | 'edit'
  initialValues?: {
    priorKnowledgeLevel: string
    age: string
    learningGoal: string
    attendanceType: string
    cohort: string
  }
  onClose: () => void
  onBack?: () => void
  onNext?: (payload: {
    priorKnowledgeLevel: string
    age: string
    learningGoal: string
    attendanceType: string
    cohort: string
  }) => void
}

const LEARNING_GOAL_FILTER: CourseFilterConfig = {
  id: 'learningGoal',
  label: '목적을 선택해주세요',
  options: [
    { value: 'employment', label: '취업' },
    { value: 'career_change', label: '이직' },
    { value: 'portfolio', label: '포트폴리오' },
    { value: 'startup', label: '창업' },
    { value: 'etc', label: '기타' },
  ],
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
    <article className="rounded-xl border border-mistSkyBlue/45 bg-white px-3 py-3 shadow-[0_2px_10px_rgba(52,74,100,0.06)] sm:px-4 sm:py-3.5 md:px-5">
      <div className="grid items-center gap-2 sm:gap-3 md:grid-cols-[170px_1fr]">
        <p className="text-base font-semibold text-deepOceanNavy sm:text-lg">{label}</p>
        <div
          className="grid gap-0.5 rounded-xl border border-mistSkyBlue/65 bg-white p-0.5 sm:rounded-2xl sm:p-1"
          style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
        >
          {options.map((option) => {
            const isSelected = value === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                className={`rounded-lg px-1 py-2 text-xs font-semibold transition-colors sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-base ${
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

export default function CourseVerifiedReviewStep1InfoModal({
  isOpen,
  mode = 'create',
  initialValues,
  onClose,
  onBack,
  onNext,
}: CourseVerifiedReviewStep1InfoModalProps) {
  const [priorKnowledgeLevel, setPriorKnowledgeLevel] = useState('non_major')
  const [age, setAge] = useState('')
  const [learningGoal, setLearningGoal] = useState('')
  const [attendanceType, setAttendanceType] = useState('online')
  const [cohort, setCohort] = useState('')
  const isEditMode = mode === 'edit'

  useEffect(() => {
    if (!isOpen) return

    if (initialValues) {
      setPriorKnowledgeLevel(initialValues.priorKnowledgeLevel)
      setAge(initialValues.age)
      setLearningGoal(initialValues.learningGoal)
      setAttendanceType(initialValues.attendanceType)
      setCohort(initialValues.cohort)
    } else {
      setPriorKnowledgeLevel('non_major')
      setAge('')
      setLearningGoal('')
      setAttendanceType('online')
      setCohort('')
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, initialValues])

  if (!isOpen) return null

  return (
    <div
      className={COURSE_REVIEW_MODAL_OVERLAY}
      role="dialog"
      aria-modal="true"
      aria-label={isEditMode ? '인증 후기 수정 1단계' : '인증 후기 작성 1단계'}
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
          <CourseReviewStepProgress currentStep={1} />

          <div className="space-y-3">
            <article className="rounded-xl border border-mistSkyBlue/45 bg-white px-3 py-3 shadow-[0_2px_10px_rgba(52,74,100,0.06)] sm:px-4 sm:py-3.5 md:px-5">
              <div className="grid items-center gap-2 sm:gap-3 md:grid-cols-[170px_1fr]">
                <p className="text-base font-semibold text-deepOceanNavy sm:text-lg">기수</p>
                <input
                  type="number"
                  min={1}
                  value={cohort}
                  onChange={(event) => setCohort(event.target.value)}
                  placeholder="기수를 입력해주세요"
                  className="h-11 w-full rounded-xl border border-mistSkyBlue/65 bg-foamWhite/40 px-4 text-sm font-semibold text-deepOceanNavy outline-none transition-colors placeholder:text-secondary/75 focus:border-waterlineBlue sm:h-12 sm:rounded-2xl sm:px-5 sm:text-base"
                />
              </div>
            </article>

            <article className="rounded-xl border border-mistSkyBlue/45 bg-white px-3 py-3 shadow-[0_2px_10px_rgba(52,74,100,0.06)] sm:px-4 sm:py-3.5 md:px-5">
              <div className="grid items-center gap-2 sm:gap-3 md:grid-cols-[170px_1fr]">
                <p className="text-base font-semibold text-deepOceanNavy sm:text-lg">연령대</p>
                <input
                  type="number"
                  min={1}
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                  placeholder="나이를 입력해주세요"
                  className="h-11 w-full rounded-xl border border-mistSkyBlue/65 bg-foamWhite/40 px-4 text-sm font-semibold text-deepOceanNavy outline-none transition-colors placeholder:text-secondary/75 focus:border-waterlineBlue sm:h-12 sm:rounded-2xl sm:px-5 sm:text-base"
                />
              </div>
            </article>

            <article className="rounded-xl border border-mistSkyBlue/45 bg-white px-3 py-3 shadow-[0_2px_10px_rgba(52,74,100,0.06)] sm:px-4 sm:py-3.5 md:px-5">
              <div className="grid items-center gap-2 sm:gap-3 md:grid-cols-[170px_1fr]">
                <p className="text-base font-semibold text-deepOceanNavy sm:text-lg">학습 주목적</p>
                <CourseFilterSelect filter={LEARNING_GOAL_FILTER} value={learningGoal} onChange={setLearningGoal} />
              </div>
            </article>

            <SegmentField
              label="선수 지식 수준"
              value={priorKnowledgeLevel}
              options={[
                { value: 'non_major', label: '비전공' },
                { value: 'major', label: '전공' },
                { value: 'working', label: '현직' },
              ]}
              onChange={setPriorKnowledgeLevel}
            />

            <SegmentField
              label="수강 형태"
              value={attendanceType}
              options={[
                { value: 'online', label: '온라인' },
                { value: 'offline', label: '오프라인' },
                { value: 'hybrid', label: '혼합' },
              ]}
              onChange={setAttendanceType}
            />

            
          </div>
        </div>

        <div className={COURSE_REVIEW_MODAL_FOOTER}>
          <div className="flex items-center justify-end gap-2">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex min-w-24 items-center justify-center rounded-lg border border-mistSkyBlue/60 bg-white px-5 py-2.5 text-sm font-semibold text-deepOceanNavy transition-colors hover:bg-foamWhite/60"
              >
                이전
              </button>
            ) : null}
            <button
              type="button"
              disabled={
                !age ||
                Number(age) <= 0 ||
                !learningGoal ||
                !cohort ||
                Number(cohort) <= 0
              }
              onClick={() =>
                onNext?.({
                  priorKnowledgeLevel,
                  age,
                  learningGoal,
                  attendanceType,
                  cohort,
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

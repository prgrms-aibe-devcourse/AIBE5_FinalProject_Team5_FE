import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  COURSE_REVIEW_MODAL_BODY,
  COURSE_REVIEW_MODAL_HEADER,
  COURSE_REVIEW_MODAL_OVERLAY,
  COURSE_REVIEW_MODAL_PANEL,
} from './courseReviewModalLayout.ts'

type ReviewType = 'general' | 'verified'

interface CourseReviewTypeSelectModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectType?: (type: ReviewType) => void
  warningMessage?: string | null
}

const REVIEW_TYPE_OPTIONS: { id: ReviewType; label: string; description: string; emoji: string }[] = [
  { id: 'general', label: '일반 후기', description: '수강 경험을 자유롭게 남겨요.', emoji: '✍️' },
  { id: 'verified', label: '인증 후기', description: '인증 절차 후 신뢰도 높은 후기를 작성해요.', emoji: '✅' },
]

export default function CourseReviewTypeSelectModal({
  isOpen,
  onClose,
  onSelectType,
  warningMessage,
}: CourseReviewTypeSelectModalProps) {
  const [selectedType, setSelectedType] = useState<ReviewType>('verified')

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return
    setSelectedType('verified')
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className={COURSE_REVIEW_MODAL_OVERLAY}
      role="dialog"
      aria-modal="true"
      aria-label="후기 유형 선택"
      onClick={onClose}
    >
      <div
        className={COURSE_REVIEW_MODAL_PANEL}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={COURSE_REVIEW_MODAL_HEADER}>
          <h2 className="text-lg font-bold text-deepOceanNavy sm:text-xl md:text-2xl">후기 유형 선택</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="후기 유형 선택 모달 닫기"
            className="rounded-lg p-2 text-secondary transition-colors hover:bg-white/80 hover:text-deepOceanNavy"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={COURSE_REVIEW_MODAL_BODY}>
          <div className="grid gap-3 sm:grid-cols-2">
            {REVIEW_TYPE_OPTIONS.map((option) => {
              const isSelected = selectedType === option.id

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setSelectedType(option.id)
                    onSelectType?.(option.id)
                  }}
                  className="rounded-xl border border-mistSkyBlue/50 bg-white p-4 text-left transition-colors hover:bg-foamWhite/70 sm:aspect-square sm:p-6"
                  aria-pressed={isSelected}
                >
                  <div className="min-w-0 text-center">
                      <span
                        className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-mistSkyBlue/55 bg-foamWhite/65 text-xl sm:mb-3 sm:h-14 sm:w-14 sm:text-2xl"
                        aria-hidden="true"
                      >
                        {option.emoji}
                      </span>
                      <p className="text-base font-semibold text-deepOceanNavy sm:text-lg">{option.label}</p>
                      <p className="mt-1 text-xs text-secondary sm:text-[0.92rem]">{option.description}</p>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-mistSkyBlue/45 bg-foamWhite/45 px-4 py-3 text-sm text-deepOceanNavy/80">
            <p>* 프리미엄 후기는 별도 인증 과정이 필요합니다.</p>
            <Link
              to="/dashboard/profile"
              onClick={onClose}
              className="font-semibold text-waterlineBlue underline underline-offset-2 hover:text-deepOceanNavy"
            >
              인증하러 가기
            </Link>
          </div>

          {warningMessage ? (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
              {warningMessage}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'

type ReviewType = 'general' | 'verified'

interface CourseReviewTypeSelectModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectType?: (type: ReviewType) => void
  warningMessage?: string | null
}

const REVIEW_TYPE_OPTIONS: { id: ReviewType; label: string; description: string; emoji: string }[] = [
  { id: 'general', label: '일반 리뷰', description: '수강 경험을 자유롭게 남겨요.', emoji: '✍️' },
  { id: 'verified', label: '인증 리뷰', description: '인증 절차 후 신뢰도 높은 리뷰를 작성해요.', emoji: '✅' },
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-deepOceanNavy/45 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label="리뷰 유형 선택"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[720px] overflow-hidden rounded-2xl border border-mistSkyBlue/50 bg-white shadow-[0_18px_50px_rgba(36,57,84,0.28)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-mistSkyBlue/45 bg-gradient-to-r from-mistSkyBlue/55 via-softAquaBlue/40 to-waterlineBlue/20 px-6 py-4 md:px-7">
          <h2 className="text-xl font-bold text-deepOceanNavy md:text-2xl">리뷰 유형 선택</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="리뷰 유형 선택 모달 닫기"
            className="rounded-lg p-2 text-secondary transition-colors hover:bg-white/80 hover:text-deepOceanNavy"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-6 pt-7 md:px-7 md:pb-7">
          <div className="grid gap-3 md:grid-cols-2">
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
                  className="aspect-square rounded-xl border border-mistSkyBlue/50 bg-white p-6 text-left transition-colors hover:bg-foamWhite/70"
                  aria-pressed={isSelected}
                >
                  <div className="min-w-0 text-center">
                      <span
                        className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full border border-mistSkyBlue/55 bg-foamWhite/65 text-2xl"
                        aria-hidden="true"
                      >
                        {option.emoji}
                      </span>
                      <p className="text-lg font-semibold text-deepOceanNavy">{option.label}</p>
                      <p className="mt-1 text-[0.92rem] text-secondary">{option.description}</p>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-mistSkyBlue/45 bg-foamWhite/45 px-4 py-3 text-sm text-deepOceanNavy/80">
            <p>* 프리미엄 리뷰는 별도 인증 과정이 필요합니다.</p>
            <a href="#" className="font-semibold text-waterlineBlue underline underline-offset-2 hover:text-deepOceanNavy">
              인증하러 가기
            </a>
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

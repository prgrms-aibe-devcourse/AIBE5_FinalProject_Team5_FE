import { useEffect } from 'react'

interface CourseReviewSubmitSuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CourseReviewSubmitSuccessModal({ isOpen, onClose }: CourseReviewSubmitSuccessModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-deepOceanNavy/45 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label="후기 작성 완료"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[720px] overflow-hidden rounded-2xl border border-mistSkyBlue/50 glass-modal shadow-[0_18px_50px_rgba(36,57,84,0.28)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-mistSkyBlue/45 bg-gradient-to-r from-mistSkyBlue/55 via-softAquaBlue/40 to-waterlineBlue/20 px-6 py-4 md:px-7">
          <h2 className="text-xl font-bold text-deepOceanNavy md:text-2xl">후기 작성 완료</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="후기 작성 완료 모달 닫기"
            className="rounded-lg p-2 text-secondary transition-colors hover:bg-white/80 hover:text-deepOceanNavy"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-7 pt-8 text-center md:px-7">
          <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-mistSkyBlue/35 text-3xl">
            🎉
          </span>
          <p className="mt-4 text-lg font-semibold text-deepOceanNavy">후기 작성이 완료되었습니다.</p>
          <p className="mt-1 text-sm text-secondary">소중한 후기를 남겨주셔서 감사합니다.</p>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-w-28 items-center justify-center rounded-lg bg-deepOceanNavy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-waterlineBlue"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

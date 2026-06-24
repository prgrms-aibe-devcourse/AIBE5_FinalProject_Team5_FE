import { useEffect } from 'react'
import {
  COURSE_REVIEW_MODAL_BODY,
  COURSE_REVIEW_MODAL_HEADER,
  COURSE_REVIEW_MODAL_OVERLAY,
  COURSE_REVIEW_MODAL_PANEL,
} from './courseReviewModalLayout.ts'

interface CourseReviewSubmitSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  message?: string
}

export default function CourseReviewSubmitSuccessModal({
  isOpen,
  onClose,
  message,
}: CourseReviewSubmitSuccessModalProps) {
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
      className={COURSE_REVIEW_MODAL_OVERLAY}
      role="dialog"
      aria-modal="true"
      aria-label={message ? '후기 수정 완료' : '후기 작성 완료'}
      onClick={onClose}
    >
      <div
        className={COURSE_REVIEW_MODAL_PANEL}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={COURSE_REVIEW_MODAL_HEADER}>
          <h2 className="text-lg font-bold text-deepOceanNavy sm:text-xl md:text-2xl">
            {message ? '후기 수정 완료' : '후기 작성 완료'}
          </h2>
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

        <div className={`${COURSE_REVIEW_MODAL_BODY} text-center`}>
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-mistSkyBlue/35 text-2xl sm:h-16 sm:w-16 sm:text-3xl">
            🎉
          </span>
          <p className="mt-4 text-base font-semibold text-deepOceanNavy sm:text-lg">
            {message ?? '후기 작성이 완료되었습니다.'}
          </p>
          <p className="mt-1 text-sm text-secondary">
            {message ? '변경 사항이 저장되었습니다.' : '소중한 후기를 남겨주셔서 감사합니다.'}
          </p>

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

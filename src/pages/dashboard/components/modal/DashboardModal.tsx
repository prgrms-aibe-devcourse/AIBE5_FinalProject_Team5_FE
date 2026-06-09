import { useEffect, type ReactNode } from 'react'

type DashboardModalProps = {
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  maxWidthClass?: string
  ariaLabelledBy?: string
}

export default function DashboardModal({
  title,
  onClose,
  children,
  footer,
  maxWidthClass = 'max-w-2xl',
  ariaLabelledBy = 'dashboard-modal-title',
}: DashboardModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-deepOceanNavy/45 px-4 py-6"
      role="presentation"
      onClick={onClose}
    >
      <div
        className={`glass-modal flex max-h-[90vh] w-full ${maxWidthClass} flex-col overflow-hidden rounded-2xl border border-mistSkyBlue/50 shadow-[0_18px_50px_rgba(36,57,84,0.28)]`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="shrink-0 border-b border-mistSkyBlue/45 bg-linear-to-r from-mistSkyBlue/55 via-softAquaBlue/40 to-waterlineBlue/20 px-6 py-5 md:px-7">
          <div className="flex items-start justify-between gap-4">
            <h2 id={ariaLabelledBy} className="font-pretendard text-lg font-bold text-deepOceanNavy md:text-xl">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-secondary transition-colors hover:bg-white/80 hover:text-deepOceanNavy"
              aria-label="닫기"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 md:px-7">{children}</div>

        {footer ? (
          <div className="shrink-0 border-t border-mistSkyBlue/45 bg-transparent px-6 py-4 md:px-7">{footer}</div>
        ) : null}
      </div>
    </div>
  )
}

interface ToastProps {
  message: string
  onClose: () => void
  variant?: 'error' | 'info'
  className?: string
}

export default function Toast({ message, onClose, variant = 'info', className }: ToastProps) {
  const toneClassName =
    variant === 'error'
      ? 'border-red-200 bg-red-50 text-red-800 shadow-[0_10px_24px_rgba(127,29,29,0.18)]'
      : 'border-mistSkyBlue/60 bg-white text-deepOceanNavy shadow-[0_10px_24px_rgba(36,57,84,0.16)]'

  const iconClassName =
    variant === 'error' ? 'bg-red-100 text-red-700' : 'bg-waterlineBlue/15 text-waterlineBlue'

  const closeButtonClassName =
    variant === 'error'
      ? 'text-red-500 hover:bg-red-100 hover:text-red-700'
      : 'text-secondary hover:bg-foamWhite/80 hover:text-deepOceanNavy'

  return (
    <div className={`fixed right-6 top-6 z-[70] max-w-[360px] rounded-xl border px-4 py-3 ${toneClassName} ${className ?? ''}`}>
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${iconClassName}`}>
          {variant === 'error' ? '!' : 'i'}
        </span>
        <p className="text-sm font-medium leading-5">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className={`ml-auto rounded p-1 transition-colors ${closeButtonClassName}`}
          aria-label="알림 닫기"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

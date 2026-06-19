export function getEvidenceFileExtension(fileName: string) {
  const parts = fileName.split('.')
  if (parts.length < 2) return null

  const extension = parts.pop()?.trim().toLowerCase()
  return extension || null
}

export function truncateFileName(fileName: string, maxLength = 26) {
  if (fileName.length <= maxLength) return fileName

  const extension = getEvidenceFileExtension(fileName)
  if (extension) {
    const baseName = fileName.slice(0, fileName.length - extension.length - 1)
    const reservedLength = extension.length + 4
    const availableLength = maxLength - reservedLength

    if (availableLength > 0) {
      return `${baseName.slice(0, availableLength)}...${extension}`
    }
  }

  return `${fileName.slice(0, maxLength - 3)}...`
}

type EvidenceThumbnailPlaceholderProps = {
  className?: string
  size?: 'sm' | 'lg'
}

export function EvidenceThumbnailPlaceholder({
  className = '',
  size = 'lg',
}: EvidenceThumbnailPlaceholderProps) {
  const dimension = size === 'sm' ? 'h-10 w-10' : 'h-16 w-16'
  const iconSize = size === 'sm' ? 18 : 32

  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-foamWhite to-mistSkyBlue/35 text-waterlineBlue ring-1 ring-mistSkyBlue/45 ${dimension} ${className}`}
      aria-hidden="true"
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="9" cy="10" r="1.6" fill="currentColor" />
        <path
          d="M3 15l4.5-4.5a1 1 0 011.4 0L14 16l2.1-2.1a1 1 0 011.4 0L21 17"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

type EvidencePreviewFallbackProps = {
  fileName: string
  message: string
  onRetry?: () => void
  downloadUrl?: string | null
  isLoading?: boolean
}

export function EvidencePreviewFallback({
  fileName,
  message,
  onRetry,
  downloadUrl,
  isLoading = false,
}: EvidencePreviewFallbackProps) {
  return (
    <div className="flex h-full min-h-[320px] w-full max-w-2xl flex-col items-center justify-center rounded-2xl border border-dashed border-mistSkyBlue/60 bg-white px-6 py-12 text-center shadow-[0_2px_12px_rgba(52,74,100,0.04)]">
      <EvidenceThumbnailPlaceholder className={isLoading ? 'animate-pulse opacity-70' : ''} />
      <p className="mt-5 font-pretendard text-base font-bold text-deepOceanNavy">{fileName}</p>
      <p className="mt-2 max-w-sm font-pretendard text-sm leading-relaxed text-secondary">{message}</p>

      {!isLoading && (onRetry || downloadUrl) ? (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center justify-center rounded-full border border-mistSkyBlue/60 bg-white px-5 py-2.5 font-pretendard text-sm font-semibold text-deepOceanNavy transition-colors hover:border-waterlineBlue hover:bg-foamWhite/60"
            >
              다시 시도
            </button>
          ) : null}
          {downloadUrl ? (
            <a
              href={downloadUrl}
              download={fileName}
              className="inline-flex items-center justify-center rounded-full border border-mistSkyBlue/60 bg-white px-5 py-2.5 font-pretendard text-sm font-semibold text-deepOceanNavy transition-colors hover:border-waterlineBlue hover:bg-foamWhite/60"
            >
              파일 다운로드
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

import { useState } from 'react'
import { getCourseInitials, pickGradient } from '../../../utils/courseThumbnail.ts'

interface CourseThumbnailProps {
  imageUrl?: string | null
  alt?: string
  className?: string
  variant?: 'banner' | 'square'
  /** 기관명 — 로고가 없을 때 이니셜 칩으로 표시 */
  company?: string
  /** 그라디언트 결정용 seed (보통 과정 id). 없으면 company/alt로 대체 */
  seed?: string
}

function CourseThumbnailPlaceholder({
  company,
  seed,
  compact = false,
}: {
  company?: string
  seed?: string
  compact?: boolean
}) {
  const gradient = pickGradient(seed || company || 'bootsignal')
  const initials = getCourseInitials(company)

  return (
    <div className={`absolute inset-0 flex items-center justify-center ${gradient}`} aria-hidden="true">
      {/* 은은한 광원 */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-6 h-20 w-20 rounded-full bg-white/15 blur-2xl" />

      {/* 물결 모티프 (브랜드 일관성) */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,72 C28,58 42,88 68,76 C82,70 92,62 100,68 L100,100 L0,100 Z" fill="white" fillOpacity="0.22" />
        <path d="M0,82 C32,70 48,92 74,84 C86,80 94,76 100,80 L100,100 L0,100 Z" fill="white" fillOpacity="0.14" />
      </svg>

      {compact ? (
        <span className="relative z-10 text-xs font-bold tracking-tight text-white/90">{initials}</span>
      ) : (
        <div className="relative z-10 mx-5 flex items-center justify-center rounded-2xl bg-white/85 px-4 py-2.5 shadow-sm ring-1 ring-white/60 backdrop-blur-sm">
          <span className="line-clamp-2 text-center text-sm font-bold leading-snug tracking-tight text-deepOceanNavy sm:text-base">
            {company?.trim() || 'BOOTSIGNAL'}
          </span>
        </div>
      )}
    </div>
  )
}

export default function CourseThumbnail({
  imageUrl,
  alt = '',
  className = '',
  variant = 'banner',
  company,
  seed,
}: CourseThumbnailProps) {
  const [imageError, setImageError] = useState(false)
  const trimmedUrl = imageUrl?.trim()
  const showImage = Boolean(trimmedUrl) && !imageError
  const isSquare = variant === 'square'

  return (
    <div
      className={
        isSquare
          ? `relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white ${className}`
          : `relative aspect-[3/2] w-full shrink-0 overflow-hidden bg-foamWhite ${className}`
      }
    >
      {showImage ? (
        <img
          src={trimmedUrl}
          alt={alt}
          className={`absolute inset-0 h-full w-full object-contain object-center ${isSquare ? 'p-1.5' : 'p-3 sm:p-4'}`}
          loading="lazy"
          onError={() => setImageError(true)}
        />
      ) : (
        <CourseThumbnailPlaceholder company={company} seed={seed} compact={isSquare} />
      )}
    </div>
  )
}

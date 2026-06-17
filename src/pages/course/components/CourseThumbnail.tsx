import { useState } from 'react'
import courseThumbnailFallback from '../../../assets/bootsignal_fabicon.png'

interface CourseThumbnailProps {
  imageUrl?: string | null
  alt?: string
  className?: string
  variant?: 'banner' | 'square'
}

function CourseThumbnailPlaceholder({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-foamWhite via-[#E8F1F7] to-[#D4E3EC]"
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-waterlineBlue/15 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-6 h-20 w-20 rounded-full bg-softAquaBlue/20 blur-2xl" />

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,72 C28,58 42,88 68,76 C82,70 92,62 100,68 L100,100 L0,100 Z"
          fill="white"
          fillOpacity="0.35"
        />
        <path
          d="M0,82 C32,70 48,92 74,84 C86,80 94,76 100,80 L100,100 L0,100 Z"
          fill="white"
          fillOpacity="0.2"
        />
      </svg>

      {compact ? (
        <img
          src={courseThumbnailFallback}
          alt=""
          className="relative z-10 h-6 w-6 object-contain opacity-45"
        />
      ) : (
        <div className="relative z-10 flex flex-col items-center gap-2">
          <img
            src={courseThumbnailFallback}
            alt=""
            className="h-10 w-10 object-contain opacity-45 sm:h-12 sm:w-12"
          />
          <span className="text-[10px] font-semibold tracking-[0.12em] text-waterlineBlue/50 sm:text-[11px]">
            BOOTSIGNAL
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
}: CourseThumbnailProps) {
  const [imageError, setImageError] = useState(false)
  const trimmedUrl = imageUrl?.trim()
  const showImage = Boolean(trimmedUrl) && !imageError
  const isSquare = variant === 'square'

  return (
    <div
      className={
        isSquare
          ? `relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-foamWhite ${className}`
          : `relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-foamWhite ${className}`
      }
    >
      {showImage ? (
        <img
          src={trimmedUrl}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      ) : (
        <CourseThumbnailPlaceholder compact={isSquare} />
      )}
    </div>
  )
}

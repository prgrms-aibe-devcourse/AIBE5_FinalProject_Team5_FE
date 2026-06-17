import { useState } from 'react'
import type { ArticleItem } from '../../data/types'

type ArticleCoverProps = {
  article: ArticleItem
  className?: string
  showCategory?: boolean
}

type PlaceholderStyle = {
  gradient: string
  accent: string
  glow: string
}

const categoryPlaceholderStyles: Record<string, PlaceholderStyle> = {
  '카카오 테크': {
    gradient: 'from-[#FFFDF5] via-[#FBF6E8] to-[#F0E8D0]',
    accent: '#E8C400',
    glow: 'rgba(254,229,0,0.28)',
  },
  '토스 테크': {
    gradient: 'from-[#F5F9FF] via-[#EBF2FC] to-[#DCE8F8]',
    accent: '#3182F6',
    glow: 'rgba(49,130,246,0.22)',
  },
  '우아한형제들': {
    gradient: 'from-[#FAF8FF] via-[#F3EEF8] to-[#E8E0F0]',
    accent: '#7B5EA7',
    glow: 'rgba(123,94,167,0.2)',
  },
  'D2 NAVER': {
    gradient: 'from-[#F4FBF7] via-[#EAF6F0] to-[#DCEEDF]',
    accent: '#03C75A',
    glow: 'rgba(3,199,90,0.18)',
  },
  '요즘IT': {
    gradient: 'from-[#FFF8F5] via-[#FDF0EA] to-[#F5E4DC]',
    accent: '#E8744F',
    glow: 'rgba(232,116,79,0.2)',
  },
}

const defaultPlaceholderStyle: PlaceholderStyle = {
  gradient: 'from-foamWhite via-[#E6EEF3] to-[#D4E3EC]',
  accent: '#005EB8',
  glow: 'rgba(0,94,184,0.18)',
}

function getPlaceholderStyle(category: string): PlaceholderStyle {
  return categoryPlaceholderStyles[category] ?? defaultPlaceholderStyle
}

export function ArticleCategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-waterlineBlue backdrop-blur-sm">
      {category}
    </span>
  )
}

function ArticleCoverPlaceholder({ article, className, showCategory = false }: ArticleCoverProps) {
  const { gradient, accent, glow } = getPlaceholderStyle(article.category)

  return (
    <div className={`relative overflow-hidden ${className ?? ''}`} aria-hidden="true">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-opacity duration-500 group-hover:opacity-95`} />

      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[3px]"
        style={{ backgroundColor: accent }}
      />

      <div
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 68%)` }}
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-6 h-24 w-24 rounded-full blur-3xl opacity-70"
        style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 70%)` }}
      />

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

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deepOceanNavy/[0.06] via-transparent to-white/20" />

      {showCategory ? (
        <div className="absolute bottom-3 left-3 z-10">
          <ArticleCategoryBadge category={article.category} />
        </div>
      ) : null}
    </div>
  )
}

export default function ArticleCover({ article, className, showCategory = false }: ArticleCoverProps) {
  const [imageError, setImageError] = useState(false)
  const thumbnailUrl = article.thumbnailUrl?.trim()
  const showThumbnail = Boolean(thumbnailUrl) && !imageError

  if (!showThumbnail) {
    return <ArticleCoverPlaceholder article={article} className={className} showCategory={showCategory} />
  }

  return (
    <div className={`relative overflow-hidden bg-mistSkyBlue/20 ${className ?? ''}`}>
      <img
        src={thumbnailUrl}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={() => setImageError(true)}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deepOceanNavy/20 via-transparent to-transparent"
        aria-hidden="true"
      />
      {showCategory ? (
        <div className="absolute bottom-3 left-3">
          <ArticleCategoryBadge category={article.category} />
        </div>
      ) : null}
    </div>
  )
}

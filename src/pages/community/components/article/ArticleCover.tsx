import { useState } from 'react'
import type { ArticleItem } from '../../data/types'

const coverGradients = [
  'from-[#E8F2FA] via-[#D6E8F5] to-[#B8D4EB]',
  'from-[#EEF4F8] via-[#DCE9F2] to-[#C2DAEA]',
  'from-[#F0F6FA] via-[#E2EDF5] to-[#C8DDF0]',
  'from-[#E6F0F8] via-[#D2E4F0] to-[#A8CCE6]',
  'from-[#EDF3F8] via-[#D9E8F2] to-[#BED6EB]',
] as const

type ArticleCoverProps = {
  article: ArticleItem
  className?: string
  showCategory?: boolean
}

export function ArticleCategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-waterlineBlue backdrop-blur-sm">
      {category}
    </span>
  )
}

function ArticleCoverPlaceholder({ article, className }: ArticleCoverProps) {
  const gradient = coverGradients[article.coverVariant % coverGradients.length]

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${className ?? ''}`}
      aria-hidden="true"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(0,94,184,0.12) 0%, transparent 55%), radial-gradient(circle at 80% 80%, rgba(52,74,100,0.08) 0%, transparent 50%)',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold text-waterlineBlue/20">{(article.id % 100) + 1}</span>
      </div>
    </div>
  )
}

export default function ArticleCover({ article, className, showCategory = false }: ArticleCoverProps) {
  const [imageError, setImageError] = useState(false)
  const thumbnailUrl = article.thumbnailUrl?.trim()
  const showThumbnail = Boolean(thumbnailUrl) && !imageError

  if (!showThumbnail) {
    return <ArticleCoverPlaceholder article={article} className={className} />
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

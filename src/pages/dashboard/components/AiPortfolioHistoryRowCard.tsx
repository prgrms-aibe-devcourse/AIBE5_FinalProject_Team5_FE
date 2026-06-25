import { Eye, Trash2 } from 'lucide-react'
import {
  PORTFOLIO_DRAFT_TONE_LABELS,
  type PortfolioDraftHistorySummary,
} from '../../../services/aiPortfolio'

type AiPortfolioHistoryRowCardProps = {
  item: PortfolioDraftHistorySummary
  onOpen: () => void
  onDelete: () => void
}

function formatCreatedAt(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`
}

function PortfolioIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-waterlineBlue" aria-hidden="true">
      <path
        d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M14 3v6h6M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-softAquaBlue" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function AiPortfolioHistoryRowCard({ item, onOpen, onDelete }: AiPortfolioHistoryRowCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-mistSkyBlue/45 bg-white/55 [backdrop-filter:blur(10px)] font-pretendard shadow-[0_4px_16px_rgba(28,46,92,0.10),inset_0_1px_0_rgba(255,255,255,0.80)] transition-all hover:border-waterlineBlue/45 hover:bg-white/70 hover:shadow-[0_6px_20px_rgba(28,46,92,0.14)]">
      <div className="flex items-stretch gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onOpen}
          className="group flex min-w-0 flex-1 items-stretch gap-3 px-4 py-4 text-left transition-colors sm:px-5"
        >
          <span className="flex w-10 shrink-0 items-center justify-center rounded-lg bg-foamWhite ring-1 ring-mistSkyBlue/45 sm:w-11">
            <PortfolioIcon />
          </span>

          <span className="flex min-w-0 flex-1 flex-col justify-center py-0.5">
            <span className="block line-clamp-2 text-sm font-semibold leading-snug text-deepOceanNavy transition-colors group-hover:text-waterlineBlue sm:text-[0.9375rem]">
              {item.targetJob}
            </span>
            <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-pretendard text-xs text-primary/90">
              <span className="inline-flex items-center gap-1.5">
                <CalendarIcon />
                <time dateTime={item.createdAt}>{formatCreatedAt(item.createdAt)}</time>
              </span>
              <span className="inline-flex items-center rounded-full bg-[#f2faf4] px-2.5 py-0.5 text-[10px] font-semibold text-[#1f8a3b]">
                {PORTFOLIO_DRAFT_TONE_LABELS[item.tone]}
              </span>
            </span>
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-1 self-center pr-3 sm:pr-4">
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-mistSkyBlue/60 bg-white px-3 font-pretendard text-xs font-semibold text-secondary transition-colors hover:border-waterlineBlue hover:bg-foamWhite hover:text-deepOceanNavy"
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            상세
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label={`${item.targetJob} 이력 삭제`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  )
}

import type { UserInquiry } from '../data/inquiries'
import InquiryStatusBadge from './InquiryStatusBadge'

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-softAquaBlue" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function InquiryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-waterlineBlue" aria-hidden="true">
      <path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type InquiryRowCardProps = {
  inquiry: UserInquiry
  isOpen: boolean
  onToggle: () => void
}

export default function InquiryRowCard({ inquiry, isOpen, onToggle }: InquiryRowCardProps) {
  return (
    <article
      className={`overflow-hidden rounded-xl border bg-white/55 [backdrop-filter:blur(10px)] font-pretendard shadow-[0_4px_16px_rgba(28,46,92,0.10),inset_0_1px_0_rgba(255,255,255,0.80)] transition-all hover:bg-white/70 hover:shadow-[0_6px_20px_rgba(28,46,92,0.14)] ${
        isOpen
          ? 'border-waterlineBlue/35 shadow-[0_2px_10px_rgba(84,132,183,0.1)]'
          : 'border-mistSkyBlue/45 hover:border-waterlineBlue/45 hover:shadow-[0_2px_10px_rgba(84,132,183,0.1)]'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`group flex w-full items-stretch gap-3 px-4 py-4 text-left transition-colors sm:px-5 ${
          isOpen ? 'border-b border-mistSkyBlue/25' : ''
        }`}
        aria-expanded={isOpen}
      >
        <span className="flex w-10 shrink-0 items-center justify-center rounded-lg bg-foamWhite ring-1 ring-mistSkyBlue/45 sm:w-11">
          <InquiryIcon />
        </span>

        <span className="flex min-w-0 flex-1 flex-col justify-center py-0.5">
          <span className="block line-clamp-2 text-sm font-semibold leading-snug text-deepOceanNavy transition-colors group-hover:text-waterlineBlue sm:text-[0.9375rem]">
            {inquiry.title}
          </span>
          <span className="mt-2 inline-flex items-center gap-1.5 font-pretendard text-xs text-primary/90">
            <CalendarIcon />
            <time dateTime={inquiry.requestedAt}>문의일 | {inquiry.requestedAt}</time>
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-3 self-center">
          <InquiryStatusBadge status={inquiry.status} />
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className={`shrink-0 text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {isOpen ? (
        <div className="space-y-3 px-4 pb-4 pt-1 sm:px-5 sm:pb-5">
          <div className="rounded-lg border border-mistSkyBlue/35 bg-foamWhite/80 px-3.5 py-3.5">
            <p className="inline-flex items-center gap-1.5 font-pretendard text-xs font-semibold text-waterlineBlue">
              <span className="h-1.5 w-1.5 rounded-full bg-waterlineBlue" aria-hidden="true" />
              문의 내용
            </p>
            <p className="mt-2 whitespace-pre-wrap font-pretendard text-sm leading-relaxed text-primary/90">
              {inquiry.content}
            </p>
          </div>

          {inquiry.adminReply ? (
            <div className="rounded-lg border border-[#bbf7d0] bg-[#ecfdf5] px-3.5 py-3.5">
              <p className="inline-flex items-center gap-1.5 font-pretendard text-xs font-semibold text-[#15803d]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" aria-hidden="true" />
                관리자 답변
              </p>
              <p className="mt-2 whitespace-pre-wrap font-pretendard text-sm leading-relaxed text-deepOceanNavy">
                {inquiry.adminReply}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-[#fde68a] bg-[#fffbeb] px-3.5 py-3 text-center">
              <p className="inline-flex items-center gap-1.5 font-pretendard text-xs font-medium text-[#b45309]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f59e0b]" aria-hidden="true" />
                답변 대기 중입니다.
              </p>
            </div>
          )}
        </div>
      ) : null}
    </article>
  )
}

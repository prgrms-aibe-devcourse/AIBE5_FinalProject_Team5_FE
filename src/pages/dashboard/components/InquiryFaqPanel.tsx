import { useState } from 'react'
import type { FaqItem } from '../data/inquiries'

function HelpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-waterlineBlue" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.5 9.25a2.75 2.75 0 015.1 1.35c0 1.65-2.1 2.15-2.6 3.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" />
    </svg>
  )
}

type InquiryFaqPanelProps = {
  items: FaqItem[]
}

export default function InquiryFaqPanel({ items }: InquiryFaqPanelProps) {
  const [openId, setOpenId] = useState<number | null>(items[0]?.id ?? null)

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => {
        const isOpen = openId === item.id

        return (
          <li key={item.id}>
            <div
              className={`overflow-hidden rounded-xl border bg-white shadow-[0_1px_4px_rgba(52,74,100,0.05)] transition-[border-color,box-shadow] ${
                isOpen
                  ? 'border-waterlineBlue/35 shadow-[0_2px_10px_rgba(84,132,183,0.1)]'
                  : 'border-mistSkyBlue/45 hover:border-waterlineBlue/45 hover:shadow-[0_2px_10px_rgba(84,132,183,0.1)]'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className={`group flex w-full items-center gap-3 px-4 py-4 text-left transition-colors sm:px-5 ${
                  isOpen ? 'border-b border-mistSkyBlue/25' : ''
                }`}
                aria-expanded={isOpen}
              >
                <span className="flex shrink-0 items-center justify-center self-center rounded-lg bg-foamWhite p-2 ring-1 ring-mistSkyBlue/45">
                  <HelpIcon />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-pretendard text-sm font-semibold leading-snug text-deepOceanNavy transition-colors group-hover:text-waterlineBlue">
                    {item.question}
                  </span>
                </span>
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
              </button>

              {isOpen ? (
                <div className="px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
                  <div className="rounded-xl border border-mistSkyBlue/35 bg-foamWhite/80 p-4">
                    <p className="font-pretendard text-sm leading-relaxed text-primary/90">{item.answer}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

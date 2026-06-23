import type { ReactNode } from 'react'

export function HomeCarouselNavButton({
  direction,
  onClick,
  label,
}: {
  direction: 'prev' | 'next'
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-14 w-14 items-center justify-center text-[#9aafc2] transition-colors hover:text-deepOceanNavy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-waterlineBlue/40"
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {direction === 'prev' ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
      </svg>
    </button>
  )
}

export function HomeCarouselNavShell({
  viewportWidth,
  showNav,
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
  children,
  contentHeight,
}: {
  viewportWidth: number
  showNav: boolean
  onPrev: () => void
  onNext: () => void
  prevLabel: string
  nextLabel: string
  children: ReactNode
  contentHeight: number
}) {
  return (
    <div className="mt-10 overflow-visible">
      <div className="relative mx-auto min-h-0 max-w-full overflow-visible px-4 pb-6 pt-8 sm:px-6 md:pt-10">
        <div className="relative mx-auto" style={{ width: viewportWidth, maxWidth: '100%' }}>
          {showNav && (
            <>
              <div className="pointer-events-none absolute -left-1 top-1/2 z-40 -translate-y-1/2 sm:-left-6 md:-left-8">
                <div className="pointer-events-auto">
                  <HomeCarouselNavButton direction="prev" label={prevLabel} onClick={onPrev} />
                </div>
              </div>
              <div className="pointer-events-none absolute -right-1 top-1/2 z-40 -translate-y-1/2 sm:-right-6 md:-right-8">
                <div className="pointer-events-auto">
                  <HomeCarouselNavButton direction="next" label={nextLabel} onClick={onNext} />
                </div>
              </div>
            </>
          )}

          <div
            className="relative overflow-x-hidden overflow-y-visible py-4"
            style={{ height: `${contentHeight}px` }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

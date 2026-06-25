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
      className="flex h-10 w-10 items-center justify-center text-[#9aafc2] transition-colors hover:text-deepOceanNavy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-waterlineBlue/40 sm:h-12 sm:w-12 md:h-14 md:w-14"
    >
      <svg
        className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7"
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
    <div className="mt-6 overflow-visible sm:mt-8 md:mt-10">
      <div className="relative mx-auto min-h-0 max-w-full overflow-visible px-4 pb-4 pt-4 sm:px-4 sm:pb-6 sm:pt-8 md:px-6 md:pt-10">
        <div
          className={`mx-auto flex w-full max-w-full items-center ${
            showNav ? 'justify-between gap-4 md:justify-center md:gap-0' : 'justify-center'
          }`}
        >
          {showNav ? (
            <div className="shrink-0 md:hidden">
              <HomeCarouselNavButton direction="prev" label={prevLabel} onClick={onPrev} />
            </div>
          ) : null}

          <div
            className="relative mx-auto w-full min-w-0 shrink-0 md:flex-none"
            style={{ width: viewportWidth, maxWidth: viewportWidth }}
          >
            {showNav ? (
              <>
                <div className="pointer-events-none absolute -left-8 top-1/2 z-40 hidden -translate-y-1/2 md:block lg:-left-10">
                  <div className="pointer-events-auto">
                    <HomeCarouselNavButton direction="prev" label={prevLabel} onClick={onPrev} />
                  </div>
                </div>
                <div className="pointer-events-none absolute -right-8 top-1/2 z-40 hidden -translate-y-1/2 md:block lg:-right-10">
                  <div className="pointer-events-auto">
                    <HomeCarouselNavButton direction="next" label={nextLabel} onClick={onNext} />
                  </div>
                </div>
              </>
            ) : null}

            <div
              className="relative overflow-x-hidden overflow-y-visible py-2 sm:py-4"
              style={{ height: `${contentHeight}px` }}
            >
              {children}
            </div>
          </div>

          {showNav ? (
            <div className="shrink-0 md:hidden">
              <HomeCarouselNavButton direction="next" label={nextLabel} onClick={onNext} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import type { CourseSortMode } from '../data/courses'

type DashboardSortSelectProps = {
  value: CourseSortMode
  options: readonly CourseSortMode[]
  onChange: (value: CourseSortMode) => void
  ariaLabel?: string
  className?: string
}

export default function DashboardSortSelect({
  value,
  options,
  onChange,
  ariaLabel = '정렬',
  className = '',
}: DashboardSortSelectProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (option: CourseSortMode) => {
    onChange(option)
    setOpen(false)
  }

  return (
    <div className={`relative w-[132px] ${className}`.trim()}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((prev) => !prev)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex w-full cursor-pointer items-center rounded-xl border border-mistSkyBlue/80 bg-white py-2.5 pl-4 pr-9 text-left text-sm font-medium text-deepOceanNavy shadow-sm transition-colors hover:border-waterlineBlue/60 focus:border-waterlineBlue focus:outline-none font-pretendard"
      >
        <span className="truncate">{value}</span>
      </button>

      <svg
        className={`pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-deepOceanNavy/70 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 5l4 4 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {open ? (
        <ul
          role="listbox"
          aria-label={`${ariaLabel} 옵션`}
          className="absolute left-0 right-0 top-[calc(100%+0.375rem)] z-50 overflow-hidden rounded-2xl border border-mistSkyBlue/80 bg-white py-1.5 shadow-[0_8px_28px_rgba(52,74,100,0.12)]"
        >
          {options.map((option) => {
            const isSelected = option === value

            return (
              <li key={option} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSelect(option)}
                  className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors font-pretendard ${
                    isSelected ? 'bg-foamWhite text-deepOceanNavy' : 'text-deepOceanNavy hover:bg-foamWhite/80'
                  }`}
                >
                  {option}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}

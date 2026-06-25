import { useState } from 'react'
import type { CourseFilterConfig } from '../../../services/course.ts'

interface CourseFilterSelectProps {
  filter: CourseFilterConfig
  value: string
  onChange: (value: string) => void
}

/** 단일 필터 드롭다운 (커스텀 — 목록 둥근 스타일) */
export default function CourseFilterSelect({ filter, value, onChange }: CourseFilterSelectProps) {
  const [open, setOpen] = useState(false)

  const selectedLabel =
    filter.options.find((option) => option.value === value)?.label ?? filter.label

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setOpen(false)
  }

  return (
    <div className="relative min-w-0 flex-1">
      <button
        type="button"
        aria-label={filter.label}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((prev) => !prev)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex w-full cursor-pointer items-center rounded-lg border border-mistSkyBlue/80 bg-white py-1.5 pl-2 pr-6 text-left text-[11px] font-medium text-deepOceanNavy shadow-sm transition-colors hover:border-waterlineBlue/60 focus:border-waterlineBlue focus:outline-none font-pretendard sm:rounded-xl sm:py-2.5 sm:pl-4 sm:pr-9 sm:text-sm"
      >
        <span className="truncate">{selectedLabel}</span>
      </button>

      <svg
        className={`pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-deepOceanNavy/70 transition-transform duration-200 sm:right-3.5 sm:h-3.5 sm:w-3.5 ${open ? 'rotate-180' : ''}`}
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

      {open && (
        <ul
          role="listbox"
          aria-label={`${filter.label} 옵션`}
          className={`absolute left-0 right-0 top-[calc(100%+0.375rem)] z-50 overflow-x-hidden rounded-2xl border border-mistSkyBlue/80 bg-white py-1.5 shadow-[0_8px_28px_rgba(52,74,100,0.12)] ${
            filter.expandList ? '' : `${filter.maxListHeightClass ?? 'max-h-60'} overflow-y-auto overscroll-contain`
          }`}
        >
          {filter.options.map((option) => {
            const isSelected = option.value === value
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors font-pretendard ${
                    isSelected
                      ? 'bg-foamWhite text-deepOceanNavy'
                      : 'text-deepOceanNavy hover:bg-foamWhite/80'
                  }`}
                >
                  {option.label}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

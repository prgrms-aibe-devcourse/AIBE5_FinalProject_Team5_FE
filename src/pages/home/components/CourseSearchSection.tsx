import { useState, type ReactNode } from 'react'

type Category = {
  key: string
  label: string
  icon: ReactNode
}

const iconProps = {
  width: 30,
  height: 30,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const categories: Category[] = [
  {
    key: 'sw',
    label: '응용 SW',
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 5l-2 14" />
      </svg>
    ),
  },
  {
    key: 'uiux',
    label: 'UI / UX',
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18M8 4v5" />
      </svg>
    ),
  },
  {
    key: 'data',
    label: '데이터',
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <ellipse cx="12" cy="6" rx="7" ry="3" />
        <path d="M5 6v6c0 1.66 3.13 3 7 3s7-1.34 7-3V6M5 12v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6" />
      </svg>
    ),
  },
  {
    key: 'ai',
    label: '인공지능',
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <rect x="5" y="7" width="14" height="12" rx="3" />
        <path d="M12 7V4M9 12h.01M15 12h.01M9 19v2M15 19v2M5 11H3M21 11h-2" />
      </svg>
    ),
  },
  {
    key: 'cloud',
    label: '클라우드',
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M7 18a4 4 0 0 1-.5-7.97A6 6 0 0 1 18 9.5a3.5 3.5 0 0 1-.5 8.5z" />
      </svg>
    ),
  },
  {
    key: 'security',
    label: '보안',
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    key: 'vr',
    label: 'VR',
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <rect x="2" y="8" width="20" height="9" rx="3" />
        <path d="M9 17c0-1.5 1.5-2 3-2s3 .5 3 2" />
      </svg>
    ),
  },
]

/** 메인 — 과정 검색 + 카테고리 바로가기 */
export default function CourseSearchSection() {
  const [keyword, setKeyword] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const params = keyword.trim() ? `?q=${encodeURIComponent(keyword.trim())}` : ''
    window.location.href = `/courses${params}`
  }

  return (
    <section className="w-full px-6 py-16 md:px-12 md:py-20" aria-label="과정 탐색">
      <div className="mx-auto w-full max-w-desktop-content">
        <h2 className="text-center text-2xl font-bold text-deepOceanNavy font-pretendard md:text-[28px]">
          나에게 맞는 과정을 탐색해보세요!
        </h2>

        <form onSubmit={handleSubmit} className="mx-auto mt-8 flex w-full max-w-2xl items-center">
          <div className="relative w-full">
            <input
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="키워드, 과정명 입력"
              aria-label="과정 검색"
              className="h-14 w-full rounded-full border border-[#dbe4ec] bg-white pl-6 pr-14 text-base text-deepOceanNavy placeholder:text-[#9aa7b6] shadow-[0_2px_10px_rgba(52,74,100,0.05)] outline-none transition-colors focus:border-waterlineBlue font-pretendard"
            />
            <button
              type="submit"
              aria-label="검색"
              className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-[#7b8795] transition-colors hover:bg-foamWhite hover:text-deepOceanNavy"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </button>
          </div>
        </form>

        <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-4 gap-x-6 gap-y-8 sm:grid-cols-7">
          {categories.map((category) => (
            <li key={category.key}>
              <a href={`/courses?category=${category.key}`} className="group flex flex-col items-center gap-3">
                <span className="grid h-20 w-20 place-items-center rounded-2xl border border-[#e3eaf1] bg-white text-waterlineBlue shadow-[0_2px_10px_rgba(52,74,100,0.05)] transition-all group-hover:-translate-y-0.5 group-hover:border-waterlineBlue group-hover:text-deepOceanNavy">
                  {category.icon}
                </span>
                <span className="text-sm font-semibold text-[#4a5565] font-pretendard">{category.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

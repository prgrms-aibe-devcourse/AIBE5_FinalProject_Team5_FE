import { useState } from 'react'
import appSwIcon from '../../../assets/image/76820c27-ba79-4525-9251-2ba8c145e124 1.png'
import vrIcon from '../../../assets/image/76820c27-ba79-4525-9251-2ba8c145e124 2.png'
import aiIcon from '../../../assets/image/76820c27-ba79-4525-9251-2ba8c145e124 3.png'
import dataIcon from '../../../assets/image/76820c27-ba79-4525-9251-2ba8c145e124 5.png'
import uiUxIcon from '../../../assets/image/76820c27-ba79-4525-9251-2ba8c145e124 6.png'
import cloudIcon from '../../../assets/image/76820c27-ba79-4525-9251-2ba8c145e124 7.png'
import securityIcon from '../../../assets/image/86f78ff9-0f50-414a-ae4d-4e3b93686f0f 1.png'

type Category = {
  key: string
  label: string
  icon: string
}

const categories: Category[] = [
  { key: 'sw', label: '응용 SW', icon: appSwIcon },
  { key: 'uiux', label: 'UI / UX', icon: uiUxIcon },
  { key: 'data', label: '데이터', icon: dataIcon },
  { key: 'ai', label: '인공지능', icon: aiIcon },
  { key: 'cloud', label: '클라우드', icon: cloudIcon },
  { key: 'security', label: '보안', icon: securityIcon },
  { key: 'vr', label: 'VR', icon: vrIcon },
]

export default function CourseSearchSection() {
  const [keyword, setKeyword] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const params = keyword.trim() ? `?q=${encodeURIComponent(keyword.trim())}` : ''
    window.location.href = `/courses${params}`
  }

  return (
    <section id="courses" className="w-full px-4 py-8 md:px-8 md:py-12" aria-label="과정 탐색" data-home-section>
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-14 md:px-10 md:pb-20 md:pt-16">
        <div className="mx-auto max-w-165 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-deepOceanNavy font-pretendard md:text-[34px]">
            나에게 맞는 과정을 탐색해보세요!
          </h2>

          <form onSubmit={handleSubmit} className="mt-10">
            <div className="relative">
              <input
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="키워드, 과정명 등 입력"
                aria-label="과정 검색"
                className="h-17.5 w-full rounded-full border border-[#b9bec6] bg-white pl-6 pr-16 text-[15px] text-deepOceanNavy placeholder:text-[#8b94a3] shadow-[0_1px_3px_rgba(15,23,42,0.04)] outline-none transition-colors focus:border-waterlineBlue font-pretendard"
              />
              <button
                type="submit"
                aria-label="검색"
                className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-[#51637a] transition-colors hover:bg-foamWhite hover:text-deepOceanNavy"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        <ul className="mx-auto mt-10 grid max-w-310 grid-cols-2 gap-x-3 gap-y-5 sm:mt-14 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 md:grid-cols-4 lg:grid-cols-7">
          {categories.map((category) => (
            <li key={category.key} className="flex justify-center">
              <a href={`/courses?category=${category.key}`} className="group flex flex-col items-center">
                <span className="block h-28 w-28 rounded-[14px] p-2 glass-panel shadow-[0_1px_2px_rgba(15,23,42,0.02)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_6px_18px_rgba(52,74,100,0.08)] sm:h-32 sm:w-32 sm:rounded-2xl sm:p-2.5 lg:h-37.5 lg:w-37.5 lg:rounded-[18px] lg:p-3">
                  <img src={category.icon} alt="" aria-hidden="true" className="h-full w-full object-contain" />
                </span>
                <span className="mt-2.5 text-sm font-semibold tracking-[-0.01em] text-[#344A64] font-pretendard sm:mt-3 sm:text-[15px]">
                  {category.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

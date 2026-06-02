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
    <section id="courses" className="w-full bg-white px-4 py-8 md:px-8 md:py-12" aria-label="과정 탐색" data-home-section>
      <div className="mx-auto max-w-[1280px] bg-white px-6 pb-16 pt-14 md:px-10 md:pb-20 md:pt-16">
        <div className="mx-auto max-w-[660px] text-center">
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
                className="h-[70px] w-full rounded-full border border-[#b9bec6] bg-white pl-6 pr-16 text-[15px] text-deepOceanNavy placeholder:text-[#8b94a3] shadow-[0_1px_3px_rgba(15,23,42,0.04)] outline-none transition-colors focus:border-waterlineBlue font-pretendard"
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

        <ul className="mx-auto mt-14 grid max-w-[1240px] grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {categories.map((category) => (
            <li key={category.key} className="flex justify-center">
              <a href={`/courses?category=${category.key}`} className="group flex flex-col items-center">
                <span className="grid h-[150px] w-[150px] place-items-center rounded-[18px] border border-[#d9dee6] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.02)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_6px_18px_rgba(52,74,100,0.08)]">
                  <img src={category.icon} alt="" aria-hidden="true" className="h-[90px] w-[90px] object-contain" />
                </span>
                <span className="mt-3 text-[15px] font-semibold tracking-[-0.01em] text-[#344A64] font-pretendard">
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

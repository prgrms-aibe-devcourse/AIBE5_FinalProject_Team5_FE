import { useEffect, useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import CourseSearchSection from './home/components/CourseSearchSection'
import PopularCoursesSection from './home/components/PopularCoursesSection'
import ReviewsSection from './home/components/ReviewsSection'
import { useSmoothSectionScroll } from './home/useSmoothSectionScroll'
import heroVideoMp4 from '../assets/smoother_watercolour_main.mp4'

export default function HomePage() {
  const [heroVideoAvailable, setHeroVideoAvailable] = useState(true)

  // 홈페이지에서만 섹션 스크롤 스냅을 활성화 (다른 페이지에는 영향 없음)
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('home-snap')
    return () => root.classList.remove('home-snap')
  }, [])

  // 휠 스크롤 시 인접 섹션으로 부드럽게(easing) 이동
  useSmoothSectionScroll()

  return (
    <div className="home-page min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 w-full overflow-x-clip pt-20">
        <section id="hero" className="hero-video" aria-label="BootSignal main visual" data-home-section>
          {heroVideoAvailable && (
            <video
              className="hero-video__media"
              autoPlay
              muted
              loop
              playsInline
              onError={() => setHeroVideoAvailable(false)}
            >
              <source src={heroVideoMp4} type="video/mp4" />
            </video>
          )}

          {!heroVideoAvailable && (
            <div className="hero-video__fallback" aria-hidden="true">
              <div className="hero-video__horizon" />
              <div className="hero-video__water" />
              <div className="hero-video__figure" />
              <div className="hero-video__device" />
            </div>
          )}

          <a href="#courses" className="hero-scroll-indicator" aria-label="과정 탐색으로 스크롤">
            <span className="hero-scroll-indicator__text">SCROLL</span>
            <span className="hero-scroll-indicator__line" aria-hidden="true" />
          </a>
        </section>

        <CourseSearchSection />
        <PopularCoursesSection />
        <ReviewsSection />
      </main>
      <Footer />
    </div>
  )
}

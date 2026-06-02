import { useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import CourseSearchSection from './home/components/CourseSearchSection'
import PopularCoursesSection from './home/components/PopularCoursesSection'
import ReviewsSection from './home/components/ReviewsSection'
import heroVideoMp4 from '../assets/smoother_watercolour_main.mp4'

export default function HomePage() {
  const [heroVideoAvailable, setHeroVideoAvailable] = useState(true)

  return (
    <div className="home-page min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 w-full overflow-x-hidden pt-20">
        <section className="hero-video" aria-label="BootSignal main visual">
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
        </section>

        <CourseSearchSection />
        <PopularCoursesSection />
        <ReviewsSection />
      </main>
      <Footer />
    </div>
  )
}

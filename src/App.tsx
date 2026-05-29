import { useState } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import heroVideoWebm from './assets/watercolour_main_hero.webm'
import heroVideoMp4 from './assets/watercolour_main_hero.mp4'

function App() {
  const [heroVideoReady, setHeroVideoReady] = useState(true)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 w-full overflow-x-hidden">
        <section className="hero-video" aria-label="BootSignal main visual">
          {heroVideoReady && (
            <video
              className="hero-video__media"
              autoPlay
              muted
              loop
              playsInline
              onCanPlay={() => setHeroVideoReady(true)}
              onError={() => setHeroVideoReady(false)}
            >
              <source src={heroVideoWebm} type="video/webm" />
              <source src={heroVideoMp4} type="video/mp4" />
            </video>
          )}
          <div className="hero-video__fallback" aria-hidden="true">
            <div className="hero-video__horizon" />
            <div className="hero-video__water" />
            <div className="hero-video__figure" />
            <div className="hero-video__device" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App

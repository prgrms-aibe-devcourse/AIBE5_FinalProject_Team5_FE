import { useState } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import heroVideo from './assets/watercolour_main_1080p30_stream.mp4'

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
              src={heroVideo}
              autoPlay
              muted
              loop
              playsInline
              onCanPlay={() => setHeroVideoReady(true)}
              onError={() => setHeroVideoReady(false)}
            />
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

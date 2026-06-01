import { useState } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import heroVideoWebm from './assets/watercolour_main.webm'

function App() {
  const [heroVideoAvailable, setHeroVideoAvailable] = useState(true)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 w-full overflow-x-hidden pt-24">
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
              <source src={heroVideoWebm} type="video/webm" />
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
      </main>
      <Footer />
    </div>
  )
}

export default App

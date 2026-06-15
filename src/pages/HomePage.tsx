import { useCallback, useEffect, useRef, useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import CourseSearchSection from './home/components/CourseSearchSection'
import PopularCoursesSection from './home/components/PopularCoursesSection'
import ReviewsSection from './home/components/ReviewsSection'
import { useSmoothSectionScroll } from './home/useSmoothSectionScroll'
import beforeHeroVideoMp4 from '../assets/b4main1.mp4'
import heroVideoMp4 from '../assets/main main final.mp4'
import HeroWaveIntro from './home/components/HeroWaveIntro'

type HeroVideoPhase = 'before' | 'loop'

const HOME_ENTRY_PLAYED_KEY = 'bootsignal-home-entry-played'
const BEFORE_HERO_EXIT_TIME = 96 / 24
// 메인 루프 영상은 첫 프레임(0초)부터 재생 — b4 영상의 끝 프레임과 이어지도록 정렬
const LOOP_ENTRY_TIME = 0

export default function HomePage() {
  const [shouldPlayEntrySequence] = useState(() => {
    try {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
      const isPageReload = navigationEntry?.type === 'reload'

      return isPageReload || sessionStorage.getItem(HOME_ENTRY_PLAYED_KEY) !== 'true'
    } catch {
      return true
    }
  })
  const beforeHeroVideoRef = useRef<HTMLVideoElement>(null)
  const loopHeroVideoRef = useRef<HTMLVideoElement>(null)
  const [beforeHeroVideoAvailable, setBeforeHeroVideoAvailable] = useState(shouldPlayEntrySequence)
  const [loopHeroVideoAvailable, setLoopHeroVideoAvailable] = useState(true)
  const [heroVideoPhase, setHeroVideoPhase] = useState<HeroVideoPhase>(
    shouldPlayEntrySequence ? 'before' : 'loop',
  )
  const [beforeHeroVideoEnded, setBeforeHeroVideoEnded] = useState(!shouldPlayEntrySequence)
  const [showHeroIntro, setShowHeroIntro] = useState(shouldPlayEntrySequence)
  const beforeFrameCallbackRef = useRef<number | null>(null)
  const beforeTransitionStartedRef = useRef(false)
  const loopFrameReadyRef = useRef(false)
  const loopEntrySeekedRef = useRef(!shouldPlayEntrySequence)
  const loopStartPendingRef = useRef(false)

  const handleIntroComplete = useCallback(() => {
    setShowHeroIntro(false)
  }, [])

  const startLoopHeroVideo = useCallback(() => {
    const video = loopHeroVideoRef.current
    if (!video || !loopHeroVideoAvailable) return

    if (shouldPlayEntrySequence && !loopEntrySeekedRef.current) {
      loopStartPendingRef.current = true
      return
    }

    loopStartPendingRef.current = false
    video.play().catch(() => {
      // Keep the previous video's last frame visible until playback can start.
    })
  }, [loopHeroVideoAvailable, shouldPlayEntrySequence])

  const handleLoopHeroVideoLoadedMetadata = useCallback(() => {
    const video = loopHeroVideoRef.current
    if (!video || !shouldPlayEntrySequence) return

    const entryTime = Math.min(LOOP_ENTRY_TIME, Math.max(0, video.duration - 0.001))

    // 첫 프레임(0초)부터 시작하면 seek가 필요 없고 onSeeked도 발생하지 않으므로
    // 재생 게이트를 즉시 해제한다.
    if (entryTime <= 0) {
      loopEntrySeekedRef.current = true
      if (loopStartPendingRef.current || beforeHeroVideoEnded) {
        startLoopHeroVideo()
      }
      return
    }

    loopEntrySeekedRef.current = false
    video.currentTime = entryTime
  }, [shouldPlayEntrySequence, beforeHeroVideoEnded, startLoopHeroVideo])

  const handleLoopHeroVideoSeeked = useCallback(() => {
    if (!shouldPlayEntrySequence) return

    loopEntrySeekedRef.current = true
    if (loopStartPendingRef.current || beforeHeroVideoEnded) {
      startLoopHeroVideo()
    }
  }, [beforeHeroVideoEnded, shouldPlayEntrySequence, startLoopHeroVideo])

  const finishBeforeHeroVideo = useCallback(() => {
    if (beforeTransitionStartedRef.current) return
    beforeTransitionStartedRef.current = true

    setBeforeHeroVideoEnded(true)
    startLoopHeroVideo()
  }, [startLoopHeroVideo])

  const handleBeforeHeroVideoPlaying = useCallback(() => {
    const video = beforeHeroVideoRef.current
    if (!video || !('requestVideoFrameCallback' in video) || beforeFrameCallbackRef.current !== null) return

    const watchFrame = (_now: DOMHighResTimeStamp, metadata: VideoFrameCallbackMetadata) => {
      if (metadata.mediaTime >= BEFORE_HERO_EXIT_TIME) {
        beforeFrameCallbackRef.current = null
        video.pause()
        finishBeforeHeroVideo()
        return
      }

      beforeFrameCallbackRef.current = video.requestVideoFrameCallback(watchFrame)
    }

    beforeFrameCallbackRef.current = video.requestVideoFrameCallback(watchFrame)
  }, [finishBeforeHeroVideo])

  const handleBeforeHeroVideoError = useCallback(() => {
    setBeforeHeroVideoAvailable(false)
    finishBeforeHeroVideo()
  }, [finishBeforeHeroVideo])

  const handleLoopHeroVideoPlaying = useCallback(() => {
    if (loopFrameReadyRef.current) return
    loopFrameReadyRef.current = true

    const video = loopHeroVideoRef.current
    if (!video) return

    if ('requestVideoFrameCallback' in video) {
      video.requestVideoFrameCallback(() => {
        window.requestAnimationFrame(() => setHeroVideoPhase('loop'))
      })
      return
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setHeroVideoPhase('loop'))
    })
  }, [])

  // 홈페이지에서만 섹션 스크롤 스냅을 활성화 (다른 페이지에는 영향 없음)
  useEffect(() => {
    const root = document.documentElement
    const beforeVideo = beforeHeroVideoRef.current
    root.classList.add('home-snap')
    return () => {
      root.classList.remove('home-snap')

      if (
        beforeVideo &&
        beforeFrameCallbackRef.current !== null &&
        'cancelVideoFrameCallback' in beforeVideo
      ) {
        beforeVideo.cancelVideoFrameCallback(beforeFrameCallbackRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!shouldPlayEntrySequence) return

    try {
      sessionStorage.setItem(HOME_ENTRY_PLAYED_KEY, 'true')
    } catch {
      // The sequence can still play when storage is unavailable.
    }
  }, [shouldPlayEntrySequence])

  useEffect(() => {
    if (showHeroIntro) return

    if (beforeHeroVideoAvailable && !beforeHeroVideoEnded) {
      beforeHeroVideoRef.current?.play().catch(() => {
        // Autoplay may be delayed by the browser even though the video is muted.
      })
      return
    }

    startLoopHeroVideo()
  }, [beforeHeroVideoAvailable, beforeHeroVideoEnded, showHeroIntro, startLoopHeroVideo])

  // 휠 스크롤 시 인접 섹션으로 부드럽게(easing) 이동
  useSmoothSectionScroll()

  return (
    <div className={`home-page min-h-screen flex flex-col ${showHeroIntro ? 'home-page--intro-active' : ''}`}>
      {showHeroIntro && <HeroWaveIntro onComplete={handleIntroComplete} />}

      <Header />
      <main className="flex-1 w-full overflow-x-clip">
        <section
          id="hero"
          className={`hero-video ${showHeroIntro ? 'hero-video--intro-active' : ''}`}
          aria-label="BootSignal main visual"
          data-home-section
        >
          {beforeHeroVideoAvailable && (
            <video
              ref={beforeHeroVideoRef}
              className={`hero-video__media hero-video__media--before ${
                heroVideoPhase === 'before'
                  ? 'hero-video__media--active'
                  : 'hero-video__media--before-exit'
              }`}
              muted
              playsInline
              preload="auto"
              onPlaying={handleBeforeHeroVideoPlaying}
              onEnded={finishBeforeHeroVideo}
              onError={handleBeforeHeroVideoError}
            >
              <source src={beforeHeroVideoMp4} type="video/mp4" />
            </video>
          )}

          {loopHeroVideoAvailable && (
            <video
              ref={loopHeroVideoRef}
              className="hero-video__media hero-video__media--loop"
              muted
              loop
              playsInline
              preload="auto"
              onLoadedMetadata={handleLoopHeroVideoLoadedMetadata}
              onSeeked={handleLoopHeroVideoSeeked}
              onCanPlay={() => {
                if (beforeHeroVideoEnded) startLoopHeroVideo()
              }}
              onPlaying={handleLoopHeroVideoPlaying}
              onError={() => setLoopHeroVideoAvailable(false)}
            >
              <source src={heroVideoMp4} type="video/mp4" />
            </video>
          )}

          {!loopHeroVideoAvailable && beforeHeroVideoEnded && !showHeroIntro && (
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

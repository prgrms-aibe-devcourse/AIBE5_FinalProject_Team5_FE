import { useEffect, useState } from 'react'

type HeroWaveIntroProps = {
  onComplete: () => void
}

const INTRO_TOTAL_MS = 3000
const EXIT_FADE_MS = 650

export default function HeroWaveIntro({ onComplete }: HeroWaveIntroProps) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let completeTimer: number | undefined

    if (prefersReducedMotion) {
      onComplete()
      return
    }

    const exitTimer = window.setTimeout(() => {
      setIsExiting(true)
      completeTimer = window.setTimeout(onComplete, EXIT_FADE_MS)
    }, INTRO_TOTAL_MS)

    return () => {
      window.clearTimeout(exitTimer)
      if (completeTimer !== undefined) {
        window.clearTimeout(completeTimer)
      }
    }
  }, [onComplete])

  return (
    <div className={`hero-intro ${isExiting ? 'hero-intro--exit' : 'hero-intro--play'}`} aria-hidden="true">
      <svg className="hero-intro__svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <path
            id="hero-intro-wave-back"
            d="M-80 700C80 650 220 672 360 720C500 768 620 774 760 724C900 674 1020 650 1160 700C1300 750 1400 746 1520 710V1800H-80Z"
          />
          <path
            id="hero-intro-wave-middle"
            d="M-80 742C80 716 230 680 380 720C530 760 640 812 800 780C960 748 1060 696 1210 716C1360 736 1430 770 1520 752V1800H-80Z"
          />
          <path
            id="hero-intro-wave-front"
            d="M-80 800C80 766 220 752 370 786C520 820 650 830 800 794C950 758 1080 746 1230 776C1380 806 1450 808 1520 790V1800H-80Z"
          />
          <clipPath id="hero-intro-water-clip" clipPathUnits="userSpaceOnUse">
            <path
              className="hero-intro__text-water-clip"
              d="M-80 800C80 766 220 752 370 786C520 820 650 830 800 794C950 758 1080 746 1230 776C1380 806 1450 808 1520 790V1800H-80Z"
            />
          </clipPath>
        </defs>

        <rect className="hero-intro__wash" x="0" y="0" width="1440" height="900" />

        <g className="hero-intro__wave-rise">
          <use href="#hero-intro-wave-back" className="hero-intro__wave-drift hero-intro__wave-drift--back" fill="#8bb4d2" />
          <use
            href="#hero-intro-wave-middle"
            className="hero-intro__wave-drift hero-intro__wave-drift--middle"
            fill="#5484b7"
          />
          <use href="#hero-intro-wave-front" className="hero-intro__wave-drift hero-intro__wave-drift--front" fill="#344a64" />
        </g>

        <text className="hero-intro__message hero-intro__message--dark" x="720" y="450" textAnchor="middle">
          "나와 비슷한 사람이 이 과정에서 살아남았는가?"
        </text>

        <text
          className="hero-intro__message hero-intro__message--light"
          x="720"
          y="450"
          textAnchor="middle"
          clipPath="url(#hero-intro-water-clip)"
        >
          "나와 비슷한 사람이 이 과정에서 살아남았는가?"
        </text>
      </svg>
    </div>
  )
}

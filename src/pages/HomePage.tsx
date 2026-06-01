import { useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import CountUp from '../components/common/CountUp'
import { useScrollReveal } from '../hooks/useScrollReveal'
import heroVideoMp4 from '../assets/smoother_watercolour_main.mp4'

const features = [
  {
    no: '01',
    title: '검증된 후기',
    desc: '수료생이 직접 남긴 진짜 후기만 모았습니다. 광고가 아닌 데이터로 과정을 판단하세요.',
  },
  {
    no: '02',
    title: '한눈에 비교',
    desc: '취업률·만족도·커리큘럼을 같은 기준으로 정렬해, 나에게 맞는 부트캠프를 빠르게 찾습니다.',
  },
  {
    no: '03',
    title: '신호 알림',
    desc: '관심 분야의 모집이 열리면 가장 먼저 신호를 보냅니다. 좋은 기회를 놓치지 마세요.',
  },
]

const stats = [
  { value: 1280, suffix: '+', label: '누적 후기' },
  { value: 96, suffix: '%', label: '추천 만족도' },
  { value: 47, suffix: '개', label: '비교 가능한 과정' },
]

export default function HomePage() {
  const [heroVideoAvailable, setHeroVideoAvailable] = useState(true)
  const contentRef = useScrollReveal<HTMLDivElement>()

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

          <div className="hero-intro" aria-hidden="true">
            <div className="hero-intro__motion">
              <span className="hero-intro__bar hero-intro__bar--a" />
              <span className="hero-intro__bar hero-intro__bar--b" />
              <span className="hero-intro__bar hero-intro__bar--c" />
            </div>

            <div className="hero-intro__message">
              <p className="hero-intro__kicker">BootSignal</p>
              <h1 aria-label="당신의 선택에 신호를 켜다">
                <span className="hero-intro__line hero-intro__line--a">
                  <span>당신의</span>
                </span>
                <span className="hero-intro__line hero-intro__line--b">
                  <span>선택에</span>
                </span>
                <span className="hero-intro__line hero-intro__line--c">
                  <span>신호를 켜다</span>
                </span>
              </h1>
              <p className="hero-intro__subline">KDT 후기를 읽는 가장 선명한 방법</p>
            </div>

            <div className="hero-intro__bubbles">
              <span className="hero-video__bubble hero-video__bubble--a" />
              <span className="hero-video__bubble hero-video__bubble--b" />
              <span className="hero-video__bubble hero-video__bubble--c" />
              <span className="hero-video__bubble hero-video__bubble--d" />
              <span className="hero-video__bubble hero-video__bubble--e" />
              <span className="hero-video__bubble hero-video__bubble--f" />
              <span className="hero-video__bubble hero-video__bubble--g" />
              <span className="hero-video__bubble hero-video__bubble--h" />
              <span className="hero-video__bubble hero-video__bubble--i" />
              <span className="hero-video__bubble hero-video__bubble--j" />
              <span className="hero-video__bubble hero-video__bubble--k" />
              <span className="hero-video__bubble hero-video__bubble--l" />
              <span className="hero-video__bubble hero-video__bubble--m" />
              <span className="hero-video__bubble hero-video__bubble--n" />
              <span className="hero-video__bubble hero-video__bubble--o" />
              <span className="hero-video__bubble hero-video__bubble--p" />
              <span className="hero-video__bubble hero-video__bubble--q" />
              <span className="hero-video__bubble hero-video__bubble--r" />
              <span className="hero-video__bubble hero-video__bubble--s" />
              <span className="hero-video__bubble hero-video__bubble--t" />
            </div>
          </div>

          {!heroVideoAvailable && (
            <div className="hero-video__fallback" aria-hidden="true">
              <div className="hero-video__horizon" />
              <div className="hero-video__water" />
              <div className="hero-video__figure" />
              <div className="hero-video__device" />
            </div>
          )}
        </section>

        <div className="home-scroll" ref={contentRef}>
          {/* 인트로 — 대각선 와이프 + 텍스트 마스크 리빌 */}
          <section className="scroll-section scroll-section--intro" aria-label="서비스 소개">
            <div className="scroll-wrap">
              <p className="scroll-kicker" data-reveal data-reveal-variant="up">
                MEMENTO&nbsp;·&nbsp;BOOTSIGNAL
              </p>
              <h2 className="scroll-headline">
                <span className="scroll-mask">
                  <span data-reveal data-reveal-variant="rise">
                    후기는 흩어져 있고,
                  </span>
                </span>
                <span className="scroll-mask">
                  <span data-reveal data-reveal-variant="rise" style={{ '--reveal-delay': '0.14s' } as React.CSSProperties}>
                    선택은 늘 어렵습니다.
                  </span>
                </span>
                <span className="scroll-mask">
                  <span data-reveal data-reveal-variant="rise" style={{ '--reveal-delay': '0.3s' } as React.CSSProperties}>
                    그래서, 신호를 켭니다.
                  </span>
                </span>
              </h2>
              <p className="scroll-lede" data-reveal data-reveal-variant="up" style={{ '--reveal-delay': '0.4s' } as React.CSSProperties}>
                BootSignal은 흩어진 KDT·부트캠프 후기를 한곳에 모아,
                가장 선명한 기준으로 다시 보여줍니다.
              </p>
              <span className="scroll-glow" data-parallax="-0.12" aria-hidden="true" />
            </div>
          </section>

          {/* 기능 — 카드 스태거 슬라이드 업 */}
          <section className="scroll-section scroll-section--features" aria-label="주요 기능">
            <div className="scroll-wrap">
              <p className="scroll-eyebrow" data-reveal data-reveal-variant="left">
                WHAT WE DO
              </p>
              <div className="feature-grid">
                {features.map((item, index) => (
                  <article
                    key={item.no}
                    className="feature-card"
                    data-reveal
                    data-reveal-variant="up"
                    style={{ '--reveal-delay': `${index * 0.14}s` } as React.CSSProperties}
                  >
                    <span className="feature-card__no">{item.no}</span>
                    <h3 className="feature-card__title">{item.title}</h3>
                    <p className="feature-card__desc">{item.desc}</p>
                    <span className="feature-card__line" aria-hidden="true" />
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* 스탯 — 카운트업 */}
          <section className="scroll-section scroll-section--stats" aria-label="서비스 지표">
            <div className="scroll-wrap stat-grid">
              {stats.map((item, index) => (
                <div
                  key={item.label}
                  className="stat-item"
                  data-reveal
                  data-reveal-variant="up"
                  style={{ '--reveal-delay': `${index * 0.12}s` } as React.CSSProperties}
                >
                  <p className="stat-item__value">
                    <CountUp to={item.value} suffix={item.suffix} />
                  </p>
                  <p className="stat-item__label">{item.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA — 대각선 와이프 패널 */}
          <section className="scroll-section scroll-section--cta" aria-label="시작하기">
            <div className="scroll-wrap cta-panel" data-reveal data-reveal-variant="wipe">
              <h2 className="cta-panel__title">
                지금, 당신의 선택에<br />신호를 켜세요.
              </h2>
              <p className="cta-panel__desc">진짜 후기로 시작하는 가장 선명한 진로 결정.</p>
              <a className="cta-panel__btn" href="/signup">
                무료로 시작하기
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

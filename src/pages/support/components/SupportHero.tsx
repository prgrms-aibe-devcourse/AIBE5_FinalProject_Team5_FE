import type { ReactNode } from 'react'
import type { SupportContactInfo } from '../data/supportData'

type SupportHeroProps = {
  contact: SupportContactInfo
}

function InfoBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="font-pretendard text-xs font-semibold text-deepOceanNavy">{label}</p>
      <div className="mt-2 font-pretendard text-sm leading-relaxed text-secondary">{children}</div>
    </div>
  )
}

// 고객센터 히어로
export default function SupportHero({ contact }: SupportHeroProps) {
  return (
    <section className="relative w-full overflow-hidden" aria-label="고객센터 소개">
      {/* 배경 */}
      <div className="relative overflow-hidden rounded-3xl border border-mistSkyBlue/40 bg-gradient-to-br from-foamWhite/70 via-white to-mistSkyBlue/15 p-8 shadow-[0_16px_48px_rgba(52,74,100,0.07)] md:p-10 lg:p-12">
        <div
          className="pointer-events-none absolute -right-12 top-0 h-56 w-56 rounded-full bg-softAquaBlue/15 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-44 w-80 rounded-full bg-waterlineBlue/6 blur-3xl"
          aria-hidden="true"
        />

        {/* 콘텐츠 영역 */}
        <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          
          {/* 콘텐츠 영역 왼쪽 (타이틀·설명) */}
          <div className="relative pl-5 md:pl-6">
            <div
              className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-gradient-to-b from-[#005EB8] via-waterlineBlue to-softAquaBlue/30"
              aria-hidden="true"
            />

            <h1 className="text-3xl font-bold leading-[1.25] tracking-tight text-deepOceanNavy md:text-4xl lg:text-[2.5rem]">
              궁금한 점이 있으신가요?
              <br />
              <span className="bg-gradient-to-r from-[#005EB8] via-waterlineBlue to-softAquaBlue bg-clip-text text-transparent">
                고객센터에서 안내해 드립니다
              </span>
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-deepOceanNavy/60 md:text-base">
              공지사항과 과정 인증 가이드를 확인하시고, 추가 문의가 필요하면 1:1 문의를 이용해 주세요.
            </p>
          </div>

          {/* 콘텐츠 영역 오른쪽 (문의 안내) */}
          <div className="overflow-hidden rounded-2xl border border-mistSkyBlue/35 bg-gradient-to-br from-white via-white to-foamWhite/60 p-6 shadow-[0_6px_24px_rgba(52,74,100,0.06)] sm:p-7">
            <h2 className="font-pretendard text-base font-semibold text-deepOceanNavy">문의 안내</h2>
            <p className="mt-2.5 font-pretendard text-sm leading-[1.75] text-secondary">
              기본 문의는 대시보드 문의를 이용해 주세요.
              <br />
              별도 문의가 필요하신 경우 아래 연락처를 참고해 주세요.
            </p>

            <div className="mt-6 grid gap-6 border-t border-mistSkyBlue/25 pt-6 sm:grid-cols-2 sm:gap-8">
              <InfoBlock label="이메일">{contact.email}</InfoBlock>
              <InfoBlock label="운영 시간">
                {contact.hours}
                <span className="mt-1 block text-secondary">{contact.lunchBreak}</span>
              </InfoBlock>
            </div>
          </div>
        </div>

        {/* 그라데이션 그림자 */}
        <svg
          className="pointer-events-none absolute bottom-0 left-0 w-full text-mistSkyBlue/20"
          viewBox="0 0 1440 56"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path fill="currentColor" d="M0,36 C360,52 540,20 720,36 C900,52 1080,24 1440,40 L1440,56 L0,56 Z" />
        </svg>
        
      </div>
    </section>
  )
}

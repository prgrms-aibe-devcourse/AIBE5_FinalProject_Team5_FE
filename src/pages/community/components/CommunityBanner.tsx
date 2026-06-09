import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { communitySections, type CommunitySectionKey } from '../communitySections'

// 커뮤니티 목록 메타 데이터 (설명 + 아이콘)
const sectionMeta: Record<
  CommunitySectionKey,
  { description: string; icon: ReactNode }
> = {
  posts: {
    description: '개발 팁과 경험 공유',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  qna: {
    description: '궁금한 점을 묻고 답하기',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
  recruit: {
    description: '팀원·스터디 모집',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  article: {
    description: '인사이트 아티클 읽기',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
}

// 커뮤니티 목록 키 (게시판, Q&A, 모집, 아티클) 
const sectionKeys = Object.keys(communitySections) as CommunitySectionKey[]

// 배너 내부 커뮤니티 목록 카드
function SectionCard({ sectionKey }: { sectionKey: CommunitySectionKey }) {
  const { label, listPath } = communitySections[sectionKey]
  const { description, icon } = sectionMeta[sectionKey]

  return (
    <NavLink
      to={listPath}
      className={({ isActive }) =>
        `group relative flex flex-col overflow-hidden rounded-2xl glass-panel p-4 transition-all duration-300 sm:p-5 ${
          isActive
            ? 'border-waterlineBlue/45 shadow-[0_8px_24px_rgba(0,94,184,0.12)] ring-1 ring-waterlineBlue/15'
            : 'border-mistSkyBlue/40 shadow-[0_4px_16px_rgba(52,74,100,0.05)] hover:-translate-y-0.5 hover:border-waterlineBlue/35 hover:shadow-[0_12px_32px_rgba(52,74,100,0.1)]'
        }`
      }
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-mistSkyBlue/0 via-mistSkyBlue/0 to-softAquaBlue/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />

      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-mistSkyBlue/45 to-softAquaBlue/25 text-deepOceanNavy ring-1 ring-white/80">
        {icon}
      </div>

      <p className="relative mt-3 font-semibold text-deepOceanNavy">{label}</p>
      <p className="relative mt-1 text-xs leading-relaxed text-secondary/90">{description}</p>
    </NavLink>
  )
}

// 커뮤니티 목록 배너
export default function CommunityBanner() {
  return (
    <section className="relative w-full overflow-hidden" aria-label="커뮤니티 소개">
      <div className="relative overflow-hidden rounded-3xl border border-mistSkyBlue/40 bg-gradient-to-br from-foamWhite/80 via-white to-mistSkyBlue/20 p-8 shadow-[0_20px_60px_rgba(52,74,100,0.08)] ring-1 ring-white/70 md:p-10 lg:p-12">
        {/* 배너 내부 배경 그라데이션 */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden="true"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(139,180,210,0.14) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        <div
          className="pointer-events-none absolute -right-8 top-0 h-52 w-52 rounded-full bg-softAquaBlue/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-40 w-72 rounded-full bg-waterlineBlue/8 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-12 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full border border-mistSkyBlue/30"
          aria-hidden="true"
        />

        {/* 배너 내부 컨텐츠 영역 */}
        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div className="relative pl-5 md:pl-6">
            
            {/* 배너 내부 선 */}
            <div
              className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-gradient-to-b from-[#005EB8] via-waterlineBlue to-softAquaBlue/30"
              aria-hidden="true"
            />

            {/* 배너 내부 제목 */}
            <h1 className="text-3xl font-bold leading-[1.2] tracking-tight text-deepOceanNavy md:text-4xl lg:text-[2.65rem]">
              함께 나누고,
              <br />
              <span className="bg-gradient-to-r from-[#005EB8] via-waterlineBlue to-softAquaBlue bg-clip-text text-transparent">
                함께 성장하는 커뮤니티
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-deepOceanNavy/65 md:text-base">
              게시판, Q&amp;A, 모집, 아티클을 통해 실무 경험과 취업 정보를 나누고
              서로의 성장을 응원해 보세요.
            </p>
          </div>

          {/* 배너 내부 커뮤니티 목록 카드 */}
          <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
            {sectionKeys.map((key) => (
              <SectionCard key={key} sectionKey={key} />
            ))}
          </div>
        </div>

        <svg
          className="pointer-events-none absolute bottom-0 left-0 w-full text-mistSkyBlue/25"
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

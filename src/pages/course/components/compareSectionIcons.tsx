// 과정 비교 섹션 아이콘
import type { ReactNode } from 'react'

function SectionIconBadge({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-waterlineBlue shadow-sm ring-1 ring-mistSkyBlue/60">
      {children}
    </span>
  )
}

function BasicInfoIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function RecruitmentIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4 20c0-2.8 2.2-5 5-5s5 2.2 5 5M14 20c0-1.9 1.3-3.5 3-3.9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function RatingIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4l2.2 4.5 5 .7-3.6 3.5.9 5.1L12 15.8 7.5 18.8l.9-5.1L4.8 9.2l5-.7L12 4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CourseInfoIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 19V5a2 2 0 012-2h9l5 5v11a2 2 0 01-2 2H6a2 2 0 01-2-2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M13 3v6h6M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function VerifiedStatsIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 19h16M7 16V9m5 7V5m5 11v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

const SECTION_ICON_MAP: Record<string, ReactNode> = {
  '기본 정보': <BasicInfoIcon />,
  '모집 현황': <RecruitmentIcon />,
  '평가 지표': <RatingIcon />,
  '과정 정보': <CourseInfoIcon />,
  '인증 리뷰 통계': <VerifiedStatsIcon />,
}

export function CompareSectionIcon({ label }: { label: string }) {
  const icon = SECTION_ICON_MAP[label] ?? <BasicInfoIcon />

  return <SectionIconBadge>{icon}</SectionIconBadge>
}

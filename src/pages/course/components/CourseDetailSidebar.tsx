import type { ReactNode } from 'react'
import type { CourseDetail } from '../../../services/course.ts'

interface CourseDetailSidebarProps {
  course: CourseDetail
}

function SummaryIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10 14a4 4 0 005.7 0l2.6-2.6a4 4 0 00-5.7-5.7L11 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14 10a4 4 0 00-5.7 0L5.7 12.6a4 4 0 005.7 5.7L13 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

interface PipeRowProps {
  label: string
  value: string
  /** 긴 텍스트 — 라벨 아래 값을 전체 너비로 표시 */
  multiline?: boolean
}

/** 헤더 InfoRow와 동일한 라벨 | 값 형식 (짧은 항목) */
function PipeRow({ label, value, multiline }: PipeRowProps) {
  if (multiline) {
    return (
      <div
        aria-label={label}
        className="rounded-lg border border-mistSkyBlue/35 px-3.5 py-3"
      >
        <p className="text-sm font-semibold leading-[1.65] text-deepOceanNavy/95 md:text-[0.9375rem]">
          {value}
        </p>
      </div>
    )
  }

  return (
    <p className="text-sm leading-relaxed text-deepOceanNavy md:text-[0.9375rem]">
      <span className="font-medium">{label}</span>
      <span className="mx-1.5 text-mistSkyBlue" aria-hidden="true">
        |
      </span>
      <span className="text-deepOceanNavy/90">{value}</span>
    </p>
  )
}

interface ContactRowProps {
  icon: ReactNode
  label: string
  value: string
  href?: string
}

function ContactRow({ icon, label, value, href }: ContactRowProps) {
  const valueClass =
    'text-sm font-medium leading-snug text-deepOceanNavy break-all md:text-[0.9375rem]'

  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-waterlineBlue ring-1 ring-mistSkyBlue/50">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-secondary">{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${valueClass} text-waterlineBlue underline-offset-2 hover:underline`}
          >
            {value}
          </a>
        ) : (
          <p className={valueClass}>{value}</p>
        )}
      </div>
    </div>
  )
}

export default function CourseDetailSidebar({ course }: CourseDetailSidebarProps) {
  return (
    <aside className="flex flex-col gap-5 lg:sticky lg:top-28 lg:w-72 xl:w-80">
      <div className="overflow-hidden rounded-2xl border border-mistSkyBlue/50 bg-white shadow-[0_2px_12px_rgba(52,74,100,0.06)]">
        {/* 헤더 — CourseDetailInfoSections와 동일 톤 */}
        <div className="flex items-center gap-3 border-b border-mistSkyBlue/45 bg-gradient-to-r from-mistSkyBlue/55 via-softAquaBlue/45 to-waterlineBlue/30 px-5 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-waterlineBlue shadow-sm ring-1 ring-mistSkyBlue/60">
            <SummaryIcon />
          </span>
          <h3 className="text-base font-bold tracking-tight text-deepOceanNavy md:text-lg">
            과정 주요 정보
          </h3>
        </div>

        <div className="space-y-5 px-5 py-5 md:px-6">
          <div className="space-y-2.5">
            <PipeRow label="과정명" value={course.title} multiline />
            <PipeRow label="과정 기관" value={course.company} />
            <PipeRow label="기수" value={course.batch} />
            
            
            <PipeRow label="지역" value={course.location} />
            <PipeRow label="부담 비용" value={course.price} />
            <PipeRow label="진행 기간" value={course.dateRange} />
          </div>

          {/* 연락처 */}
          <div className="rounded-xl border border-mistSkyBlue/40 bg-foamWhite/50 p-4">
            <p className="mb-3 text-sm font-semibold text-deepOceanNavy">연락처</p>
            <div className="space-y-3.5">
              <ContactRow icon={<PhoneIcon />} label="전화번호" value={course.contact.phone} />
              <ContactRow icon={<MailIcon />} label="이메일" value={course.contact.email} />
              <ContactRow
                icon={<LinkIcon />}
                label="홈페이지"
                value={course.contact.homepage}
                href={course.contact.homepage}
              />
            </div>
          </div>
        </div>
      </div>

      <a
        href={course.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full rounded-xl bg-deepOceanNavy py-3.5 text-center text-base font-semibold text-white shadow-[0_4px_14px_rgba(52,74,100,0.18)] transition-colors hover:bg-waterlineBlue"
      >
        홈페이지 방문
      </a>
    </aside>
  )
}

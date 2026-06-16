import type { ReactNode } from 'react'
// ReactNode은 SectionConfig icon 필드에서 계속 사용됨
import type { CourseDetail } from '../../../services/course.ts'

interface CourseDetailInfoSectionsProps {
  course: CourseDetail
}

interface SectionConfig {
  title: string
  content: string
  icon: ReactNode
  variant?: 'list' | 'prose'
}

function parseLines(content: string): string[] {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}


function EligibilityIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 12l2 2 4-4M7.5 4.5h9A2.5 2.5 0 0119 7v10a2.5 2.5 0 01-2.5 2.5h-9A2.5 2.5 0 015 17V7a2.5 2.5 0 012.5-2.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function GoalsIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 4V2M12 22v-2M4 12H2M22 12h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 10v6M12 8h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function InstitutionIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20V9l8-5 8 5v11M9 20v-5h6v5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface DetailSectionProps extends SectionConfig {}

function DetailSection({ title, content, icon, variant = 'list' }: DetailSectionProps) {
  const lines = parseLines(content)

  return (
    <section>
      <div className="mb-2 px-1">
        <div className="inline-flex items-center gap-2 rounded-full border border-mistSkyBlue/40 bg-white/30 px-4 py-1.5 shadow-[0_4px_16px_rgba(52,74,100,0.10)] backdrop-blur-md">
          <span className="flex h-6 w-6 items-center justify-center text-waterlineBlue">{icon}</span>
          <h3 className="text-sm font-bold tracking-tight text-deepOceanNavy">{title}</h3>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl glass-panel shadow-[0_4px_20px_rgba(52,74,100,0.10)]">
      <div className="px-5 py-4 md:px-6 md:py-5">
        {variant === 'prose' ? (
          <p className="text-sm leading-[1.75] text-deepOceanNavy/85 md:text-[0.9375rem]">{content}</p>
        ) : (
          <ul className="space-y-3">
            {lines.map((line, index) => (
              <li
                key={`${title}-${index}`}
                className="flex gap-3 text-sm leading-relaxed text-deepOceanNavy/90 md:text-[0.9375rem]"
              >
                <span
                  className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-linear-to-br from-waterlineBlue to-softAquaBlue"
                  aria-hidden="true"
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      </div>
    </section>
  )
}

export default function CourseDetailInfoSections({ course }: CourseDetailInfoSectionsProps) {
  const sections: SectionConfig[] = [
    { title: '지원자격', content: course.eligibility, icon: <EligibilityIcon /> },
    { title: '과정목표', content: course.goals, icon: <GoalsIcon /> },
    { title: '기타정보', content: course.otherInfo, icon: <InfoIcon /> },
    {
      title: '기관소개',
      content: course.institutionInfo,
      icon: <InstitutionIcon />,
      variant: 'prose',
    },
  ]

  return (
    <div className="space-y-5">
      {sections.map((section) => (
        <DetailSection key={section.title} {...section} />
      ))}
    </div>
  )
}

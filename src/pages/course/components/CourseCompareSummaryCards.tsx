// 과정 비교 요약 카드
import { Link } from 'react-router-dom'
import type { CourseDetail } from '../../../services/course.ts'
import {
  COMPARE_RESPONSIVE_GRID_CLASS,
  getCompareGridVars,
  type CompareLayoutConfig,
} from './compareLayout.ts'
import CourseThumbnail from './CourseThumbnail.tsx'

interface CourseCompareSummaryCardsProps {
  courses: CourseDetail[]
  layout: CompareLayoutConfig
}

function BuildingIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 text-softAquaBlue"
      aria-hidden="true"
    >
      <path
        d="M4 21V7l8-4 8 4v14M4 21h16M9 21v-6h6v6M9 9h.01M15 9h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function CourseCompareSummaryCards({ courses, layout }: CourseCompareSummaryCardsProps) {
  return (
    <div className={layout.containerClassName}>
      <div
        className={`${COMPARE_RESPONSIVE_GRID_CLASS} gap-2 md:gap-3`}
        style={getCompareGridVars(layout)}
      >
        <div aria-hidden="true" />
        {courses.map((course) => {
          const detailPath =
            course.courseSessionId != null
              ? `/courses/${course.courseSessionId}`
              : `/courses/${course.id}`

          return (
            <div key={course.courseSessionId ?? course.id} className="flex min-w-0 justify-center px-0.5 md:px-2">
              <article
                className={`group flex w-full max-md:max-w-none flex-col overflow-hidden rounded-xl glass-panel shadow-[0_2px_12px_rgba(52,74,100,0.06)] ring-1 ring-mistSkyBlue/25 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(52,74,100,0.12)] hover:ring-waterlineBlue/35 md:rounded-2xl ${layout.summaryCardMaxWidth}`}
              >
                <div className="overflow-hidden border-b border-mistSkyBlue/20">
                  <CourseThumbnail
                    imageUrl={course.logoUrl}
                    alt={`${course.title} 대표 이미지`}
                    className="rounded-none transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                  />
                </div>

                <div className="flex flex-1 flex-col items-center gap-1.5 px-2 py-2 text-center md:gap-2.5 md:px-4 md:py-4">
                  <h2 className="line-clamp-2 min-h-[2rem] text-[11px] font-bold leading-snug text-deepOceanNavy md:min-h-[2.5rem] md:text-sm">
                    {course.title}
                  </h2>

                  <p className="flex w-full items-center justify-center gap-1 text-[10px] text-secondary md:gap-1.5 md:text-xs">
                    <BuildingIcon />
                    <span className="line-clamp-1">{course.company}</span>
                  </p>

                  <Link
                    to={detailPath}
                    className="inline-flex items-center gap-0.5 rounded-md border border-waterlineBlue/25 bg-waterlineBlue/[0.06] px-2 py-1 text-[10px] font-semibold text-waterlineBlue transition-colors hover:border-waterlineBlue/45 hover:bg-waterlineBlue/10 hover:text-deepOceanNavy md:mt-1 md:gap-1 md:rounded-lg md:px-3 md:py-1.5 md:text-xs"
                  >
                    상세
                    <ArrowRightIcon />
                  </Link>
                </div>
              </article>
            </div>
          )
        })}
      </div>
    </div>
  )
}

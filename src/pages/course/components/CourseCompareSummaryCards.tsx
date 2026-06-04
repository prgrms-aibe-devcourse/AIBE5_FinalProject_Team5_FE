// 과정 비교 요약 카드
import { Link } from 'react-router-dom'
import type { CourseDetail } from '../../../services/course.ts'
import type { CompareLayoutConfig } from './compareLayout.ts'

interface CourseCompareSummaryCardsProps {
  courses: CourseDetail[]
  layout: CompareLayoutConfig
}

export default function CourseCompareSummaryCards({ courses, layout }: CourseCompareSummaryCardsProps) {
  return (
    <div className={layout.containerClassName}>
      <div className="grid gap-3" style={{ gridTemplateColumns: layout.gridTemplateColumns }}>
        <div aria-hidden="true" />
        {courses.map((course) => (
          <div key={course.id} className="flex justify-center px-1 sm:px-2">
            <article
              className={`flex w-full flex-col overflow-hidden rounded-xl border border-mistSkyBlue/50 bg-white shadow-sm ${layout.summaryCardMaxWidth}`}
            >
              <div className="aspect-[16/10] w-full bg-foamWhite">
                {course.logoUrl ? (
                  <img src={course.logoUrl} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="flex flex-1 flex-col items-center px-4 py-4 text-center">
                <h2 className="line-clamp-2 text-sm font-bold leading-snug text-deepOceanNavy">
                  {course.title}
                </h2>
                <p className="mt-2 text-xs text-secondary">{course.dateRange}</p>
                <Link
                  to={`/courses/${course.id}`}
                  className="mt-2.5 text-xs font-semibold text-waterlineBlue underline underline-offset-2 hover:text-deepOceanNavy"
                >
                  상세 보기
                </Link>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  )
}

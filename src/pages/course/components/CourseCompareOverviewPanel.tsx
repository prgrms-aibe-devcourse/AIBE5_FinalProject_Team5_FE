// 과정 비교 요약 패널
import type { CourseDetail } from '../../../services/course.ts'
import type { CompareLayoutConfig } from './compareLayout.ts'

interface CourseCompareOverviewPanelProps {
  courses: CourseDetail[]
  layout: CompareLayoutConfig
}

export default function CourseCompareOverviewPanel({ courses, layout }: CourseCompareOverviewPanelProps) {
  const metrics = [
    { label: '만족도', getValue: (c: CourseDetail) => c.satisfaction },
    { label: '취업률', getValue: (c: CourseDetail) => c.employmentRate },
    { label: '별점', getValue: (c: CourseDetail) => c.rating },
  ]

  return (
    <section className={`rounded-2xl border border-mistSkyBlue/35 bg-foamWhite/35 p-5 md:p-6 ${layout.containerClassName}`}>
      <h2 className="mb-4 text-base font-bold text-deepOceanNavy md:text-lg">비교 요약</h2>
      <div className="space-y-4">
        {metrics.map((metric) => {
          const values = courses.map((course) => metric.getValue(course))
          const numeric = values.map((v) => parseFloat(v.replace(/[^\d.]/g, '')) || 0)
          const max = Math.max(...numeric, 1)

          return (
            <div
              key={metric.label}
              className="grid items-center gap-x-2 sm:gap-x-3"
              style={{ gridTemplateColumns: layout.gridTemplateColumns }}
            >
              <p className="text-sm font-semibold text-deepOceanNavy">{metric.label}</p>
              {courses.map((course, index) => (
                <div key={course.id} className="min-w-0 px-1 sm:px-2">
                  <div className="h-2 overflow-hidden rounded-full bg-mistSkyBlue/25">
                    <div
                      className="h-full rounded-full bg-waterlineBlue"
                      style={{ width: `${(numeric[index] / max) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1 truncate text-center text-xs font-semibold text-deepOceanNavy">
                    {values[index]}
                  </p>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </section>
  )
}

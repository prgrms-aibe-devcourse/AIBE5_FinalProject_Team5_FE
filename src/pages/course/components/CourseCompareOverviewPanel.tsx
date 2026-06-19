// 과정 비교 요약 패널
import type { CourseDetail } from '../../../services/course.ts'
import { isMissingDisplayValue } from '../../../services/course.ts'
import type { CompareLayoutConfig } from './compareLayout.ts'

interface CourseCompareOverviewPanelProps {
  courses: CourseDetail[]
  layout: CompareLayoutConfig
}

function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex items-center justify-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const filled = value - i
        if (filled >= 1) {
          return <span key={i} className="text-base leading-none text-yellow-400">★</span>
        }
        if (filled >= 0.5) {
          return (
            <span key={i} className="relative text-base leading-none">
              <span className="text-mistSkyBlue/40">★</span>
              <span className="absolute inset-0 overflow-hidden w-1/2 text-yellow-400">★</span>
            </span>
          )
        }
        return <span key={i} className="text-base leading-none text-mistSkyBlue/40">★</span>
      })}
      <span className="ml-1 text-xs font-semibold text-deepOceanNavy">{value.toFixed(1)}</span>
    </div>
  )
}

function MissingValue() {
  return <p className="py-1 text-center text-xs font-semibold text-deepOceanNavy">-</p>
}

type MetricConfig =
  | { label: '만족도'; type: 'stars' }
  | { label: '취업률'; type: 'bar'; getValue: (c: CourseDetail) => string }

const METRICS: MetricConfig[] = [
  { label: '만족도', type: 'stars' },
  { label: '취업률', type: 'bar', getValue: (c) => c.employmentRate },
]

export default function CourseCompareOverviewPanel({ courses, layout }: CourseCompareOverviewPanelProps) {
  return (
    <section className={`rounded-2xl border border-mistSkyBlue/35 bg-foamWhite/35 p-5 md:p-6 ${layout.containerClassName}`}>
      <h2 className="mb-4 text-base font-bold text-deepOceanNavy md:text-lg">비교 요약</h2>
      <div className="space-y-4">
        {METRICS.map((metric) => {
          const values =
            metric.type === 'stars'
              ? courses.map((c) => c.satisfactionOutOf5)
              : courses.map((c) => metric.getValue(c))

          const barNumerics =
            metric.type === 'bar'
              ? values.map((v) => (typeof v === 'string' ? parseFloat(v.replace(/[^\d.]/g, '')) || 0 : 0))
              : []

          const barMax = 100

          return (
            <div
              key={metric.label}
              className="grid items-center gap-x-2 sm:gap-x-3"
              style={{ gridTemplateColumns: layout.gridTemplateColumns }}
            >
              <p className="text-sm font-semibold text-deepOceanNavy">{metric.label}</p>
              {courses.map((course, index) => (
                <div key={course.courseSessionId ?? course.id} className="min-w-0 px-1 sm:px-2">
                  {metric.type === 'stars' ? (
                    values[index] != null ? (
                      <div className="py-1">
                        <StarRating value={values[index] as number} max={5} />
                      </div>
                    ) : (
                      <MissingValue />
                    )
                  ) : isMissingDisplayValue(values[index] as string) ? (
                    <MissingValue />
                  ) : (
                    <>
                      <div className="h-2 overflow-hidden rounded-full bg-mistSkyBlue/25">
                        <div
                          className="h-full rounded-full bg-waterlineBlue"
                          style={{
                            width: `${(Math.min(barNumerics[index], barMax) / barMax) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="mt-1 truncate text-center text-xs font-semibold text-deepOceanNavy">
                        {values[index] as string}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </section>
  )
}

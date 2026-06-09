// 항목별 상세 비교 표
import type { CourseDetail } from '../../../services/course.ts'
import type { VerifiedReviewStats } from '../data/mockCourseReviews.ts'
import { COMPARE_TABLE_ROWS } from '../data/mockCourseCompare.ts'
import type { CompareLayoutConfig } from './compareLayout.ts'
import { CompareSectionIcon } from './compareSectionIcons.tsx'
import { groupCompareRows } from './groupCompareRows.ts'

interface CourseCompareTableProps {
  courses: CourseDetail[]
  statsByColumn: VerifiedReviewStats[]
  layout: CompareLayoutConfig
}

function CompareStatsCell({ stats }: { stats: VerifiedReviewStats }) {
  const topMetrics = stats.qualityMetrics.slice(0, 3)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 rounded-lg border border-mistSkyBlue/35 bg-foamWhite/60 px-3 py-2.5">
        <div>
          <p className="text-[0.7rem] font-medium text-secondary">인증 리뷰</p>
          <p className="text-lg font-bold text-deepOceanNavy">{stats.reviewCount}건</p>
        </div>
        <div className="text-right">
          <p className="text-[0.7rem] font-medium text-secondary">평균</p>
          <p className="text-2xl font-bold leading-none text-waterlineBlue">{stats.averageRating.toFixed(1)}</p>
        </div>
      </div>
      <ul className="space-y-2">
        {topMetrics.map((item) => (
          <li key={item.label} className="flex items-center justify-between gap-2 text-sm">
            <span className="text-secondary">{item.label}</span>
            <span className="font-bold tabular-nums text-deepOceanNavy">{item.value.toFixed(1)}</span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-softAquaBlue">* 5점 만점</p>
    </div>
  )
}

export default function CourseCompareTable({ courses, statsByColumn, layout }: CourseCompareTableProps) {
  const sections = groupCompareRows(COMPARE_TABLE_ROWS)

  return (
    <section className={layout.containerClassName}>
      <div className="mb-5">
        <h2 className="text-base font-bold text-deepOceanNavy md:text-lg">항목별 상세 비교</h2>
        <p className="mt-1 text-sm text-secondary">카테고리별로 항목을 묶어 비교했습니다.</p>
      </div>

      <div className="space-y-5">
        {sections.map((section) => (
          <div
            key={section.label}
            className="overflow-hidden rounded-2xl glass-panel shadow-[0_2px_12px_rgba(52,74,100,0.06)]"
          >
            <div className="flex items-center gap-3 border-b border-mistSkyBlue/45 bg-gradient-to-r from-mistSkyBlue/55 via-softAquaBlue/45 to-waterlineBlue/30 px-5 py-4 md:px-6">
              <CompareSectionIcon label={section.label} />
              <h3 className="text-base font-bold tracking-tight text-deepOceanNavy">{section.label}</h3>
            </div>

            <div className="divide-y divide-mistSkyBlue/25">
              {section.fields.map((field) => (
                <div
                  key={field.label}
                  className="grid items-stretch"
                  style={{ gridTemplateColumns: layout.gridTemplateColumns }}
                >
                  <div className="flex items-center bg-foamWhite/50 px-4 py-3.5 text-sm font-medium text-secondary md:px-5">
                    {field.label}
                  </div>
                  {courses.map((course) => (
                    <div
                      key={`${section.label}-${field.label}-${course.id}`}
                      className="flex items-center border-l border-mistSkyBlue/30 bg-transparent px-4 py-3.5 md:px-5"
                    >
                      <p className="text-sm font-semibold leading-relaxed text-deepOceanNavy">
                        {field.getValue(course)}
                      </p>
                    </div>
                  ))}
                </div>
              ))}

              {section.includeStats ? (
                <div
                  className="grid items-stretch bg-foamWhite/35"
                  style={{ gridTemplateColumns: layout.gridTemplateColumns }}
                >
                  <div className="flex items-start bg-foamWhite/50 px-4 py-4 text-sm font-medium text-secondary md:px-5">
                    통계 비교
                  </div>
                  {statsByColumn.map((stats, index) => (
                    <div
                      key={`stats-${courses[index]?.id ?? index}`}
                      className="border-l border-mistSkyBlue/30 bg-transparent px-4 py-4 md:px-5"
                    >
                      <CompareStatsCell stats={stats} />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// 항목별 상세 비교 표
import { useState } from 'react'
import type { CourseDetail } from '../../../services/course.ts'
import { isMissingDisplayValue } from '../../../services/course.ts'

import type { VerifiedReviewStatistics } from '../../../services/review.ts'
import { COMPARE_TABLE_ROWS } from '../data/mockCourseCompare.ts'
import type { CompareLayoutConfig } from './compareLayout.ts'
import { CompareSectionIcon } from './compareSectionIcons.tsx'
import { groupCompareRows } from './groupCompareRows.ts'

interface CourseCompareTableProps {
  courses: CourseDetail[]
  statsByColumn: VerifiedReviewStatistics[]
  layout: CompareLayoutConfig
}

const EXPAND_CHAR_THRESHOLD = 72

function parseContentLines(content: string): string[] {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function isExpandableContent(content: string): boolean {
  const trimmed = content.trim()
  const lines = parseContentLines(content)
  return lines.length > 2 || trimmed.length > EXPAND_CHAR_THRESHOLD
}

function CompareExpandableCell({
  content,
  expanded,
  relaxedLineHeight = false,
}: {
  content: string
  expanded: boolean
  relaxedLineHeight?: boolean
}) {
  if (isMissingDisplayValue(content)) {
    return <p className="w-full text-center text-sm font-semibold text-deepOceanNavy">-</p>
  }

  const trimmed = content.trim()
  const lines = parseContentLines(trimmed)
  const expandedLeading = relaxedLineHeight ? 'leading-[1.9]' : 'leading-relaxed'
  const collapsedLeading = relaxedLineHeight ? 'leading-[1.75]' : 'leading-relaxed'

  if (expanded && lines.length > 1) {
    return (
      <div className={`w-full space-y-3 text-left ${expandedLeading}`}>
        {lines.map((line, index) => (
          <p key={index} className="text-sm text-deepOceanNavy/90">
            {line}
          </p>
        ))}
      </div>
    )
  }

  return (
    <p
      className={`w-full text-sm text-deepOceanNavy/90 ${
        expanded ? `whitespace-pre-line text-left ${expandedLeading}` : `line-clamp-3 text-center ${collapsedLeading}`
      }`}
    >
      {trimmed}
    </p>
  )
}

function ExpandToggleButton({
  expanded,
  onClick,
  label,
}: {
  expanded: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      aria-expanded={expanded}
      aria-label={expanded ? `${label} 접기` : `${label} 펼치기`}
      onClick={onClick}
      className="flex w-full min-h-11 items-center justify-center gap-2 py-3 text-waterlineBlue transition-colors hover:bg-foamWhite/70 hover:text-deepOceanNavy active:bg-foamWhite"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {expanded ? (
          <path
            d="M6 14l6-6 6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M6 10l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  )
}

function CompareStatsCell({ stats }: { stats: VerifiedReviewStatistics }) {
  const topMetrics = stats.qualityMetrics.slice(0, 3)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 rounded-lg border border-mistSkyBlue/35 bg-foamWhite/60 px-3 py-2.5">
        <div>
          <p className="text-[0.7rem] font-medium text-secondary">인증 후기</p>
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
  const [expandedRows, setExpandedRows] = useState<Set<string>>(() => new Set())

  const toggleRow = (rowKey: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(rowKey)) next.delete(rowKey)
      else next.add(rowKey)
      return next
    })
  }

  return (
    <section className={layout.containerClassName}>
      <div className="mb-5">
        <h2 className="text-base font-bold text-deepOceanNavy md:text-lg">항목별 상세 비교</h2>
        <p className="mt-1 text-sm text-secondary">카테고리별로 항목을 묶어 비교했습니다.</p>
      </div>

      <div className="space-y-10">
        {sections.map((section) => {
          const contentField = section.contentOnly ? section.fields[0] : null
          const isExpanded = expandedRows.has(section.label)
          const sectionExpandable =
            contentField != null &&
            courses.some((course) => isExpandableContent(contentField.getValue(course)))

          return (
          <div key={section.label}>
            <div className="mb-2 px-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-mistSkyBlue/40 bg-white/30 px-4 py-1.5 shadow-[0_4px_16px_rgba(52,74,100,0.10)] backdrop-blur-md">
                <CompareSectionIcon label={section.label} />
                <h3 className="text-sm font-bold tracking-tight text-deepOceanNavy">{section.label}</h3>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl glass-panel shadow-[0_2px_12px_rgba(52,74,100,0.06)]">

            <div className="divide-y divide-mistSkyBlue/25">
            {section.contentOnly && contentField ? (
              <>
              <div
                className="grid items-stretch"
                style={{ gridTemplateColumns: layout.gridTemplateColumns }}
              >
                <div
                  className="bg-foamWhite/50 px-4 py-5 md:px-5"
                  aria-hidden="true"
                />
                {courses.map((course) => (
                  <div
                    key={`${section.label}-${course.courseSessionId ?? course.id}`}
                    className="flex items-start justify-center border-l border-mistSkyBlue/30 bg-transparent px-3 py-4 md:px-4 md:py-5"
                  >
                    <CompareExpandableCell
                      content={contentField.getValue(course)}
                      expanded={isExpanded}
                      relaxedLineHeight={section.label === '지원자격'}
                    />
                  </div>
                ))}
              </div>
              {sectionExpandable ? (
                <div className="border-t border-mistSkyBlue/25">
                  <ExpandToggleButton
                    expanded={isExpanded}
                    onClick={() => toggleRow(section.label)}
                    label={section.label}
                  />
                </div>
              ) : null}
              </>
            ) : (
              <>
              {section.fields.map((field) => (
                <div
                  key={field.label}
                  className="grid items-stretch"
                  style={{ gridTemplateColumns: layout.gridTemplateColumns }}
                >
                  <div className="flex items-center justify-center bg-foamWhite/50 px-4 py-5 text-sm font-medium text-secondary md:px-5">
                    {field.label}
                  </div>
                  {courses.map((course) => (
                    <div
                      key={`${section.label}-${field.label}-${course.courseSessionId ?? course.id}`}
                      className="flex items-center justify-center border-l border-mistSkyBlue/30 bg-transparent px-3 py-4 text-center md:px-4 md:py-5"
                    >
                      <p className="w-full px-1 text-sm font-semibold leading-relaxed text-deepOceanNavy">
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
                      key={`stats-${courses[index]?.courseSessionId ?? courses[index]?.id ?? index}`}
                      className="border-l border-mistSkyBlue/30 bg-transparent px-4 py-4 md:px-5"
                    >
                      <CompareStatsCell stats={stats} />
                    </div>
                  ))}
                </div>
              ) : null}
              </>
            )}
            </div>
            </div>
          </div>
          )
        })}
      </div>
    </section>
  )
}

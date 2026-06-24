// 항목별 상세 비교 표
import { useState } from 'react'
import type { CourseDetail } from '../../../services/course.ts'
import { isMissingDisplayValue } from '../../../services/course.ts'

import type { VerifiedReviewStatistics } from '../../../services/review.ts'
import { COMPARE_TABLE_ROWS } from '../data/courseCompareRows.ts'
import type { CompareLayoutConfig } from './compareLayout.ts'
import { COMPARE_RESPONSIVE_GRID_CLASS, getCompareGridVars } from './compareLayout.ts'
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
    return <p className="w-full text-center text-[10px] font-semibold text-deepOceanNavy md:text-sm">-</p>
  }

  const trimmed = content.trim()
  const lines = parseContentLines(trimmed)
  const expandedLeading = relaxedLineHeight ? 'leading-[1.9]' : 'leading-relaxed'
  const collapsedLeading = relaxedLineHeight ? 'leading-[1.75]' : 'leading-relaxed'

  if (expanded && lines.length > 1) {
    return (
      <div className={`w-full space-y-2 text-left md:space-y-3 ${expandedLeading}`}>
        {lines.map((line, index) => (
          <p key={index} className="break-words text-[10px] text-deepOceanNavy/90 md:text-sm">
            {line}
          </p>
        ))}
      </div>
    )
  }

  return (
    <p
      className={`w-full break-words text-[10px] text-deepOceanNavy/90 md:text-sm ${
        expanded ? `whitespace-pre-line text-left leading-relaxed ${expandedLeading}` : `line-clamp-3 text-center leading-snug ${collapsedLeading}`
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

function CompareStatsInfoTooltip({ text }: { text: string }) {
  return (
    <span className="group/info relative inline-flex">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-sm text-waterlineBlue/80 transition-colors hover:text-waterlineBlue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-waterlineBlue/30"
        aria-label="안내 보기"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-0 top-full z-20 mt-2 w-max whitespace-nowrap rounded-lg border border-mistSkyBlue/45 bg-white px-3 py-2 text-left text-xs leading-none text-deepOceanNavy/85 opacity-0 shadow-[0_8px_24px_rgba(52,74,100,0.12)] transition-opacity duration-150 group-hover/info:opacity-100 group-focus-within/info:opacity-100"
      >
        {text}
      </span>
    </span>
  )
}

function getMetricValue(stats: VerifiedReviewStatistics, label: string): number {
  return stats.qualityMetrics.find((item) => item.label === label)?.value ?? 0
}

function averageMetricLabels(stats: VerifiedReviewStatistics, labels: string[]): number {
  if (labels.length === 0) return 0
  const sum = labels.reduce((total, label) => total + getMetricValue(stats, label), 0)
  return sum / labels.length
}

const COURSE_QUALITY_LABELS = ['강사 전달력', '커리큘럼', '취업 지원'] as const
const PROJECT_EXPERIENCE_LABELS = ['프로젝트 성취도', '툴 지원', '멘토링'] as const

type MetricGroupKey = 'course-quality' | 'project-experience'

const METRIC_GROUP_KEYS: MetricGroupKey[] = ['course-quality', 'project-experience']

const METRIC_GROUP_CONFIG: Record<
  MetricGroupKey,
  { title: string; labels: readonly string[] }
> = {
  'course-quality': { title: '과정 품질', labels: COURSE_QUALITY_LABELS },
  'project-experience': { title: '프로젝트 경험', labels: PROJECT_EXPERIENCE_LABELS },
}

function PriorKnowledgeSummary({ stats }: { stats: VerifiedReviewStatistics }) {
  const total = stats.priorKnowledgeDistribution.reduce((sum, item) => sum + item.count, 0)
  if (total === 0) return null

  return (
    <div className="space-y-2 rounded-lg border border-mistSkyBlue/25 bg-foamWhite/40 px-3 py-2.5">
      <p className="text-[0.7rem] font-medium text-secondary">선수 지식</p>
      <div className="flex h-1.5 overflow-hidden rounded-full bg-mistSkyBlue/20">
        {stats.priorKnowledgeDistribution
          .filter((item) => item.count > 0)
          .map((item) => (
            <div
              key={item.level}
              className="h-full"
              style={{
                width: `${(item.count / total) * 100}%`,
                backgroundColor: item.color,
              }}
            />
          ))}
      </div>
      <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-[0.65rem] text-deepOceanNavy/80">
        {stats.priorKnowledgeDistribution.map((item) => (
          <span key={item.level} className="inline-flex items-center gap-1">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            {item.level} {item.count}
          </span>
        ))}
      </div>
    </div>
  )
}

function MetricGroupSummary({
  groupKey,
  title,
  labels,
  stats,
  expanded,
  onToggle,
}: {
  groupKey: MetricGroupKey
  title: string
  labels: readonly string[]
  stats: VerifiedReviewStatistics
  expanded: boolean
  onToggle: (key: MetricGroupKey) => void
}) {
  const average = averageMetricLabels(stats, [...labels])

  return (
    <div className="rounded-lg border border-mistSkyBlue/25 bg-foamWhite/40 px-3 py-2.5">
      <button
        type="button"
        aria-expanded={expanded}
        aria-label={expanded ? `${title} 상세 접기` : `${title} 상세 펼치기`}
        onClick={() => onToggle(groupKey)}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="flex min-w-0 items-center gap-1.5">
          <p className="text-sm font-medium text-secondary">{title}</p>
          <svg
            className={`h-3.5 w-3.5 shrink-0 text-waterlineBlue transition-transform ${expanded ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 10l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <p className="shrink-0 text-sm font-bold tabular-nums text-deepOceanNavy">{average.toFixed(1)}</p>
      </button>
      {expanded ? (
        <ul className="mt-2 space-y-1 border-t border-mistSkyBlue/20 pt-2">
          {labels.map((label) => (
            <li key={label} className="flex items-center justify-between gap-2 text-[0.7rem] text-deepOceanNavy/75">
              <span>{label}</span>
              <span className="font-semibold tabular-nums">{getMetricValue(stats, label).toFixed(1)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

function PriorKnowledgeRatio({ stats }: { stats: VerifiedReviewStatistics }) {
  const items = stats.priorKnowledgeDistribution
  const total = items.reduce((sum, item) => sum + item.count, 0)
  if (total === 0) return null

  return (
    <div className="rounded-md border border-mistSkyBlue/25 bg-foamWhite/40 px-2 py-1.5">
      <p className="text-xs font-medium text-secondary">선수지식</p>
      <ul className="mt-1 space-y-0.5">
        {items.map((item) => (
          <li key={item.level} className="flex items-center justify-between gap-1 text-[10px] text-deepOceanNavy/85">
            <span className="inline-flex min-w-0 items-center gap-1">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              <span>{item.level}</span>
            </span>
            <span className="shrink-0 font-bold tabular-nums text-deepOceanNavy">{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CompareStatsCellMobile({ stats }: { stats: VerifiedReviewStatistics }) {
  const hasReviews = stats.reviewCount > 0

  return (
    <div className="flex h-full w-full min-w-0 flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2 rounded-md border border-mistSkyBlue/35 bg-foamWhite/60 px-2 py-1.5">
        <span className="text-xs font-bold text-deepOceanNavy">인증 {stats.reviewCount}건</span>
        <span className="text-xs font-bold leading-none text-waterlineBlue md:text-sm">
          {hasReviews ? stats.averageRating.toFixed(1) : '-'}
        </span>
      </div>
      {hasReviews ? (
        <div className="space-y-1">
          <PriorKnowledgeRatio stats={stats} />
          {METRIC_GROUP_KEYS.map((groupKey) => {
            const { title, labels } = METRIC_GROUP_CONFIG[groupKey]
            const average = averageMetricLabels(stats, [...labels])
            return (
              <div
                key={groupKey}
                className="flex items-center justify-between gap-1 rounded-md border border-mistSkyBlue/20 bg-foamWhite/30 px-2 py-1"
              >
                <span className="text-xs font-medium text-secondary">{title}</span>
                <span className="text-[10px] font-bold tabular-nums text-deepOceanNavy md:text-xs">{average.toFixed(1)}</span>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="flex flex-1 items-center justify-center py-2 text-center text-[10px] text-secondary">
          인증 후기 없음
        </p>
      )}
    </div>
  )
}

function CompareStatsCell({
  stats,
  expandedMetricGroups,
  onToggleMetricGroup,
}: {
  stats: VerifiedReviewStatistics
  expandedMetricGroups: Set<MetricGroupKey>
  onToggleMetricGroup: (key: MetricGroupKey) => void
}) {
  const hasReviews = stats.reviewCount > 0
  const priorKnowledgeTotal = stats.priorKnowledgeDistribution.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="flex h-full w-full flex-col gap-3">
      <div className="md:hidden">
        <CompareStatsCellMobile stats={stats} />
      </div>
      <div className="hidden md:flex md:flex-col md:gap-3">
      <div className="flex items-center justify-between gap-3 rounded-lg border border-mistSkyBlue/35 bg-foamWhite/60 px-3 py-2.5">
        <p className="text-lg font-bold text-deepOceanNavy">{stats.reviewCount}건</p>
        <p className="text-2xl font-bold leading-none text-waterlineBlue">
          {hasReviews ? stats.averageRating.toFixed(1) : '-'}
        </p>
      </div>
      {hasReviews ? (
        <div className="space-y-2">
          {priorKnowledgeTotal > 0 ? <PriorKnowledgeSummary stats={stats} /> : null}
          {METRIC_GROUP_KEYS.map((groupKey) => {
            const { title, labels } = METRIC_GROUP_CONFIG[groupKey]
            return (
              <MetricGroupSummary
                key={groupKey}
                groupKey={groupKey}
                title={title}
                labels={labels}
                stats={stats}
                expanded={expandedMetricGroups.has(groupKey)}
                onToggle={onToggleMetricGroup}
              />
            )
          })}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center px-2 py-6 text-center">
          <p className="text-sm text-secondary">인증 후기가 없습니다</p>
        </div>
      )}
      </div>
    </div>
  )
}

export default function CourseCompareTable({ courses, statsByColumn, layout }: CourseCompareTableProps) {
  const sections = groupCompareRows(COMPARE_TABLE_ROWS)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(() => new Set())
  const [expandedMetricGroups, setExpandedMetricGroups] = useState<Set<MetricGroupKey>>(() => new Set())

  const toggleRow = (rowKey: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(rowKey)) next.delete(rowKey)
      else next.add(rowKey)
      return next
    })
  }

  const toggleMetricGroup = (key: MetricGroupKey) => {
    setExpandedMetricGroups((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <section className={layout.containerClassName}>
      <div className="space-y-10">
        {sections.map((section) => {
          const contentField = section.contentOnly ? section.fields[0] : null
          const isExpanded = expandedRows.has(section.label)
          const sectionExpandable =
            contentField != null &&
            courses.some((course) => isExpandableContent(contentField.getValue(course)))

          return (
          <div key={section.label}>
            <div className="mb-2 flex items-center gap-2 px-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-mistSkyBlue/40 bg-white/30 px-4 py-1.5 shadow-[0_4px_16px_rgba(52,74,100,0.10)] backdrop-blur-md">
                <CompareSectionIcon label={section.label} />
                <h3 className="text-sm font-bold tracking-tight text-deepOceanNavy">{section.label}</h3>
              </div>
              {section.includeStats ? (
                <CompareStatsInfoTooltip text="표기된 평점은 모두 5점 만점을 기준으로 표기된 수치값입니다." />
              ) : null}
            </div>
            <div className="overflow-hidden rounded-2xl glass-panel shadow-[0_2px_12px_rgba(52,74,100,0.06)]">

            <div className="divide-y divide-mistSkyBlue/25">
            {section.contentOnly && contentField ? (
              <>
              <div
                className={`${COMPARE_RESPONSIVE_GRID_CLASS} items-stretch`}
                style={getCompareGridVars(layout)}
              >
                <div className="bg-foamWhite/50 px-1 py-3 md:px-3.5 md:py-5" aria-hidden="true" />
                {courses.map((course) => (
                  <div
                    key={`${section.label}-${course.courseSessionId ?? course.id}`}
                    className="flex min-w-0 items-start justify-center border-l border-mistSkyBlue/30 bg-transparent px-1.5 py-3 md:px-4 md:py-5"
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
                  className={`${COMPARE_RESPONSIVE_GRID_CLASS} items-stretch`}
                  style={getCompareGridVars(layout)}
                >
                  <div className="flex items-center justify-center bg-foamWhite/50 px-1.5 py-3 text-xs font-semibold leading-snug text-secondary md:px-3.5 md:py-5 md:text-sm">
                    <span className="break-words text-center">{field.label}</span>
                  </div>
                  {courses.map((course) => (
                    <div
                      key={`${section.label}-${field.label}-${course.courseSessionId ?? course.id}`}
                      className="flex min-w-0 items-center justify-center border-l border-mistSkyBlue/30 bg-transparent px-1 py-3 text-center md:px-4 md:py-5"
                    >
                      <p className="w-full break-words px-0.5 text-[10px] font-semibold leading-snug text-deepOceanNavy md:px-1 md:text-sm md:leading-relaxed">
                        {field.getValue(course)}
                      </p>
                    </div>
                  ))}
                </div>
              ))}

              {section.includeStats ? (
                <div
                  className={`${COMPARE_RESPONSIVE_GRID_CLASS} items-stretch bg-foamWhite/35`}
                  style={getCompareGridVars(layout)}
                >
                  <div className="bg-foamWhite/50 px-1 py-2 md:px-3.5 md:py-4" aria-hidden="true" />
                  {statsByColumn.map((stats, index) => (
                    <div
                      key={`stats-${courses[index]?.courseSessionId ?? courses[index]?.id ?? index}`}
                      className="flex h-full min-w-0 border-l border-mistSkyBlue/30 bg-transparent px-1 py-2 md:px-5 md:py-4"
                    >
                      <CompareStatsCell
                        stats={stats}
                        expandedMetricGroups={expandedMetricGroups}
                        onToggleMetricGroup={toggleMetricGroup}
                      />
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

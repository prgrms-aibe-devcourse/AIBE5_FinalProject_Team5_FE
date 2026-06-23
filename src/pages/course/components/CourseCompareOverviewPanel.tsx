// 과정 비교 요약 패널
import type { CSSProperties, ReactNode } from 'react'
import type { CourseDetail } from '../../../services/course.ts'
import { isMissingDisplayValue } from '../../../services/course.ts'
import type { CompareLayoutConfig } from './compareLayout.ts'
import { CompareSectionIcon } from './compareSectionIcons.tsx'

interface CourseCompareOverviewPanelProps {
  courses: CourseDetail[]
  layout: CompareLayoutConfig
}

const FILL_GRADIENT_ID = 'compare-overview-fill-gradient'

function getMetricSizes(columnCount: 2 | 3) {
  return columnCount === 2
    ? { gauge: 112, barHeight: 'h-40', barWidth: 'w-[4.75rem]', slotMinHeight: '10rem' }
    : { gauge: 100, barHeight: 'h-36', barWidth: 'w-16', slotMinHeight: '9rem' }
}

function MetricTrackShell({
  children,
  className,
  style,
}: {
  children: ReactNode
  className: string
  style?: CSSProperties
}) {
  return (
    <div
      className={`relative overflow-hidden bg-mistSkyBlue/22 shadow-[inset_0_2px_4px_rgba(52,74,100,0.08)] ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="group/info relative inline-flex">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-sm text-waterlineBlue/80 transition-colors hover:text-waterlineBlue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-waterlineBlue/30"
        aria-label="안내 보기"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

function MetricSlot({
  label,
  minHeight,
  children,
}: {
  label: string
  minHeight: string
  children: ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center px-2 py-2 sm:px-3">
      <div className="flex w-full items-center justify-center" style={{ minHeight }}>
        {children}
      </div>
      <span className="mt-2 text-[0.6875rem] font-semibold tracking-wide text-softAquaBlue">{label}</span>
    </div>
  )
}

function MissingValue({ size, roundedClass }: { size: number; roundedClass: string }) {
  return (
    <MetricTrackShell
      className={`flex items-center justify-center ${roundedClass}`}
      style={{ width: size, height: size }}
    >
      <span className="text-lg font-semibold text-mistSkyBlue/65">-</span>
    </MetricTrackShell>
  )
}

function CircularGauge({ value, max, size }: { value: number; max: number; size: number }) {
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const ratio = Math.min(Math.max(value / max, 0), 1)
  const offset = circumference * (1 - ratio)

  return (
    <MetricTrackShell
      className="flex items-center justify-center rounded-full"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 -rotate-90"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={FILL_GRADIENT_ID} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#5484B7" />
            <stop offset="100%" stopColor="#8BB4D2" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(187, 211, 224, 0.55)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${FILL_GRADIENT_ID})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <span className="relative flex items-baseline gap-0.5">
        <span className="text-base font-extrabold leading-none tabular-nums tracking-tight text-deepOceanNavy">
          {value.toFixed(1)}
        </span>
        <span className="text-[0.625rem] font-medium leading-none text-secondary">/{max}</span>
      </span>
    </MetricTrackShell>
  )
}

function EmploymentBar({
  percent,
  displayValue,
  barHeightClass,
  barWidthClass,
  empty = false,
}: {
  percent?: number
  displayValue?: string
  barHeightClass: string
  barWidthClass: string
  empty?: boolean
}) {
  const fillPercent = empty ? 0 : Math.min(percent ?? 0, 100)
  const valueOnFill = fillPercent > 48

  return (
    <MetricTrackShell className={`flex items-end rounded-t-xl ${barHeightClass} ${barWidthClass}`}>
      {!empty ? (
        <div
          className="relative w-full rounded-t-xl bg-gradient-to-t from-waterlineBlue to-softAquaBlue transition-[height] duration-500 ease-out"
          style={{ height: `${fillPercent}%` }}
        >
          <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/50" aria-hidden="true" />
        </div>
      ) : null}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {empty ? (
          <span className="text-lg font-semibold text-mistSkyBlue/65">-</span>
        ) : (
          <span
            className={`text-base font-extrabold leading-none tabular-nums tracking-tight ${
              valueOnFill ? 'text-white drop-shadow-[0_1px_2px_rgba(52,74,100,0.35)]' : 'text-deepOceanNavy'
            }`}
          >
            {displayValue}
          </span>
        )}
      </div>
    </MetricTrackShell>
  )
}

function CombinedMetricCell({
  satisfaction,
  employmentPercent,
  employmentDisplay,
  columnCount,
}: {
  satisfaction: number | null | undefined
  employmentPercent: number | null
  employmentDisplay: string
  columnCount: 2 | 3
}) {
  const sizes = getMetricSizes(columnCount)

  return (
    <div className="grid h-full w-full grid-cols-2 divide-x divide-mistSkyBlue/20">
      <MetricSlot label="만족도" minHeight={sizes.slotMinHeight}>
        {satisfaction != null ? (
          <CircularGauge value={satisfaction} max={5} size={sizes.gauge} />
        ) : (
          <MissingValue size={sizes.gauge} roundedClass="rounded-full" />
        )}
      </MetricSlot>

      <MetricSlot label="취업률" minHeight={sizes.slotMinHeight}>
        <EmploymentBar
          percent={employmentPercent ?? undefined}
          displayValue={employmentDisplay}
          barHeightClass={sizes.barHeight}
          barWidthClass={sizes.barWidth}
          empty={employmentPercent == null}
        />
      </MetricSlot>
    </div>
  )
}

function parseEmploymentPercent(value: string): number | null {
  if (isMissingDisplayValue(value)) return null
  const parsed = parseFloat(value.replace(/[^\d.]/g, ''))
  return Number.isFinite(parsed) ? parsed : null
}

export default function CourseCompareOverviewPanel({ courses, layout }: CourseCompareOverviewPanelProps) {
  const employmentValues = courses.map((course) => parseEmploymentPercent(course.employmentRate))

  return (
    <section className={layout.containerClassName}>
      <div className="mb-2 flex items-center gap-2 px-1">
        <div className="inline-flex items-center gap-2 rounded-full border border-mistSkyBlue/40 bg-white/30 px-4 py-1.5 shadow-[0_4px_16px_rgba(52,74,100,0.10)] backdrop-blur-md">
          <CompareSectionIcon label="수치 요약" />
          <h3 className="text-sm font-bold tracking-tight text-deepOceanNavy">수치 요약</h3>
        </div>
        <InfoTooltip text="만족도는 5점 만점, 취업률은 백분율 기준으로 표시됩니다." />
      </div>

      <div className="overflow-hidden rounded-2xl glass-panel shadow-[0_2px_12px_rgba(52,74,100,0.06)]">
        <div
          className="grid items-stretch"
          style={{ gridTemplateColumns: layout.gridTemplateColumns }}
        >
          <div className="bg-foamWhite/50 px-3 py-8 md:px-3.5" aria-hidden="true" />
          {courses.map((course, index) => (
            <div
              key={course.courseSessionId ?? course.id}
              className="flex h-full items-start justify-center border-l border-mistSkyBlue/30 bg-transparent px-3 py-7 md:px-5 md:py-8"
            >
              <CombinedMetricCell
                satisfaction={course.satisfactionOutOf5}
                employmentPercent={employmentValues[index]}
                employmentDisplay={course.employmentRate}
                columnCount={layout.columnCount}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

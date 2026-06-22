import type { ReactNode } from 'react'
import { Star, ThumbsUp } from 'lucide-react'
import type { Course } from '../data/courses'

const iconClass = 'shrink-0 text-softAquaBlue'

const badgeShellClass =
  'inline-flex h-[18px] shrink-0 items-center gap-[3px] rounded-full px-1.5 font-pretendard text-[10px] font-semibold leading-none'
const badgeIconClass = 'size-[10px] shrink-0 flex-none'

export function LocationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function PriceIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function EnrollmentIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden="true">
      <path
        d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export const BOOKMARKS_LIST_GRID_CLASS =
  'md:grid-cols-[minmax(0,2fr)_minmax(72px,80px)_minmax(100px,112px)_minmax(240px,1.5fr)_minmax(92px,100px)]'

type CourseRatingBadgeProps = {
  rating: string
  className?: string
  variant?: 'rating' | 'satisfaction'
}

export function CourseRatingBadge({
  rating,
  className = '',
  variant = 'rating',
}: CourseRatingBadgeProps) {
  const unavailable = rating === '-'
  const Icon = variant === 'satisfaction' ? ThumbsUp : Star
  const toneClass = unavailable
    ? 'bg-mistSkyBlue/20 font-medium text-secondary'
    : 'bg-waterlineBlue/12 text-waterlineBlue'

  return (
    <span className={`${badgeShellClass} ${toneClass} ${className}`}>
      <span className="flex size-[11px] shrink-0 items-center justify-center">
        <Icon className={badgeIconClass} strokeWidth={2} aria-hidden="true" />
      </span>
      <span className="tabular-nums">{rating}</span>
    </span>
  )
}

type CourseTitleBlockProps = {
  course: Course
  scoreVariant?: 'rating' | 'satisfaction'
}

export function CourseTitleBlock({ course, scoreVariant = 'rating' }: CourseTitleBlockProps) {
  return (
    <div className="min-w-0 flex-1">
      <p className="line-clamp-2 font-pretendard text-sm font-semibold leading-snug text-deepOceanNavy">
        {course.title}
      </p>
      <div className="mt-1.5 flex flex-wrap items-center gap-2 font-pretendard text-xs">
        <span className="text-secondary">{course.academy}</span>
        <CourseRatingBadge rating={course.rating} variant={scoreVariant} />
      </div>
    </div>
  )
}

type CourseMetaFieldProps = {
  label: string
  icon: ReactNode
  children: ReactNode
  className?: string
}

export function CourseMetaField({ label, icon, children, className = '' }: CourseMetaFieldProps) {
  return (
    <div className={`min-w-0 ${className}`}>
      <p className="mb-1 font-pretendard text-[11px] font-medium text-secondary">{label}</p>
      <CourseMetaInline icon={icon} nowrap className="text-xs">
        {children}
      </CourseMetaInline>
    </div>
  )
}

type CourseMetaInlineProps = {
  icon: ReactNode
  children: ReactNode
  className?: string
  nowrap?: boolean
}

export function CourseMetaInline({ icon, children, className = '', nowrap = false }: CourseMetaInlineProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-pretendard text-sm text-primary/90 ${nowrap ? 'whitespace-nowrap' : ''} ${className}`}
    >
      {icon}
      {children}
    </span>
  )
}

export function CourseMetaItems({ course }: { course: Course }) {
  return (
    <>
      <CourseMetaInline icon={<LocationIcon />} nowrap>
        {course.region}
      </CourseMetaInline>
      <CourseMetaInline icon={<PriceIcon />} nowrap>
        {course.subsidy}
      </CourseMetaInline>
      <CourseMetaInline icon={<CalendarIcon />} nowrap>
        {course.period}
      </CourseMetaInline>
      <CourseMetaInline icon={<EnrollmentIcon />} nowrap>
        {course.enrollment ?? '32/50'}
      </CourseMetaInline>
    </>
  )
}

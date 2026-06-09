import type { KeyboardEvent } from 'react'
import type { Course } from '../data/courses'
import {
  CalendarIcon,
  CourseMetaInline,
  CourseTitleBlock,
  EnrollmentIcon,
  LocationIcon,
  PriceIcon,
} from './CourseListMeta'

type FavoriteCourseRowCardProps = {
  course: Course
  isInCompare: boolean
  canAddToCompare: boolean
  isBookmarked: boolean
  onToggleCompare: () => void
  onToggleBookmark: () => void
  onOpenDetail?: () => void
}

function CompareButton({
  isInCompare,
  canAddToCompare,
  onToggleCompare,
}: {
  isInCompare: boolean
  canAddToCompare: boolean
  onToggleCompare: () => void
}) {
  return (
    <button
      type="button"
      aria-label={isInCompare ? '비교 목록에서 제거' : '비교 목록에 추가'}
      disabled={!isInCompare && !canAddToCompare}
      onClick={(event) => {
        event.stopPropagation()
        onToggleCompare()
      }}
      className={`flex h-8 w-8 items-center justify-center rounded-full border bg-white text-base leading-none shadow-sm transition-colors ${
        isInCompare
          ? 'border-waterlineBlue text-waterlineBlue'
          : 'border-mistSkyBlue text-deepOceanNavy hover:border-waterlineBlue disabled:cursor-not-allowed disabled:opacity-40'
      }`}
    >
      {isInCompare ? '✓' : '+'}
    </button>
  )
}

function BookmarkButton({ isBookmarked, onToggleBookmark }: { isBookmarked: boolean; onToggleBookmark: () => void }) {
  return (
    <button
      type="button"
      aria-label={isBookmarked ? '찜 해제' : '찜하기'}
      onClick={(event) => {
        event.stopPropagation()
        onToggleBookmark()
      }}
      className={`flex h-8 w-8 items-center justify-center rounded-full border bg-white shadow-sm transition-colors ${
        isBookmarked
          ? 'border-waterlineBlue text-waterlineBlue'
          : 'border-mistSkyBlue text-softAquaBlue hover:border-waterlineBlue hover:text-waterlineBlue'
      }`}
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} aria-hidden="true">
        <path d="M6 4h12v16l-6-4-6 4V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

function ActionButtons({
  isInCompare,
  canAddToCompare,
  isBookmarked,
  onToggleCompare,
  onToggleBookmark,
}: {
  isInCompare: boolean
  canAddToCompare: boolean
  isBookmarked: boolean
  onToggleCompare: () => void
  onToggleBookmark: () => void
}) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <CompareButton
        isInCompare={isInCompare}
        canAddToCompare={canAddToCompare}
        onToggleCompare={onToggleCompare}
      />
      <BookmarkButton isBookmarked={isBookmarked} onToggleBookmark={onToggleBookmark} />
    </div>
  )
}

export default function FavoriteCourseRowCard({
  course,
  isInCompare,
  canAddToCompare,
  isBookmarked,
  onToggleCompare,
  onToggleBookmark,
  onOpenDetail,
}: FavoriteCourseRowCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!onOpenDetail) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpenDetail()
    }
  }

  const interactiveClass = onOpenDetail
    ? 'cursor-pointer hover:border-waterlineBlue/35 hover:bg-foamWhite/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-waterlineBlue/50'
    : ''

  return (
    <article
      role={onOpenDetail ? 'button' : undefined}
      tabIndex={onOpenDetail ? 0 : undefined}
      onClick={onOpenDetail}
      onKeyDown={handleKeyDown}
      className={`relative rounded-xl border border-mistSkyBlue/45 bg-white p-4 shadow-[0_1px_4px_rgba(52,74,100,0.05)] transition-colors font-pretendard sm:p-5 ${interactiveClass}`}
    >
      <div className="absolute right-4 top-4 z-10 sm:right-5 sm:top-5">
        <ActionButtons
          isInCompare={isInCompare}
          canAddToCompare={canAddToCompare}
          isBookmarked={isBookmarked}
          onToggleCompare={onToggleCompare}
          onToggleBookmark={onToggleBookmark}
        />
      </div>

      <div className="flex items-start gap-3 pr-[4.75rem] sm:gap-4 sm:pr-[5.25rem]">
        <div className="relative aspect-[5/4] h-[4rem] shrink-0 overflow-hidden rounded-lg bg-foamWhite ring-1 ring-mistSkyBlue/40 sm:h-[5rem]">
          {course.logoUrl ? (
            <img src={course.logoUrl} alt="" className="h-full w-full object-cover" />
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <CourseTitleBlock course={course} />

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t border-mistSkyBlue/25 pt-3 sm:gap-x-5">
            <CourseMetaInline icon={<LocationIcon />} nowrap className="text-xs sm:text-sm">
              {course.region}
            </CourseMetaInline>
            <CourseMetaInline icon={<PriceIcon />} nowrap className="text-xs sm:text-sm">
              {course.subsidy}
            </CourseMetaInline>
            <CourseMetaInline icon={<CalendarIcon />} nowrap className="text-xs sm:text-sm">
              {course.period}
            </CourseMetaInline>
            <CourseMetaInline icon={<EnrollmentIcon />} nowrap className="text-xs sm:text-sm">
              {course.enrollment ?? '32/50'}
            </CourseMetaInline>
          </div>
        </div>
      </div>
    </article>
  )
}

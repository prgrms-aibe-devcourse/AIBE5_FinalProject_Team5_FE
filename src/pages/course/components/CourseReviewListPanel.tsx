import { useEffect, useLayoutEffect, useRef, useState, type Ref } from 'react'
import Pagination from '../../../components/common/Pagination.tsx'
import {
  getCourseReviews,
  getCrawledReviews,
  type CourseReview,
  type CourseReviewVerifiedDetail,
  type CrawledReview,
} from '../../../services/review.ts'
import { toAbsoluteUrl } from '../../../utils/toAbsoluteUrl.ts'

const ITEMS_PER_PAGE = 5

type ReviewSource = 'site' | 'goyo24'
type SiteFilter = 'all' | 'general' | 'verified'

const REVIEW_SOURCE_TABS: { id: ReviewSource; label: string; description: string }[] = [
  { id: 'site', label: '부트시그널', description: '부트시그널 회원이 작성한 후기' },
  { id: 'goyo24', label: '고용 24', description: '고용 24에서 수집한 후기' },
]

interface CourseReviewListPanelProps {
  courseId: number
  refreshKey?: number
  onClickWriteReview?: () => void
  listSectionRef?: Ref<HTMLDivElement>
}

function ReviewIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 8h10M7 12h6m-6 9l-3-3V5a2 2 0 012-2h12a2 2 0 012 2v11a2 2 0 01-2 2H9l-2 3z"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ReviewSourceTabs({
  activeSource,
  onSourceChange,
}: {
  activeSource: ReviewSource
  onSourceChange: (source: ReviewSource) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLButtonElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const el = activeRef.current
    const container = containerRef.current
    if (!el || !container) return

    const containerRect = container.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    setIndicatorStyle({
      left: elRect.left - containerRect.left,
      width: elRect.width,
    })
  }, [activeSource])

  return (
    <div role="tablist" aria-label="후기 출처" className="w-full">
      <div
        ref={containerRef}
        className="relative grid grid-cols-2 gap-1 rounded-2xl border border-mistSkyBlue/40 bg-white/40 p-1.5 shadow-[0_4px_20px_rgba(52,74,100,0.10)] backdrop-blur-md"
      >
        <span
          className="pointer-events-none absolute top-1.5 h-[calc(100%-0.75rem)] rounded-xl bg-deepOceanNavy shadow-[0_2px_8px_rgba(52,74,100,0.22)] transition-all duration-200 ease-out"
          style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          aria-hidden="true"
        />

        {REVIEW_SOURCE_TABS.map(({ id, label, description }) => {
          const isActive = activeSource === id

          return (
            <button
              key={id}
              ref={isActive ? activeRef : null}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={description}
              title={description}
              onClick={() => onSourceChange(id)}
              className={`relative z-10 flex min-w-0 items-center justify-center rounded-xl px-2 py-2.5 transition-colors duration-150 sm:px-4 sm:py-3 ${
                isActive ? 'text-white' : 'text-deepOceanNavy/60 hover:text-deepOceanNavy'
              }`}
            >
              <span className="truncate text-[0.82rem] font-semibold sm:text-sm">{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

const SITE_FILTERS: { key: SiteFilter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'general', label: '일반 후기' },
  { key: 'verified', label: '인증 후기' },
]

function SiteReviewFilterTabs({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: SiteFilter
  onFilterChange: (filter: SiteFilter) => void
}) {
  return (
    <div
      role="tablist"
      aria-label="후기 유형"
      className="inline-flex flex-wrap items-end gap-x-4 gap-y-1 border-b border-mistSkyBlue/25"
    >
      {SITE_FILTERS.map(({ key, label }) => {
        const isActive = activeFilter === key

        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onFilterChange(key)}
            className={`relative -mb-px inline-flex items-center border-b-2 pb-2.5 pt-1 text-sm transition-colors ${
              isActive
                ? 'border-waterlineBlue font-semibold text-waterlineBlue'
                : 'border-transparent font-medium text-secondary hover:text-deepOceanNavy'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

function ReviewUserAvatar({ nickname, imageUrl }: { nickname: string; imageUrl: string | null }) {
  const resolvedUrl = imageUrl ? toAbsoluteUrl(imageUrl) : null
  const initial = nickname.trim().charAt(0).toUpperCase() || '?'

  if (resolvedUrl) {
    return (
      <img
        src={resolvedUrl}
        alt={`${nickname} 프로필`}
        className="h-14 w-14 shrink-0 rounded-full border border-mistSkyBlue/35 object-cover ring-2 ring-white"
      />
    )
  }

  return (
    <span
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-mistSkyBlue/35 bg-gradient-to-br from-mistSkyBlue/70 to-softAquaBlue/70 text-lg font-bold text-white ring-2 ring-white"
      aria-hidden="true"
    >
      {initial}
    </span>
  )
}

function StarRating({
  value,
  max = 5,
  size = 'md',
}: {
  value: number
  max?: number
  size?: 'sm' | 'md'
}) {
  const clamped = Math.max(0, Math.min(max, value))
  const starClass = size === 'sm' ? 'text-[0.95rem]' : 'text-base'

  return (
    <div
      className="inline-flex items-center gap-px"
      role="img"
      aria-label={`별점 ${clamped}점 / ${max}점`}
    >
      {Array.from({ length: max }, (_, index) => {
        const filled = clamped - index
        if (filled >= 1) {
          return (
            <span key={index} className={`leading-none text-amber-400 ${starClass}`} aria-hidden="true">
              ★
            </span>
          )
        }
        if (filled >= 0.5) {
          return (
            <span key={index} className={`relative leading-none ${starClass}`} aria-hidden="true">
              <span className="text-mistSkyBlue/30">★</span>
              <span className="absolute inset-0 w-1/2 overflow-hidden text-amber-400">★</span>
            </span>
          )
        }
        return (
          <span key={index} className={`leading-none text-mistSkyBlue/30 ${starClass}`} aria-hidden="true">
            ★
          </span>
        )
      })}
    </div>
  )
}

function VerifiedBadge() {
  return (
    <span
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-waterlineBlue/25 bg-waterlineBlue/10 text-waterlineBlue"
      title="인증 후기"
      aria-label="인증 후기"
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 1.25 2.75 3.5v4.25c0 3.35 2.28 6.38 5.25 7 2.97-.62 5.25-3.65 5.25-7V3.5L8 1.25z"
          fill="currentColor"
          fillOpacity="0.18"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
        <path
          d="M5.25 8.1 7 9.85 10.75 6"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

function DetailChip({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1 rounded-md border border-mistSkyBlue/30 bg-foamWhite/60 px-2 py-1 text-[0.82rem] leading-snug">
      <span className="shrink-0 text-secondary">{label}</span>
      <span className="font-semibold text-deepOceanNavy">{value}</span>
    </span>
  )
}

function VerifiedDetailSectionRow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2 border-b border-mistSkyBlue/25 py-2.5 last:border-b-0 last:pb-0 sm:flex-row sm:items-start sm:gap-4">
      <h4 className="w-18 shrink-0 text-xs font-bold leading-snug text-deepOceanNavy sm:pt-1">{title}</h4>
      <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">{children}</div>
    </section>
  )
}

function formatDropoutReason(major?: string, sub?: string) {
  if (!major && !sub) return '-'
  if (!sub) return major ?? '-'
  if (!major) return sub
  return `${major}>${sub}`
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''

  const dateOnly = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (dateOnly) {
    return `${dateOnly[1]}.${dateOnly[2]}.${dateOnly[3]}`
  }

  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

function formatReviewedAt(dateStr: string | null | undefined): string {
  return formatDate(dateStr) || '-'
}

function VerifiedReviewDetailPanel({ detail }: { detail: CourseReviewVerifiedDetail }) {
  return (
    <div className="mt-3 rounded-xl border border-mistSkyBlue/40 bg-white px-3.5 py-2 shadow-[0_1px_4px_rgba(52,74,100,0.05)] md:px-4">
      <VerifiedDetailSectionRow title="기본 정보">
        <DetailChip label="선수 지식" value={detail.priorKnowledgeLevel} />
        <DetailChip label="연령" value={`${detail.age}세`} />
        <DetailChip label="목적" value={detail.learningGoal} />
        <DetailChip label="형태" value={detail.attendanceType} />
        <DetailChip label="기수" value={`${detail.cohort}기`} />
      </VerifiedDetailSectionRow>
      <VerifiedDetailSectionRow title="수료 정보">
        <DetailChip label="수료 여부" value={detail.completionStatus} />
        {detail.completionStatus === '수료' && detail.employmentStatusIn6Months ? (
          <DetailChip label="6개월 취업" value={detail.employmentStatusIn6Months} />
        ) : null}
        {detail.completionStatus === '중도 포기' ? (
          <DetailChip label="포기 사유" value={formatDropoutReason(detail.dropoutMajorReason ?? undefined, detail.dropoutSubReason ?? undefined)} />
        ) : null}
      </VerifiedDetailSectionRow>
      <VerifiedDetailSectionRow title="과정 난이도">
        <DetailChip label="난이도" value={detail.courseDifficulty} />
        <DetailChip label="진도" value={detail.progressSpeed} />
        <DetailChip label="팀플" value={detail.teamProjectDifficulty} />
        <DetailChip label="자습" value={`${detail.avgSelfStudyHours}시간`} />
      </VerifiedDetailSectionRow>
      <VerifiedDetailSectionRow title="과정 품질">
        <DetailChip label="강사" value={<StarRating value={detail.instructorDeliveryRating} size="sm" />} />
        <DetailChip label="커리큘럼" value={<StarRating value={detail.curriculumRating} size="sm" />} />
        <DetailChip label="취업 지원" value={<StarRating value={detail.employmentSupportSatisfactionRating} size="sm" />} />
      </VerifiedDetailSectionRow>
      <VerifiedDetailSectionRow title="프로젝트">
        <DetailChip label="프로젝트" value={`${detail.projectCount}개`} />
        <DetailChip label="성취도" value={<StarRating value={detail.projectAchievementRating} size="sm" />} />
        <DetailChip label="툴지원" value={<StarRating value={detail.toolSupportRating} size="sm" />} />
        <DetailChip label="멘토링" value={<StarRating value={detail.mentoringSatisfactionRating} size="sm" />} />
      </VerifiedDetailSectionRow>
    </div>
  )
}

function CrawledReviewCard({ review }: { review: CrawledReview }) {
  return (
    <article className="rounded-xl border border-mistSkyBlue/30 bg-foamWhite/35 p-4 md:p-5">
      <div className="flex items-center gap-2">
        <p className="truncate text-[0.95rem] font-semibold text-deepOceanNavy">{review.reviewerNickname ?? '익명'}</p>
        <span className="inline-flex shrink-0 items-center rounded-full bg-[#1A6DFF]/10 px-2 py-0.5 text-[0.7rem] font-semibold text-[#1A6DFF]">
          고용 24
        </span>
      </div>
      {review.rating !== null ? (
        <div className="mt-1.5">
          <StarRating value={review.rating} size="sm" />
        </div>
      ) : null}
      {review.content ? (
        <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-deepOceanNavy/85 md:text-base">{review.content}</p>
      ) : null}
    </article>
  )
}

const isVerifiedReview = (review: CourseReview) =>
  review.reviewType === 'VERIFIED' && review.verifiedDetail != null

function SiteReviewCard({ review, expanded, onToggle }: {
  review: CourseReview
  expanded: boolean
  onToggle: () => void
}) {
  const verified = isVerifiedReview(review)

  return (
    <article className="rounded-xl border border-mistSkyBlue/30 bg-foamWhite/35 p-4 md:p-5">
      <div className="flex items-start gap-3.5">
        <ReviewUserAvatar nickname={review.userNickname} imageUrl={review.userProfileImageUrl} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-1.5">
              <p className="truncate text-[0.95rem] font-semibold text-deepOceanNavy">{review.userNickname}</p>
              {verified ? <VerifiedBadge /> : null}
            </div>
            {review.createdAt ? (
              <time
                className="shrink-0 text-xs tabular-nums text-secondary"
                dateTime={review.createdAt}
              >
                {formatReviewedAt(review.createdAt)}
              </time>
            ) : null}
          </div>

          <div className="mt-1.5">
            <StarRating value={review.rating} size="sm" />
          </div>

          <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-deepOceanNavy/85 md:text-base">{review.content}</p>

          {verified && review.verifiedDetail ? (
            <>
              {expanded ? <VerifiedReviewDetailPanel detail={review.verifiedDetail} /> : null}
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-label={expanded ? '상세 정보 접기' : '상세 정보 펼치기'}
                  onClick={onToggle}
                  className="inline-flex items-center justify-center rounded-md p-1.5 text-secondary transition-colors hover:bg-mistSkyBlue/15 hover:text-deepOceanNavy"
                >
                  <svg
                    className={`h-5 w-5 transition-transform ${expanded ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M6 10l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export default function CourseReviewListPanel({
  courseId,
  refreshKey = 0,
  onClickWriteReview,
  listSectionRef,
}: CourseReviewListPanelProps) {
  const [reviewSource, setReviewSource] = useState<ReviewSource>('site')
  const [siteFilter, setSiteFilter] = useState<SiteFilter>('all')
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)

  const [siteReviews, setSiteReviews] = useState<CourseReview[]>([])
  const [siteTotalPages, setSiteTotalPages] = useState(1)
  const [siteLoading, setSiteLoading] = useState(false)
  const [siteError, setSiteError] = useState<string | null>(null)

  const [goyoReviews, setGoyoReviews] = useState<CrawledReview[]>([])
  const [goyoTotalPages, setGoyoTotalPages] = useState(1)
  const [goyoTotalElements, setGoyoTotalElements] = useState(0)
  const [goyoLoading, setGoyoLoading] = useState(false)
  const [goyoError, setGoyoError] = useState<string | null>(null)

  useEffect(() => { setCurrentPage(1) }, [reviewSource, siteFilter, courseId])

  useEffect(() => {
    if (reviewSource !== 'site') return

    let cancelled = false
    setSiteLoading(true)
    setSiteError(null)

    const reviewType =
      siteFilter === 'general' ? 'GENERAL' as const
      : siteFilter === 'verified' ? 'VERIFIED' as const
      : undefined

    getCourseReviews(courseId, {
      reviewType,
      page: currentPage - 1,
      size: ITEMS_PER_PAGE,
    })
      .then((data) => {
        if (cancelled) return

        const apiTotalPages = data.totalPages ?? 0
        setSiteReviews(data.content ?? [])
        setSiteTotalPages(Math.max(1, apiTotalPages))

        if (apiTotalPages > 0 && currentPage > apiTotalPages) {
          setCurrentPage(apiTotalPages)
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setSiteReviews([])
        setSiteTotalPages(1)
        setSiteError(err instanceof Error ? err.message : '후기를 불러올 수 없습니다.')
      })
      .finally(() => {
        if (!cancelled) setSiteLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [courseId, reviewSource, siteFilter, currentPage, refreshKey])

  useEffect(() => {
    if (reviewSource !== 'goyo24') return

    let cancelled = false
    setGoyoLoading(true)
    setGoyoError(null)

    getCrawledReviews(courseId, currentPage - 1, ITEMS_PER_PAGE)
      .then((data) => {
        if (cancelled) return

        const apiTotalPages = data.totalPages ?? 0
        setGoyoReviews(data.content ?? [])
        setGoyoTotalElements(data.totalElements ?? 0)
        setGoyoTotalPages(Math.max(1, apiTotalPages))

        if (apiTotalPages > 0 && currentPage > apiTotalPages) {
          setCurrentPage(apiTotalPages)
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setGoyoReviews([])
        setGoyoTotalElements(0)
        setGoyoTotalPages(1)
        setGoyoError(err instanceof Error ? err.message : '후기를 불러올 수 없습니다.')
      })
      .finally(() => {
        if (!cancelled) setGoyoLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [courseId, reviewSource, currentPage])

  const toggleExpanded = (id: number) => {
    setExpandedIds((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })
  }

  const totalPages = reviewSource === 'site' ? siteTotalPages : goyoTotalPages

  return (
    <div>
      <div ref={listSectionRef} className="mb-2 scroll-mt-6 px-1">
        <div className="inline-flex items-center gap-2 rounded-full border border-mistSkyBlue/40 bg-white/30 px-4 py-1.5 shadow-[0_4px_16px_rgba(52,74,100,0.10)] backdrop-blur-md">
          <span className="flex h-6 w-6 items-center justify-center text-waterlineBlue">
            <ReviewIcon />
          </span>
          <h3 className="text-sm font-bold tracking-tight text-deepOceanNavy">후기 내역</h3>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl glass-panel shadow-[0_2px_12px_rgba(52,74,100,0.06)]">
        <div className="border-b border-mistSkyBlue/30 bg-gradient-to-r from-mistSkyBlue/20 via-softAquaBlue/10 to-waterlineBlue/10 px-4 py-3 md:px-5 md:py-4">
          <ReviewSourceTabs activeSource={reviewSource} onSourceChange={setReviewSource} />
        </div>

        <div className="p-4 md:p-5">
          {reviewSource === 'site' ? (
            <>
              <div className="flex flex-col gap-3 border-b border-mistSkyBlue/20 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <SiteReviewFilterTabs activeFilter={siteFilter} onFilterChange={setSiteFilter} />
                <button
                  type="button"
                  onClick={onClickWriteReview}
                  className="inline-flex shrink-0 items-center gap-1.5 self-end rounded-lg bg-deepOceanNavy px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-waterlineBlue sm:self-auto"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 20h4l10-10a2 2 0 10-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  작성
                </button>
              </div>
              {siteLoading ? (
                <div className="flex items-center justify-center py-16 text-sm text-secondary">불러오는 중...</div>
              ) : siteError ? (
                <div className="flex items-center justify-center py-16 text-sm text-red-400">{siteError}</div>
              ) : siteReviews.length === 0 ? (
                <div className="flex items-center justify-center py-16 text-sm text-secondary">후기가 없습니다.</div>
              ) : (
                <div className="mt-4 space-y-3">
                  {siteReviews.map((review) => (
                    <SiteReviewCard
                      key={review.reviewId}
                      review={review}
                      expanded={expandedIds.has(review.reviewId)}
                      onToggle={() => toggleExpanded(review.reviewId)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {goyoLoading ? (
                <div className="flex items-center justify-center py-16 text-sm text-secondary">불러오는 중...</div>
              ) : goyoError ? (
                <div className="flex items-center justify-center py-16 text-sm text-red-400">{goyoError}</div>
              ) : goyoReviews.length === 0 ? (
                <div className="flex items-center justify-center py-16 text-sm text-secondary">후기가 없습니다.</div>
              ) : (
                <>
                  <p className="mb-4 text-xs text-secondary">
                    총 <span className="font-semibold tabular-nums text-deepOceanNavy">{goyoTotalElements}</span>개
                  </p>
                  <div className="space-y-3">
                    {goyoReviews.map((review) => (
                      <CrawledReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
          {totalPages > 1 && (reviewSource === 'site' ? !siteLoading && !siteError : !goyoLoading && !goyoError) ? (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} className="mt-5" />
          ) : null}
        </div>
      </div>
    </div>
  )
}

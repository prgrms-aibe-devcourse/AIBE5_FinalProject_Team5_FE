import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Pagination from '../../../components/common/Pagination.tsx'
import { MOCK_REVIEWS, MOCK_VERIFIED_REVIEWS, type MockReviewItem, type MockVerifiedReviewItem, type VerifiedReviewDetail } from '../data/mockCourseReviews.ts'
import { getCrawledReviews, type CrawledReview } from '../../../services/review.ts'

const ITEMS_PER_PAGE = 5

type ReviewSource = 'site' | 'goyo24'
type SiteFilter = 'all' | 'general' | 'verified'

const REVIEW_SOURCE_TABS: { id: ReviewSource; label: string; description: string }[] = [
  { id: 'site', label: '부트시그널', description: '부트시그널 회원이 작성한 후기' },
  { id: 'goyo24', label: '고용 24', description: '고용 24에서 수집한 후기' },
]

interface CourseReviewListPanelProps {
  courseId: number
  onClickWriteReview?: () => void
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

function Stars({ count }: { count: number }) {
  return (
    <span className="text-waterlineBlue">
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
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

function VerifiedReviewDetailPanel({ detail }: { detail: VerifiedReviewDetail }) {
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
          <DetailChip label="포기 사유" value={formatDropoutReason(detail.dropoutMajorReason, detail.dropoutSubReason)} />
        ) : null}
      </VerifiedDetailSectionRow>
      <VerifiedDetailSectionRow title="과정 난이도">
        <DetailChip label="난이도" value={detail.courseDifficulty} />
        <DetailChip label="진도" value={detail.progressSpeed} />
        <DetailChip label="팀플" value={detail.teamProjectDifficulty} />
        <DetailChip label="자습" value={`${detail.avgSelfStudyHours}시간`} />
      </VerifiedDetailSectionRow>
      <VerifiedDetailSectionRow title="과정 품질">
        <DetailChip label="강사" value={<Stars count={detail.instructorDeliveryRating} />} />
        <DetailChip label="커리큘럼" value={<Stars count={detail.curriculumRating} />} />
        <DetailChip label="취업 지원" value={<Stars count={detail.employmentSupportSatisfactionRating} />} />
      </VerifiedDetailSectionRow>
      <VerifiedDetailSectionRow title="프로젝트">
        <DetailChip label="프로젝트" value={`${detail.projectCount}개`} />
        <DetailChip label="성취도" value={<Stars count={detail.projectAchievementRating} />} />
        <DetailChip label="툴지원" value={<Stars count={detail.toolSupportRating} />} />
        <DetailChip label="멘토링" value={<Stars count={detail.mentoringSatisfactionRating} />} />
      </VerifiedDetailSectionRow>
    </div>
  )
}

function CrawledReviewCard({ review }: { review: CrawledReview }) {
  return (
    <article className="rounded-xl border border-mistSkyBlue/30 bg-foamWhite/35 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-base font-semibold text-deepOceanNavy">{review.reviewerNickname ?? '익명'}</p>
        <span className="inline-flex items-center rounded-full bg-[#1A6DFF]/10 px-2 py-0.5 text-[0.7rem] font-semibold text-[#1A6DFF]">
          고용 24
        </span>
      </div>
      {review.rating !== null ? (
        <p className="mt-1 text-[0.95rem]">
          <Stars count={Math.round(review.rating)} />
        </p>
      ) : null}
      {review.content ? (
        <p className="mt-2 text-[0.95rem] leading-relaxed text-deepOceanNavy/90 md:text-base">{review.content}</p>
      ) : null}
    </article>
  )
}

const isVerified = (r: MockReviewItem): r is MockVerifiedReviewItem => 'verified' in r && (r as MockVerifiedReviewItem).verified === true

function SiteReviewCard({ review, expanded, onToggle }: {
  review: MockReviewItem
  expanded: boolean
  onToggle: () => void
}) {
  const verified = isVerified(review)
  const reviewedAt = 'reviewedAt' in review ? review.reviewedAt : null

  return (
    <article className="rounded-xl border border-mistSkyBlue/30 bg-foamWhite/35 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <p className="text-base font-semibold text-deepOceanNavy">{review.user}</p>
          {verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-waterlineBlue/15 px-2 py-0.5 text-[0.7rem] font-semibold text-waterlineBlue">
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              인증됨
            </span>
          )}
        </div>
        {reviewedAt ? (
          <time
            className="shrink-0 text-xs tabular-nums text-secondary"
            dateTime={reviewedAt}
          >
            {formatReviewedAt(reviewedAt)}
          </time>
        ) : null}
      </div>
      <p className="text-[0.95rem]"><Stars count={review.rating} /></p>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-deepOceanNavy/90 md:text-base">{review.content}</p>
      {verified && (
        <>
          {expanded && <VerifiedReviewDetailPanel detail={(review as MockVerifiedReviewItem).detail} />}
          <div className="mt-3 flex justify-end">
            <button type="button" aria-expanded={expanded} onClick={onToggle}
              className="text-secondary transition-colors hover:text-deepOceanNavy">
              {expanded ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 14l6-6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 10l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        </>
      )}
    </article>
  )
}

export default function CourseReviewListPanel({ courseId, onClickWriteReview }: CourseReviewListPanelProps) {
  const [reviewSource, setReviewSource] = useState<ReviewSource>('site')
  const [siteFilter, setSiteFilter] = useState<SiteFilter>('all')
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)

  const ALL_SITE = useMemo(() => [...MOCK_REVIEWS, ...MOCK_VERIFIED_REVIEWS], [])
  const reviewPool: MockReviewItem[] = siteFilter === 'all' ? ALL_SITE : siteFilter === 'general' ? MOCK_REVIEWS : MOCK_VERIFIED_REVIEWS
  const siteTotalPages = Math.max(1, Math.ceil(reviewPool.length / ITEMS_PER_PAGE))
  const paginatedSite = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return reviewPool.slice(start, start + ITEMS_PER_PAGE)
  }, [currentPage, reviewPool])

  const [goyoReviews, setGoyoReviews] = useState<CrawledReview[]>([])
  const [goyoTotalPages, setGoyoTotalPages] = useState(1)
  const [goyoTotalElements, setGoyoTotalElements] = useState(0)
  const [goyoLoading, setGoyoLoading] = useState(false)
  const [goyoError, setGoyoError] = useState<string | null>(null)

  useEffect(() => { setCurrentPage(1) }, [reviewSource, siteFilter, courseId])

  useEffect(() => {
    if (currentPage > siteTotalPages && reviewSource === 'site') setCurrentPage(siteTotalPages)
  }, [currentPage, siteTotalPages, reviewSource])

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

  const FILTERS: { key: SiteFilter; label: string; verified?: boolean }[] = [
    { key: 'all', label: '전체' },
    { key: 'general', label: '일반 후기' },
    { key: 'verified', label: '인증 후기', verified: true },
  ]

  return (
    <div>
      <div className="mb-2 px-1">
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
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-mistSkyBlue/20 pb-4">
                <div className="flex flex-wrap gap-1.5">
                  {FILTERS.map(({ key, label, verified }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSiteFilter(key)}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                        siteFilter === key
                          ? 'bg-deepOceanNavy text-white'
                          : 'bg-foamWhite/60 text-secondary hover:bg-mistSkyBlue/20 hover:text-deepOceanNavy'
                      }`}
                    >
                      {verified && (
                        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-secondary">
                    총 <span className="font-semibold tabular-nums text-deepOceanNavy">{reviewPool.length}</span>개
                  </p>
                  <button
                    type="button"
                    onClick={onClickWriteReview}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-deepOceanNavy px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-waterlineBlue"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M4 20h4l10-10a2 2 0 10-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    후기 작성
                  </button>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {paginatedSite.map((review) => (
                  <SiteReviewCard key={review.id} review={review}
                    expanded={expandedIds.has(review.id)} onToggle={() => toggleExpanded(review.id)} />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="border-b border-mistSkyBlue/20 pb-4">
                <p className="text-sm text-secondary">
                  총 <span className="font-semibold tabular-nums text-deepOceanNavy">{goyoTotalElements}</span>개
                </p>
              </div>
              {goyoLoading ? (
                <div className="flex items-center justify-center py-16 text-sm text-secondary">불러오는 중...</div>
              ) : goyoError ? (
                <div className="flex items-center justify-center py-16 text-sm text-red-400">{goyoError}</div>
              ) : goyoReviews.length === 0 ? (
                <div className="flex items-center justify-center py-16 text-sm text-secondary">후기가 없습니다.</div>
              ) : (
                <div className="mt-4 space-y-3">
                  {goyoReviews.map((review) => (
                    <CrawledReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </>
          )}
          {totalPages > 1 && (reviewSource === 'site' || (!goyoLoading && !goyoError)) ? (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} className="mt-5" />
          ) : null}
        </div>
      </div>
    </div>
  )
}

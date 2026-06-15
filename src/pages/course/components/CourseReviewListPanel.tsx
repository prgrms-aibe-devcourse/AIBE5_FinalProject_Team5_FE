import { useEffect, useMemo, useState } from 'react'
import Pagination from '../../../components/common/Pagination.tsx'
import { MOCK_REVIEWS, MOCK_VERIFIED_REVIEWS, type MockReviewItem, type MockVerifiedReviewItem, type VerifiedReviewDetail } from '../data/mockCourseReviews.ts'
import { getCrawledReviews, type CrawledReview } from '../../../services/review.ts'

const ITEMS_PER_PAGE = 5

type ReviewSource = 'site' | 'goyo24'
type SiteFilter = 'all' | 'general' | 'verified'

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

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
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

const isVerified = (r: MockReviewItem): r is MockVerifiedReviewItem => 'verified' in r && (r as MockVerifiedReviewItem).verified === true

function SiteReviewCard({ review, expanded, onToggle }: {
  review: MockReviewItem
  expanded: boolean
  onToggle: () => void
}) {
  const verified = isVerified(review)
  return (
    <article className="rounded-xl border border-mistSkyBlue/30 bg-foamWhite/35 p-4">
      <div className="flex items-center gap-2">
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

  useEffect(() => { setCurrentPage(1) }, [reviewSource, siteFilter])

  useEffect(() => {
    if (currentPage > siteTotalPages && reviewSource === 'site') setCurrentPage(siteTotalPages)
  }, [currentPage, siteTotalPages, reviewSource])

  useEffect(() => {
    if (reviewSource !== 'goyo24') return
    setGoyoLoading(true)
    setGoyoError(null)
    getCrawledReviews(courseId, currentPage - 1, 10)
      .then((data) => {
        setGoyoReviews(data.content)
        setGoyoTotalPages(data.totalPages || 1)
        setGoyoTotalElements(data.totalElements)
      })
      .catch((err: unknown) => {
        setGoyoError(err instanceof Error ? err.message : '리뷰를 불러올 수 없습니다.')
      })
      .finally(() => setGoyoLoading(false))
  }, [courseId, reviewSource, currentPage])

  const toggleExpanded = (id: number) => {
    setExpandedIds((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })
  }

  const totalPages = reviewSource === 'site' ? siteTotalPages : goyoTotalPages

  const FILTERS: { key: SiteFilter; label: string; verified?: boolean }[] = [
    { key: 'all', label: '전체' },
    { key: 'general', label: '일반 리뷰' },
    { key: 'verified', label: '인증됨 리뷰', verified: true },
  ]

  return (
    <div>
      {/* 헤더 — 카드 바깥 */}
      <div className="mb-2 flex items-center justify-between px-1">
        <div className="inline-flex items-center gap-2 rounded-full border border-mistSkyBlue/40 bg-white/30 px-4 py-1.5 shadow-[0_4px_16px_rgba(52,74,100,0.10)] backdrop-blur-md">
          <span className="flex h-6 w-6 items-center justify-center text-waterlineBlue">
            <ReviewIcon />
          </span>
          <h3 className="text-sm font-bold tracking-tight text-deepOceanNavy">리뷰 내역</h3>
        </div>
        {/* 소스 토글 */}
        <div className="flex overflow-hidden rounded-lg border border-mistSkyBlue/40 bg-white/80 backdrop-blur-sm">
          {(['site', 'goyo24'] as ReviewSource[]).map((src, i) => (
            <button key={src} type="button" onClick={() => setReviewSource(src)}
              className={`px-4 py-1.5 text-sm transition-colors ${i > 0 ? 'border-l border-mistSkyBlue/35' : ''} ${
                reviewSource === src
                  ? 'bg-waterlineBlue/15 font-semibold text-waterlineBlue'
                  : 'font-medium text-deepOceanNavy hover:bg-foamWhite/70'
              }`}>
              {src === 'site' ? '사이트 리뷰' : '고용24 리뷰'}
            </button>
          ))}
        </div>
      </div>

      {/* 카드 */}
      <div className="overflow-hidden rounded-2xl glass-panel shadow-[0_2px_12px_rgba(52,74,100,0.06)]">
        <div className="p-4 md:p-5">
          {reviewSource === 'site' ? (
            <>
              {/* 필터 + 액션 */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                  {FILTERS.map(({ key, label, verified }) => (
                    <button key={key} type="button" onClick={() => setSiteFilter(key)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                        siteFilter === key
                          ? 'border-waterlineBlue bg-waterlineBlue/10 text-waterlineBlue'
                          : 'border-mistSkyBlue/40 text-secondary hover:border-waterlineBlue hover:text-deepOceanNavy'
                      }`}>
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
                  <p className="text-[0.9rem] text-secondary">
                    총 <span className="font-bold text-deepOceanNavy">{reviewPool.length}</span>개
                  </p>
                  <button type="button" onClick={onClickWriteReview}
                    className="inline-flex items-center gap-2 rounded-lg border border-deepOceanNavy/15 bg-deepOceanNavy px-4 py-2 text-[0.95rem] font-semibold text-white shadow-[0_3px_10px_rgba(52,74,100,0.18)] transition-colors hover:bg-waterlineBlue">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M4 20h4l10-10a2 2 0 10-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    리뷰 작성
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
              <p className="mb-4 text-[0.9rem] text-secondary">
                총 <span className="font-bold text-deepOceanNavy">{goyoTotalElements}</span>개의 고용24 리뷰
              </p>
              {goyoLoading ? (
                <div className="flex items-center justify-center py-16 text-secondary">불러오는 중...</div>
              ) : goyoError ? (
                <div className="flex items-center justify-center py-16 text-red-400">{goyoError}</div>
              ) : goyoReviews.length === 0 ? (
                <div className="flex items-center justify-center py-16 text-secondary">고용24 리뷰가 없습니다.</div>
              ) : (
                <div className="space-y-3">
                  {goyoReviews.map((review) => (
                    <article key={review.id} className="rounded-xl border border-mistSkyBlue/30 bg-foamWhite/35 p-4">
                      <div className="flex items-center gap-2">
                        <p className="text-base font-semibold text-deepOceanNavy">{review.reviewerNickname ?? '익명'}</p>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#1A6DFF]/10 px-2 py-0.5 text-[0.7rem] font-semibold text-[#1A6DFF]">고용24</span>
                        {review.reviewedAt && <span className="ml-auto text-xs text-secondary">{formatDate(review.reviewedAt)}</span>}
                      </div>
                      {review.rating !== null && <p className="mt-1 text-[0.95rem]"><Stars count={Math.round(review.rating)} /></p>}
                      {review.content && <p className="mt-2 text-[0.95rem] leading-relaxed text-deepOceanNavy/90 md:text-base">{review.content}</p>}
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} className="mt-5" />
        </div>
      </div>
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import Pagination from '../../../components/common/Pagination.tsx'
import { MOCK_REVIEWS, MOCK_VERIFIED_REVIEWS, type VerifiedReviewDetail } from '../data/mockCourseReviews.ts'

const ITEMS_PER_PAGE = 5

interface CourseReviewListPanelProps {
  onClickWriteReview?: () => void
}

function ReviewIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 8h10M7 12h6m-6 9l-3-3V5a2 2 0 012-2h12a2 2 0 012 2v11a2 2 0 01-2 2H9l-2 3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Stars({ count }: { count: number }) {
  return (
    <span className="text-waterlineBlue">
      {'★'.repeat(count)}
      {'☆'.repeat(5 - count)}
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
      <h4 className="w-[4.5rem] shrink-0 text-xs font-bold leading-snug text-deepOceanNavy sm:pt-1">{title}</h4>
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
          <DetailChip
            label="포기 사유"
            value={formatDropoutReason(detail.dropoutMajorReason, detail.dropoutSubReason)}
          />
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

// 과정 후기 내역 패널
export default function CourseReviewListPanel({ onClickWriteReview }: CourseReviewListPanelProps) {
  const [reviewTab, setReviewTab] = useState<'general' | 'verified'>('general')
  const [expandedVerifiedReviewIds, setExpandedVerifiedReviewIds] = useState<Set<number>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)

  const reviewPool = reviewTab === 'general' ? MOCK_REVIEWS : MOCK_VERIFIED_REVIEWS
  const totalPages = Math.max(1, Math.ceil(reviewPool.length / ITEMS_PER_PAGE))

  const paginatedReviews = useMemo(() => { // 페이지네이션 처리
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return reviewPool.slice(start, start + ITEMS_PER_PAGE)
  }, [currentPage, reviewPool])

  useEffect(() => { // 탭 변경 시 페이지 초기화
    setCurrentPage(1)
  }, [reviewTab])

  useEffect(() => { // 페이지 번호 초과 시 페이지 초기화
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  const toggleVerifiedDetail = (reviewId: number) => { // 인증된 리뷰 상세 펼치기/접기
    setExpandedVerifiedReviewIds((prev) => {
      const next = new Set(prev)
      if (next.has(reviewId)) next.delete(reviewId)
      else next.add(reviewId)
      return next
    })
  }

  return (
    <div className="overflow-hidden rounded-2xl glass-panel shadow-[0_2px_12px_rgba(52,74,100,0.06)]">
      {/* 리뷰 내역 헤더 영역 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-mistSkyBlue/45 bg-gradient-to-r from-mistSkyBlue/55 via-softAquaBlue/45 to-waterlineBlue/30 px-5 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-waterlineBlue shadow-sm ring-1 ring-mistSkyBlue/60">
            <ReviewIcon />
          </span>
          <h3 className="text-base font-bold tracking-tight text-deepOceanNavy md:text-lg">리뷰 내역</h3>
        </div>
        <div className="flex w-full flex-col items-start gap-2 sm:w-auto sm:items-end">
          <div className="flex overflow-hidden rounded-lg border border-mistSkyBlue/45 bg-white/90">
            <button type="button" onClick={() => setReviewTab('general')} 
              className={`px-4 py-2 text-[0.95rem] transition-colors ${ // 일반 리뷰 탭 버튼 스타일
                reviewTab === 'general'
                  ? 'bg-waterlineBlue/15 font-semibold text-waterlineBlue'
                  : 'bg-white font-medium text-deepOceanNavy hover:bg-foamWhite/70'
              }`}
            >
              일반 리뷰
            </button>
            <button type="button" onClick={() => setReviewTab('verified')}
              className={`border-l border-mistSkyBlue/35 px-4 py-2 text-[0.95rem] transition-colors ${ // 인증된 리뷰 탭 버튼 스타일
                reviewTab === 'verified'
                  ? 'bg-waterlineBlue/15 font-semibold text-waterlineBlue'
                  : 'bg-white font-medium text-deepOceanNavy hover:bg-foamWhite/70'
              }`}
            >
              인증된 리뷰
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.95rem] text-secondary">
          총{' '}
          <span className="font-bold text-deepOceanNavy">{reviewPool.length}</span>
          개의 {reviewTab === 'general' ? '일반' : '인증'} 리뷰
        </p>
        <button
          type="button"
          onClick={onClickWriteReview}
          className="inline-flex items-center gap-2 rounded-lg border border-deepOceanNavy/15 bg-deepOceanNavy px-4 py-2 text-[0.95rem] font-semibold text-white shadow-[0_3px_10px_rgba(52,74,100,0.18)] transition-colors hover:bg-waterlineBlue"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 20h4l10-10a2 2 0 10-4-4L4 16v4z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          리뷰 작성
        </button>
      </div>
      {/* 리뷰 내역 목록 영역 */}
      <div className="mt-4 space-y-3">
        {/* 일반 리뷰 목록 */}
        {reviewTab === 'general'
          ? paginatedReviews.map((review) => (
              <article key={review.id} className="rounded-xl border border-mistSkyBlue/30 bg-foamWhite/35 p-4">
                <div className="flex items-start gap-3">
                  <div>
                    <p className="text-base font-semibold text-deepOceanNavy">{review.user}</p>
                    <p className="text-[0.95rem]">
                      <Stars count={review.rating} />
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-deepOceanNavy/90 md:text-base">{review.content}</p>
              </article>
            ))
          : (paginatedReviews as typeof MOCK_VERIFIED_REVIEWS).map((review) => (
              // 인증된 리뷰 단일 아이템 영역
              <article key={review.id} className="rounded-xl border border-mistSkyBlue/30 bg-foamWhite/35 p-4">
                <div className="flex items-start gap-3">
                  <div>
                    <p className="text-base font-semibold text-deepOceanNavy">{review.user}</p>
                    <p className="text-[0.95rem]">
                      <Stars count={review.rating} />
                    </p>
                  </div>
                </div>

                {/* 일반 리뷰 내용 */}
                <p className="mt-2 text-[0.95rem] leading-relaxed text-deepOceanNavy/90 md:text-base">{review.content}</p>
                
                {expandedVerifiedReviewIds.has(review.id) ? <VerifiedReviewDetailPanel detail={review.detail} /> : null}
                {/* 인증된 리뷰 상세 버튼 */}
                <div className="mt-3 flex justify-end">
                  <button type="button"
                    aria-expanded={expandedVerifiedReviewIds.has(review.id)} // 인증된 리뷰 상세 펼치기/접기 상태 표시
                    aria-label={expandedVerifiedReviewIds.has(review.id) ? '리뷰 상세 접기' : '리뷰 상세 펼치기'} 
                    onClick={() => toggleVerifiedDetail(review.id)} // 인증된 리뷰 상세 펼치기/접기 버튼 클릭 시 상태 변경
                    className="text-secondary transition-colors hover:text-deepOceanNavy"
                  >
                    {expandedVerifiedReviewIds.has(review.id) ? ( // 인증된 리뷰 상세 펼치기 버튼
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M6 14l6-6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : ( // 인증된 리뷰 상세 접기 버튼
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M6 10l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </div>
              </article>
            ))}
      </div>

      {/* 페이지네이션 영역 */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} className="mt-5" />
      </div>
    </div>
  )
}


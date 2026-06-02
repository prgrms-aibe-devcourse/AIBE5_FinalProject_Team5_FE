import { useEffect, useMemo, useState } from 'react'
import Pagination from '../../../components/common/Pagination.tsx'
import { MOCK_REVIEWS, MOCK_VERIFIED_REVIEWS } from '../data/mockCourseReviews.ts'

const ITEMS_PER_PAGE = 5

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

// 과정 후기 내역 패널
export default function CourseReviewListPanel() {
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
    <div className="overflow-hidden rounded-2xl border border-mistSkyBlue/45 bg-white shadow-[0_2px_12px_rgba(52,74,100,0.06)]">
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
      <div className="flex justify-end">
        <button
          type="button"
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
                
                {/* 인증된 리뷰 상세 영역 (펼치기/접기 상태에 따라 표시)*/}
                {expandedVerifiedReviewIds.has(review.id) ? ( 
                  <div className="mt-4 rounded-lg border border-mistSkyBlue/35 bg-white/90 p-3.5">
                    <div className="grid gap-1 text-[0.95rem] md:grid-cols-2">
                      <p className="text-deepOceanNavy">
                        <span className="font-medium">전공 여부</span>
                        <span className="mx-1.5 text-mistSkyBlue">|</span>
                        {review.detail.majorStatus}
                      </p>
                      <p className="text-deepOceanNavy">
                        <span className="font-medium">추천 대상</span>
                        <span className="mx-1.5 text-mistSkyBlue">|</span>
                        {review.detail.recommendTarget}
                      </p>
                    </div>

                    <p className="mt-2 text-[0.95rem] text-deepOceanNavy/90 md:text-base">{review.detail.overallComment}</p>

                    <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-3">
                      {review.detail.metrics.map((item) => (
                        <li key={`${review.id}-${item.label}`} className="text-[0.9rem] text-deepOceanNavy md:text-[0.95rem]">
                          <div className="flex items-center justify-between">
                            <span>{item.label}</span>
                            <span className="font-semibold text-secondary">{item.value}</span>
                          </div>
                          <div className="mt-1 h-1.5 rounded-full bg-mistSkyBlue/25">
                            <div
                              className="h-full rounded-full bg-waterlineBlue"
                              style={{ width: `${item.value * 20}%` }}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
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


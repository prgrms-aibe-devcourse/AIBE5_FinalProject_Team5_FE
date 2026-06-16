import { useEffect, useState } from 'react'
import Pagination from '../../../components/common/Pagination.tsx'
import { getCrawledReviews, type CrawledReview } from '../../../services/review.ts'

interface CourseGoyoReviewPanelProps {
  courseId: number
}

function Stars({ count }: { count: number }) {
  return (
    <span className="text-waterlineBlue">
      {'★'.repeat(count)}
      {'☆'.repeat(5 - count)}
    </span>
  )
}

function Work24Badge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#1A6DFF]/10 px-2 py-0.5 text-[0.7rem] font-semibold text-[#1A6DFF]">
      <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.15" />
        <text x="8" y="11.5" textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor">W</text>
      </svg>
      고용24
    </span>
  )
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export default function CourseGoyoReviewPanel({ courseId }: CourseGoyoReviewPanelProps) {
  const [reviews, setReviews] = useState<CrawledReview[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setFetchError(null)
    getCrawledReviews(courseId, currentPage - 1, 10)
      .then((data) => {
        setReviews(data.content)
        setTotalPages(data.totalPages || 1)
        setTotalElements(data.totalElements)
      })
      .catch((err: unknown) => {
        setFetchError(err instanceof Error ? err.message : '리뷰를 불러올 수 없습니다.')
      })
      .finally(() => setIsLoading(false))
  }, [courseId, currentPage])

  return (
    <div className="overflow-hidden rounded-2xl glass-panel shadow-[0_2px_12px_rgba(52,74,100,0.06)]">
      <div className="p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[0.95rem] text-secondary">
            총 <span className="font-bold text-deepOceanNavy">{totalElements}</span>개의 고용24 리뷰
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-secondary">불러오는 중...</div>
        ) : fetchError ? (
          <div className="flex items-center justify-center py-16 text-red-400">{fetchError}</div>
        ) : reviews.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-secondary">
            고용24 리뷰가 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-xl border border-mistSkyBlue/30 bg-foamWhite/35 p-4"
              >
                <div className="flex items-center gap-2">
                  <p className="text-base font-semibold text-deepOceanNavy">
                    {review.reviewerNickname ?? '익명'}
                  </p>
                  <Work24Badge />
                  {review.reviewedAt && (
                    <span className="ml-auto text-xs text-secondary">
                      {formatDate(review.reviewedAt)}
                    </span>
                  )}
                </div>
                {review.rating !== null && (
                  <p className="mt-1 text-[0.95rem]">
                    <Stars count={Math.round(review.rating)} />
                  </p>
                )}
                {review.content && (
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-deepOceanNavy/90 md:text-base">
                    {review.content}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="mt-5"
        />
      </div>
    </div>
  )
}

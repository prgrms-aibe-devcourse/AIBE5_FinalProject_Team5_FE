import { useEffect, useState } from 'react'
import { getLatestReviews, type CourseReview } from '../../../services/review.ts'
import { reviews } from '../homeData'

function Avatar({ imageUrl }: { imageUrl?: string | null }) {
  return (
    <span className="grid h-16 w-16 overflow-hidden place-items-center rounded-full border-4 border-white bg-gradient-to-br from-mistSkyBlue to-softAquaBlue text-white shadow-[0_4px_12px_rgba(52,74,100,0.12)]">
      {imageUrl ? (
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20a8 8 0 0 1 16 0z" />
        </svg>
      )}
    </span>
  )
}

export default function ReviewsSection() {
  const [reviewsList, setReviewsList] = useState<CourseReview[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getLatestReviews(5)
      .then((data) => {
        if (data && data.length > 0) {
          setReviewsList(data)
        } else {
          // DB가 비어있을 경우 목 데이터로 대체 노출
          const mappedMock = reviews.map((r) => ({
            reviewId: r.id,
            userNickname: r.nickname,
            userProfileImageUrl: null,
            reviewType: 'GENERAL' as const,
            rating: Number(r.rating) || 5,
            content: r.text,
            createdAt: '',
            verifiedDetail: null,
            courseTitle: r.course,
          }))
          setReviewsList(mappedMock)
        }
      })
      .catch(() => {
        // API 에러 발생 시 목 데이터로 폴백
        const mappedMock = reviews.map((r) => ({
          reviewId: r.id,
          userNickname: r.nickname,
          userProfileImageUrl: null,
          reviewType: 'GENERAL' as const,
          rating: Number(r.rating) || 5,
          content: r.text,
          createdAt: '',
          verifiedDetail: null,
          courseTitle: r.course,
        }))
        setReviewsList(mappedMock)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <section id="reviews" className="w-full px-6 py-12 md:px-12 md:py-16" aria-label="수강생들의 후기" data-home-section>
        <div className="mx-auto w-full max-w-desktop-content">
          <h2 className="text-center text-2xl font-bold text-deepOceanNavy font-pretendard md:text-[28px]">수강생들의 후기</h2>
          <p className="mt-2 text-center text-sm text-[#7b8795] font-pretendard">
            실제 수강생들이 남긴 솔직한 후기를 확인해보세요
          </p>
          <ul className="mt-10 grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <li key={i} className="relative flex flex-col items-center rounded-2xl border border-[#e7edf3] bg-white/50 px-5 pb-6 pt-12 text-center shadow-[0_2px_10px_rgba(52,74,100,0.02)] animate-pulse">
                <div className="absolute -top-8 h-16 w-16 rounded-full bg-gray-200" />
                <div className="h-4 w-12 rounded bg-gray-200" />
                <div className="mt-3 h-16 w-full rounded bg-gray-200" />
                <div className="mt-4 h-3 w-3/4 rounded bg-gray-200" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    )
  }

  if (reviewsList.length === 0) {
    return null
  }

  return (
    <section id="reviews" className="w-full px-6 py-12 md:px-12 md:py-16" aria-label="수강생들의 후기" data-home-section>
      <div className="mx-auto w-full max-w-desktop-content">
        <h2 className="text-center text-2xl font-bold text-deepOceanNavy font-pretendard md:text-[28px]">수강생들의 후기</h2>
        <p className="mt-2 text-center text-sm text-[#7b8795] font-pretendard">
          부트시그널의 솔직한 후기를 확인해보세요
        </p>

        <ul className="mt-10 grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
          {reviewsList.map((review) => (
            <li
              key={review.reviewId}
              className="relative flex flex-col items-center rounded-2xl border border-[#e7edf3] bg-white/85 backdrop-blur-sm px-5 pb-6 pt-12 text-center shadow-[0_2px_10px_rgba(52,74,100,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_20px_rgba(52,74,100,0.1)]"
            >
              <div className="absolute -top-8">
                <Avatar imageUrl={review.userProfileImageUrl} />
              </div>

              <div className="flex items-center gap-1 text-sm font-bold text-[#23a03b]">
                <span aria-hidden="true">★</span>
                <span>{review.rating}</span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-[#4a5565] font-pretendard line-clamp-4 min-h-[5.5rem] break-all">
                {review.content}
              </p>

              <p className="mt-4 text-xs font-semibold text-deepOceanNavy font-pretendard line-clamp-1">
                {review.userNickname} · {review.courseTitle || '과정'}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

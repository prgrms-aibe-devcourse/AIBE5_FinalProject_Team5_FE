import { reviews } from '../homeData'

function Avatar() {
  return (
    <span className="grid h-16 w-16 place-items-center rounded-full border-4 border-white bg-gradient-to-br from-mistSkyBlue to-softAquaBlue text-white shadow-[0_4px_12px_rgba(52,74,100,0.12)]">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20a8 8 0 0 1 16 0z" />
      </svg>
    </span>
  )
}

export default function ReviewsSection() {
  return (
    <section id="reviews" className="w-full px-6 py-12 md:px-12 md:py-16" aria-label="수강생들의 후기" data-home-section>
      <div className="mx-auto w-full max-w-desktop-content">
        <h2 className="text-center text-2xl font-bold text-deepOceanNavy font-pretendard md:text-[28px]">수강생들의 후기</h2>
        <p className="mt-2 text-center text-sm text-[#7b8795] font-pretendard">
          실제 수강생들이 남긴 솔직한 후기를 확인해보세요
        </p>

        <ul className="mt-10 grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
          {reviews.map((review, index) => {
            const featured = index === Math.floor(reviews.length / 2)
            return (
              <li
                key={review.id}
                className={`relative flex flex-col items-center rounded-2xl border bg-white/85 backdrop-blur-sm px-5 pb-6 pt-12 text-center transition-transform ${
                  featured
                    ? 'border-waterlineBlue shadow-[0_12px_28px_rgba(52,74,100,0.14)] lg:-translate-y-4'
                    : 'border-[#e7edf3] shadow-[0_2px_10px_rgba(52,74,100,0.05)]'
                }`}
              >
                <div className="absolute -top-8">
                  <Avatar />
                </div>

                <div className="flex items-center gap-1 text-sm font-bold text-[#23a03b]">
                  <span aria-hidden="true">★</span>
                  <span>{review.rating}</span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-[#4a5565] font-pretendard">{review.text}</p>

                <p className="mt-4 text-xs font-semibold text-deepOceanNavy font-pretendard">
                  {review.nickname} · {review.course}
                </p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

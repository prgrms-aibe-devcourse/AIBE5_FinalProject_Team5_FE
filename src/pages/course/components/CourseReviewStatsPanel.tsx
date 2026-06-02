import {
  MOCK_VERIFIED_REVIEWS,
  buildPriorKnowledgeConicGradient,
  getVerifiedReviewStats,
} from '../data/mockCourseReviews.ts'

function StatsIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 19h16M7 16V9m5 7V5m5 11v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

// 과정 후기 통계 패널 (인증 리뷰 항목 기반)
export default function CourseReviewStatsPanel() {
  const { reviewCount, averageRating, ratingBars, priorKnowledgeDistribution, qualityMetrics } =
    getVerifiedReviewStats(MOCK_VERIFIED_REVIEWS)

  const maxRatingCount = Math.max(...ratingBars.map((item) => item.count), 1)
  const priorKnowledgeGradient = buildPriorKnowledgeConicGradient(priorKnowledgeDistribution)

  return (
    <div className="overflow-hidden rounded-2xl border border-mistSkyBlue/45 bg-white shadow-[0_2px_12px_rgba(52,74,100,0.06)]">
      <div className="flex items-center gap-3 border-b border-mistSkyBlue/45 bg-gradient-to-r from-mistSkyBlue/55 via-softAquaBlue/45 to-waterlineBlue/30 px-5 py-4 md:px-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-waterlineBlue shadow-sm ring-1 ring-mistSkyBlue/60">
          <StatsIcon />
        </span>
        <h3 className="text-base font-bold tracking-tight text-deepOceanNavy md:text-lg">리뷰 통계</h3>
      </div>

      <div className="p-4 md:p-5">
        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr] lg:items-stretch">
          <div className="flex h-full items-center rounded-xl border border-mistSkyBlue/35 bg-foamWhite/35 p-4">
            <div className="grid w-full items-center gap-4 md:grid-cols-[auto_1fr] md:gap-6">
              <div className="flex min-w-[105px] flex-col items-center justify-center">
                <div className="flex items-center gap-1.5">
                  <p className="text-2xl font-bold text-deepOceanNavy md:text-[1.7rem]">
                    {reviewCount === 0 ? '-' : averageRating.toFixed(1)}
                  </p>
                  <span className="text-[1.7rem] leading-none text-waterlineBlue" aria-hidden="true">
                    ★
                  </span>
                </div>
                <p className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-mistSkyBlue/55 bg-white px-3 py-1 text-[0.72rem] font-semibold text-deepOceanNavy md:text-xs">
                  <span className="text-waterlineBlue">인증 리뷰</span>
                  <span>{reviewCount}개</span>
                </p>
              </div>
              <ul className="w-full min-w-0 space-y-1.5">
                {ratingBars.map((item) => (
                  <li key={item.score} className="flex items-center gap-2 text-[0.9rem] md:text-[0.95rem]">
                    <span className="w-3 text-right font-medium text-deepOceanNavy">{item.score}</span>
                    <span className="w-3 text-waterlineBlue">★</span>
                    <div className="h-1.5 flex-1 rounded-full bg-mistSkyBlue/25">
                      <div
                        className="h-full rounded-full bg-waterlineBlue"
                        style={{ width: `${(item.count / maxRatingCount) * 100}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-[0.8rem] font-medium text-deepOceanNavy/80 md:text-[0.85rem]">
                      {item.count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex h-full flex-col justify-center rounded-xl border border-mistSkyBlue/35 bg-foamWhite/20 p-4">
            <p className="text-[0.95rem] font-semibold text-deepOceanNavy md:text-base">선수 지식 수준</p>
            <div
              className="mx-auto mt-3 h-36 w-36 rounded-full"
              style={{ background: priorKnowledgeGradient }}
            />
            <div className="mt-3 flex flex-wrap justify-center gap-3 text-[0.9rem] text-deepOceanNavy md:text-sm">
              {priorKnowledgeDistribution.map((item) => (
                <span key={item.level} className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.count} {item.level}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-mistSkyBlue/35 bg-foamWhite/20 p-5">
          <p className="mb-3 text-right text-xs text-secondary">*5점 만점</p>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {qualityMetrics.map((item) => (
              <li key={item.label} className="text-center">
                <div className="mx-auto flex h-24 w-4 items-end rounded-full bg-mistSkyBlue/25">
                  <div
                    className="w-full rounded-full bg-waterlineBlue"
                    style={{ height: `${(item.value / 5) * 100}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-deepOceanNavy">{item.label}</p>
                <p className="text-sm font-semibold text-secondary">{item.value.toFixed(1)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

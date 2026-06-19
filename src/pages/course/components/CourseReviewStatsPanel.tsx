import { useEffect, useState } from 'react'
import { buildPriorKnowledgeConicGradient } from '../data/mockCourseReviews.ts'
import {
  createEmptyVerifiedReviewStatistics,
  getVerifiedReviewStatistics,
  type VerifiedReviewStatistics,
} from '../../../services/review.ts'

interface CourseReviewStatsPanelProps {
  courseId: number
  refreshKey?: number
}

function StatsIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 19h16M7 16V9m5 7V5m5 11v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

// 과정 후기 통계 패널 (인증 후기 항목 기반)
export default function CourseReviewStatsPanel({ courseId, refreshKey = 0 }: CourseReviewStatsPanelProps) {
  const [stats, setStats] = useState<VerifiedReviewStatistics>(() => createEmptyVerifiedReviewStatistics())
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setFetchError(null)

    getVerifiedReviewStatistics(courseId)
      .then(setStats)
      .catch((err: unknown) => {
        setStats(createEmptyVerifiedReviewStatistics())
        setFetchError(err instanceof Error ? err.message : '후기 통계를 불러올 수 없습니다.')
      })
      .finally(() => setIsLoading(false))
  }, [courseId, refreshKey])

  const { reviewCount, averageRating, ratingBars, priorKnowledgeDistribution, qualityMetrics } = stats
  const maxRatingCount = Math.max(...ratingBars.map((item) => item.count), 1)
  const priorKnowledgeGradient = buildPriorKnowledgeConicGradient(priorKnowledgeDistribution)

  return (
    <div>
      <div className="mb-2 px-1">
        <div className="inline-flex items-center gap-2 rounded-full border border-mistSkyBlue/40 bg-white/30 px-4 py-1.5 shadow-[0_4px_16px_rgba(52,74,100,0.10)] backdrop-blur-md">
          <span className="flex h-6 w-6 items-center justify-center text-waterlineBlue"><StatsIcon /></span>
          <h3 className="text-sm font-bold tracking-tight text-deepOceanNavy">인증 후기 통계</h3>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl glass-panel shadow-[0_2px_12px_rgba(52,74,100,0.06)]">

      <div className="p-4 md:p-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-secondary">불러오는 중...</div>
        ) : fetchError ? (
          <div className="flex items-center justify-center py-16 text-red-400">{fetchError}</div>
        ) : (
        <>
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
                  <span className="text-waterlineBlue">인증 후기</span>
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
        </>
        )}
      </div>
      </div>
    </div>
  )
}

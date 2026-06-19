import { http } from './http'

export interface CrawledReview {
  id: number
  source: 'WORK24'
  reviewerNickname: string | null
  rating: number | null
  content: string | null
  reviewedAt: string | null
  crawledAt: string
}

// ApiResponse<Page<T>> → http.get이 data를 unwrap → Spring Page 구조
export interface SpringPage<T> {
  content: T[]
  totalPages: number
  totalElements: number
  number: number  // 0-based 현재 페이지
  size: number
  last: boolean
  first: boolean
  empty: boolean
}

export function getCrawledReviews(
  courseId: number,
  page = 0,
  size = 10,
): Promise<SpringPage<CrawledReview>> {
  return http.get<SpringPage<CrawledReview>>(
    `/api/courses/${courseId}/crawled-reviews`,
    {
      query: { page, size, sort: 'crawledAt,desc' },
      auth: false,
    },
  )
}

// ──────────────────────────────────────────────
// 인증 리뷰 통계 GET /api/courses/{courseId}/reviews/statistics
// ──────────────────────────────────────────────

export interface ReviewRatingBar {
  score: number
  count: number
}

export interface ReviewPriorKnowledgeItem {
  value: string
  level: string
  count: number
  color: string
}

export interface ReviewQualityMetric {
  label: string
  value: number
}

export interface VerifiedReviewStatisticsDTO {
  reviewCount: number
  averageRating: number
  ratingBars: ReviewRatingBar[]
  priorKnowledgeDistribution: ReviewPriorKnowledgeItem[]
  qualityMetrics: ReviewQualityMetric[]
}

/** UI 소비용 — mockCourseReviews.VerifiedReviewStats 와 동일 구조 */
export interface VerifiedReviewStatistics {
  reviewCount: number
  averageRating: number
  ratingBars: ReviewRatingBar[]
  priorKnowledgeDistribution: {
    level: '비전공' | '전공' | '현직'
    count: number
    color: string
  }[]
  qualityMetrics: ReviewQualityMetric[]
}

const PRIOR_KNOWLEDGE_LEVELS = ['비전공', '전공', '현직'] as const

export function createEmptyVerifiedReviewStatistics(): VerifiedReviewStatistics {
  return {
    reviewCount: 0,
    averageRating: 0,
    ratingBars: [5, 4, 3, 2, 1].map((score) => ({ score, count: 0 })),
    priorKnowledgeDistribution: [
      { level: '비전공', count: 0, color: '#5C6AC4' },
      { level: '전공', count: 0, color: '#E88EB0' },
      { level: '현직', count: 0, color: '#8BB4D2' },
    ],
    qualityMetrics: [
      { label: '강사 전달력', value: 0 },
      { label: '커리큘럼', value: 0 },
      { label: '취업 지원', value: 0 },
      { label: '프로젝트 성취도', value: 0 },
      { label: '툴 지원', value: 0 },
      { label: '멘토링', value: 0 },
    ],
  }
}

function toVerifiedReviewStatistics(dto: VerifiedReviewStatisticsDTO): VerifiedReviewStatistics {
  const levelSet = new Set<string>(PRIOR_KNOWLEDGE_LEVELS)
  const priorKnowledgeDistribution = dto.priorKnowledgeDistribution
    .filter((item) => levelSet.has(item.level))
    .map((item) => ({
      level: item.level as VerifiedReviewStatistics['priorKnowledgeDistribution'][number]['level'],
      count: item.count,
      color: item.color,
    }))

  const filledLevels = new Set(priorKnowledgeDistribution.map((item) => item.level))
  for (const level of PRIOR_KNOWLEDGE_LEVELS) {
    if (!filledLevels.has(level)) {
      priorKnowledgeDistribution.push({
        level,
        count: 0,
        color: level === '비전공' ? '#5C6AC4' : level === '전공' ? '#E88EB0' : '#8BB4D2',
      })
    }
  }

  return {
    reviewCount: dto.reviewCount,
    averageRating: Number(dto.averageRating) || 0,
    ratingBars: dto.ratingBars,
    priorKnowledgeDistribution,
    qualityMetrics: dto.qualityMetrics.map((item) => ({
      label: item.label,
      value: Number(item.value) || 0,
    })),
  }
}

/** 과정별 인증 리뷰 통계 */
export async function getVerifiedReviewStatistics(courseId: number): Promise<VerifiedReviewStatistics> {
  const data = await http.get<VerifiedReviewStatisticsDTO>(
    `/api/courses/${courseId}/reviews/statistics`,
    { auth: false },
  )
  return toVerifiedReviewStatistics(data)
}

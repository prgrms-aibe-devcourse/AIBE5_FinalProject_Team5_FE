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

/** BE 크롤링 후기 응답 — camelCase / snake_case 모두 허용 */
type CrawledReviewDTO = {
  id?: number
  source?: CrawledReview['source']
  reviewerNickname?: string | null
  reviewer_nickname?: string | null
  rating?: number | null
  content?: string | null
  reviewedAt?: unknown
  reviewed_at?: unknown
  reviewDate?: unknown
  review_date?: unknown
  crawledAt?: unknown
  crawled_at?: unknown
}

function pickNullableString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (trimmed) return trimmed
    }
  }
  return null
}

function pickNullableNumber(value: unknown): number | null {
  if (typeof value === 'number' && !Number.isNaN(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (!Number.isNaN(parsed)) return parsed
  }
  return null
}

function formatIsoDateTime(y: number, m: number, d: number, h = 0, min = 0, s = 0): string {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/** API 날짜 필드 → ISO-like 문자열 (LocalDateTime 배열/객체 포함) */
export function parseApiDateTime(value: unknown): string | null {
  if (value == null) return null

  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed || null
  }

  if (Array.isArray(value)) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = value
    if (typeof year === 'number' && typeof month === 'number' && typeof day === 'number') {
      return formatIsoDateTime(year, month, day, Number(hour), Number(minute), Number(second))
    }
    return null
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    if ('year' in record) {
      const year = Number(record.year)
      const month = Number(record.monthValue ?? record.month)
      const day = Number(record.dayOfMonth ?? record.day)
      const hour = Number(record.hour ?? 0)
      const minute = Number(record.minute ?? 0)
      const second = Number(record.second ?? 0)
      if (!Number.isNaN(year) && !Number.isNaN(month) && !Number.isNaN(day)) {
        return formatIsoDateTime(year, month, day, hour, minute, second)
      }
    }
  }

  return null
}

function toCrawledReview(raw: CrawledReviewDTO): CrawledReview {
  return {
    id: Number(raw.id),
    source: raw.source ?? 'WORK24',
    reviewerNickname: pickNullableString(raw.reviewerNickname, raw.reviewer_nickname),
    rating: pickNullableNumber(raw.rating),
    content: pickNullableString(raw.content),
    reviewedAt: parseApiDateTime(raw.reviewedAt ?? raw.reviewed_at ?? raw.reviewDate ?? raw.review_date),
    crawledAt: parseApiDateTime(raw.crawledAt ?? raw.crawled_at) ?? '',
  }
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

/** 고용 24 등 크롤링 후기 목록 — GET /api/courses/{courseId}/crawled-reviews (courseSessionId 아님) */
export async function getCrawledReviews(
  courseId: number,
  page = 0,
  size = 10,
  sort = 'crawledAt,desc',
): Promise<SpringPage<CrawledReview>> {
  const data = await http.get<SpringPage<CrawledReviewDTO>>(
    `/api/courses/${courseId}/crawled-reviews`,
    {
      query: { page, size, sort },
      auth: false,
    },
  )

  return {
    ...data,
    content: (data.content ?? []).map(toCrawledReview),
  }
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

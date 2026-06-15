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

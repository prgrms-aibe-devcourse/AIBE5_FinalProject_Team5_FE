import { http } from './http'

export type ReviewSummary = {
  executionId: string
  courseId: number
  courseTitle: string
  reviewCount: number
  averageRating: number
  summary: string
  strengths: string[]
  weaknesses: string[]
  recommendedFor: string[]
  keywords: string[]
}

type CreateReviewSummaryPayload = {
  courseId: number
  maxReviewCount?: number
}

/** 고용 24 크롤링 수강후기 AI 요약 — POST /api/ai/review-summaries */
export async function createReviewSummary(
  courseId: number,
  maxReviewCount = 50,
): Promise<ReviewSummary> {
  const payload: CreateReviewSummaryPayload = { courseId, maxReviewCount }
  return http.post<ReviewSummary>('/api/ai/review-summaries', payload, { auth: true })
}

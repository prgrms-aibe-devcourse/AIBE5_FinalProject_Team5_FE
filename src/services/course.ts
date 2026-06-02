/**
 * services/course.ts
 * 과정(course) API 타입·호출 — 백엔드 스펙 기준
 */

/** GET /api/courses 쿼리 — sort 등 */
export type CourseSortKey = 'latest' | 'mostReviews' | 'rating' | 'satisfaction'

export interface CourseListParams {
  keyword?: string
  category?: string
  price?: string
  region?: string
  duration?: string
  sort?: CourseSortKey
  page?: number
  size?: number
}

/** GET /api/courses — items[] 요소 */
export interface Course {
  id: string
  title: string
  company: string
  location: string
  price: string
  dateRange: string
  satisfaction: string
  employmentRate: string
  rating: string
  logoUrl?: string
}

/** GET /api/courses Response 200 */
export interface CourseListResponse {
  success: boolean
  code: string
  message: string
  data: {
    totalCount: number
    page: number
    totalPages: number
    items: Course[]
  }
}

/** 검색 히어로 필터 UI 설정 (mock — API 스펙 확정 시 이동·삭제 가능) */
export interface CourseFilterOption {
  value: string
  label: string
}

export interface CourseFilterConfig {
  id: string
  label: string
  options: CourseFilterOption[]
  /** true면 목록 높이 제한·스크롤 없이 전체 표시 */
  expandList?: boolean
}

/** GET /api/courses */
export async function getCourses(params: CourseListParams): Promise<CourseListResponse> {
  // TODO: 실제 API
  // const query = new URLSearchParams(...)
  // const res = await fetch(`/api/courses?${query}`)
  // const response = (await res.json()) as CourseListResponse
  // if (!res.ok) throw new Error(response.message)
  // return response
  void params
  throw new Error('과정 목록 API가 연결되지 않았습니다.')
}

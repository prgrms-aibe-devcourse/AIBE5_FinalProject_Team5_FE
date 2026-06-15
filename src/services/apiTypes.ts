/** BE 공통 응답 봉투: { success, data, error } */
export interface ApiResponse<T> {
  success: boolean
  data: T
  error: { code: string; message: string } | null
}

/** BE 페이지 응답 — page는 0-based */
export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
}

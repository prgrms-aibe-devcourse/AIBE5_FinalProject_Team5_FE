import { ApiError } from '../services/ApiError'

const NOT_FOUND_CODES = new Set([
  'NOT_FOUND',
  'COURSE_NOT_FOUND',
  'POST_NOT_FOUND',
  'REVIEW_NOT_FOUND',
  'BOOKMARK_NOT_FOUND',
  'COMMENT_NOT_FOUND',
])

export function isNotFoundApiError(error: ApiError): boolean {
  return error.status === 404 || NOT_FOUND_CODES.has(error.code) || error.code.endsWith('_NOT_FOUND')
}

export function isForbiddenApiError(error: ApiError): boolean {
  return error.status === 403 || error.code === 'FORBIDDEN'
}

export function isServerApiError(error: ApiError): boolean {
  return (
    error.status >= 500 ||
    error.code === 'INVALID_RESPONSE' ||
    error.code === 'NETWORK_ERROR'
  )
}

/** API 오류에 대응하는 에러 페이지 경로 */
export function getErrorPagePath(error: unknown): '/403' | '/404' | '/error' | null {
  if (!(error instanceof ApiError)) return null

  if (isForbiddenApiError(error)) return '/403'
  if (isNotFoundApiError(error)) return '/404'
  if (isServerApiError(error)) return '/error'

  return null
}

export function redirectToErrorPage(error: unknown): boolean {
  const path = getErrorPagePath(error)
  if (!path) return false

  window.location.replace(path)
  return true
}

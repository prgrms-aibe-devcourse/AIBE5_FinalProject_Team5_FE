import { ApiError, isExpiredAuthTokenError } from './ApiError'
import { getErrorPagePath } from '../utils/apiErrorNavigation'
import { setTokenExpiredLogoutFlash } from './authFlash'
import type { ApiResponse } from './apiTypes'

const BASE = import.meta.env.VITE_API_BASE_URL ?? ''
const CSRF_COOKIE_NAME = 'XSRF-TOKEN'
const CSRF_HEADER_NAME = 'X-XSRF-TOKEN'
const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

// 쿠키 도메인 불일치 시 서버에서 직접 읽어온 CSRF 토큰을 메모리에 캐시한다.
let cachedCsrfToken: string | null = null

let isHandlingAuthSessionExpired = false

async function handleAuthSessionExpired(): Promise<void> {
  if (isHandlingAuthSessionExpired) return
  isHandlingAuthSessionExpired = true

  try {
    const { logout } = await import('./auth')
    await logout()
  } catch {
    const { clearAuthSession } = await import('./auth')
    clearAuthSession()
  }

  setTokenExpiredLogoutFlash()
  window.location.replace('/')
}

function getCsrfToken(): string | null {
  if (cachedCsrfToken) return cachedCsrfToken
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${CSRF_COOKIE_NAME}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

async function fetchAndCacheCsrfToken(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE}/api/auth/csrf-token`, { credentials: 'include' })
    if (!res.ok) return null
    const json = await res.json()
    const token: string | null = json?.data ?? null
    if (token) cachedCsrfToken = token
    return token
  } catch {
    return null
  }
}

function buildQuery(params: Record<string, unknown>): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== '',
  )
  if (!entries.length) return ''
  return '?' + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString()
}

interface RequestOptions {
  query?: Record<string, unknown>
  auth?: boolean
  skipAuthRetry?: boolean
  skipCsrfRetry?: boolean
  /** GET 상세 조회 등 — 404·403·5xx 시 에러 페이지로 이동 */
  redirectOnError?: boolean
}

function maybeRedirectForApiError(
  apiError: ApiError,
  path: string,
  method: string,
  redirectOnError?: boolean,
): void {
  let errorPath: string | null = null

  if (path.startsWith('/api/admin') && apiError.status === 403) {
    errorPath = '/403'
  } else if (redirectOnError && method === 'GET') {
    errorPath = getErrorPagePath(apiError)
  } else if (path.startsWith('/api/admin') && method === 'GET' && apiError.status >= 500) {
    errorPath = '/error'
  } else if (
    method === 'GET' &&
    (apiError.code === 'INVALID_RESPONSE' || apiError.code === 'NETWORK_ERROR')
  ) {
    errorPath = '/error'
  }

  if (errorPath) {
    window.location.replace(errorPath)
  }
}

const SERVER_RESPONSE_ERROR_MESSAGE = '서버 응답을 처리할 수 없습니다.'

function resolveResponseStatus(res: Response): number {
  return res.status >= 400 ? res.status : 500
}

async function readApiResponse<T>(res: Response): Promise<ApiResponse<T>> {
  let text: string

  try {
    text = await res.text()
  } catch {
    throw new ApiError('INVALID_RESPONSE', SERVER_RESPONSE_ERROR_MESSAGE, resolveResponseStatus(res))
  }

  if (!text.trim()) {
    throw new ApiError('INVALID_RESPONSE', SERVER_RESPONSE_ERROR_MESSAGE, resolveResponseStatus(res))
  }

  try {
    const json = JSON.parse(text) as ApiResponse<T>
    if (typeof json?.success !== 'boolean') {
      throw new ApiError('INVALID_RESPONSE', SERVER_RESPONSE_ERROR_MESSAGE, resolveResponseStatus(res))
    }
    return json
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError('INVALID_RESPONSE', SERVER_RESPONSE_ERROR_MESSAGE, resolveResponseStatus(res))
  }
}

function toNetworkApiError(): ApiError {
  return new ApiError('NETWORK_ERROR', '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.', 500)
}

function buildHeaders(
  fetchInit: RequestInit,
  method: string,
): Record<string, string> {
  const isFormData = fetchInit.body instanceof FormData
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(fetchInit.headers as Record<string, string> | undefined),
  }

  if (UNSAFE_METHODS.has(method)) {
    const csrfToken = getCsrfToken()
    if (csrfToken) {
      headers[CSRF_HEADER_NAME] = csrfToken
    }
  }

  return headers
}

async function request<T>(
  path: string,
  init: RequestInit & RequestOptions = {},
): Promise<T> {
  const { query, auth, skipAuthRetry, skipCsrfRetry, redirectOnError, ...fetchInit } = init
  const method = (fetchInit.method ?? 'GET').toUpperCase()
  const url = BASE + path + (query ? buildQuery(query) : '')
  const headers = buildHeaders(fetchInit, method)

  let res: Response

  try {
    res = await fetch(url, {
      ...fetchInit,
      headers,
      credentials: 'include',
    })
  } catch {
    const apiError = toNetworkApiError()
    maybeRedirectForApiError(apiError, path, method, redirectOnError)
    throw apiError
  }

  if (res.status === 204) return undefined as T

  let json: ApiResponse<T>

  try {
    json = await readApiResponse<T>(res)
  } catch (error) {
    const apiError =
      error instanceof ApiError ? error : new ApiError('INVALID_RESPONSE', SERVER_RESPONSE_ERROR_MESSAGE, 500)
    maybeRedirectForApiError(apiError, path, method, redirectOnError)
    throw apiError
  }

  if (json.success) return json.data

  const err = json.error
  const apiError = new ApiError(
    err?.code ?? 'UNKNOWN',
    err?.message ?? '알 수 없는 오류가 발생했습니다.',
    res.status,
  )

  if (auth && !skipAuthRetry && isExpiredAuthTokenError(apiError)) {
    try {
      const { refreshAuthSession } = await import('./auth')
      await refreshAuthSession()
      return request<T>(path, { ...init, skipAuthRetry: true })
    } catch {
      void handleAuthSessionExpired()
    }
  }

  // 쿠키 도메인 불일치로 CSRF 헤더가 누락된 경우: 서버에서 토큰을 직접 받아 한 번 재시도한다.
  if (apiError.code === 'CSRF_TOKEN_INVALID' && !skipCsrfRetry) {
    const token = await fetchAndCacheCsrfToken()
    if (token) {
      return request<T>(path, { ...init, skipCsrfRetry: true })
    }
  }

  maybeRedirectForApiError(apiError, path, method, redirectOnError)

  throw apiError
}

async function requestBlob(path: string, init: RequestInit & RequestOptions = {}): Promise<Blob> {
  const { query, auth, skipAuthRetry, redirectOnError, ...fetchInit } = init
  const url = BASE + path + (query ? buildQuery(query) : '')
  const method = 'GET'
  const headers = buildHeaders(fetchInit, method)

  let res: Response

  try {
    res = await fetch(url, {
      ...fetchInit,
      method,
      headers,
      credentials: 'include',
    })
  } catch {
    const apiError = toNetworkApiError()
    maybeRedirectForApiError(apiError, path, method, redirectOnError)
    throw apiError
  }

  if (res.ok) {
    return res.blob()
  }

  const contentType = res.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    let json: ApiResponse<unknown>

    try {
      json = await readApiResponse<unknown>(res)
    } catch (error) {
      const apiError =
        error instanceof ApiError
          ? error
          : new ApiError('INVALID_RESPONSE', '파일을 불러오는 중 오류가 발생했습니다.', resolveResponseStatus(res))
      maybeRedirectForApiError(apiError, path, method, redirectOnError)
      throw apiError
    }

    const err = json.error
    const apiError = new ApiError(
      err?.code ?? 'UNKNOWN',
      err?.message ?? '파일을 불러오는 중 오류가 발생했습니다.',
      res.status,
    )

    if (auth && !skipAuthRetry && isExpiredAuthTokenError(apiError)) {
      try {
        const { refreshAuthSession } = await import('./auth')
        await refreshAuthSession()
        return requestBlob(path, { ...init, skipAuthRetry: true })
      } catch {
        void handleAuthSessionExpired()
      }
    }

    maybeRedirectForApiError(apiError, path, method, redirectOnError)

    throw apiError
  }

  const apiError = new ApiError(
    'INVALID_RESPONSE',
    '파일을 불러오는 중 오류가 발생했습니다.',
    resolveResponseStatus(res),
  )
  maybeRedirectForApiError(apiError, path, method, redirectOnError)
  throw apiError
}

export const http = {
  get: <T>(path: string, opts: RequestOptions = {}) =>
    request<T>(path, { method: 'GET', ...opts }),
  getBlob: (path: string, opts: RequestOptions = {}) => requestBlob(path, opts),
  post: <T>(path: string, body?: unknown, opts: RequestOptions = {}) =>
    request<T>(path, {
      method: 'POST',
      body:
        body === undefined
          ? undefined
          : body instanceof FormData
            ? body
            : JSON.stringify(body),
      ...opts,
    }),
  patch: <T>(path: string, body: unknown, opts: RequestOptions = {}) =>
    request<T>(path, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...opts,
    }),
  delete: <T>(path: string, opts: RequestOptions = {}) =>
    request<T>(path, { method: 'DELETE', ...opts }),
}

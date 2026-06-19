import { ApiError, isExpiredAuthTokenError } from './ApiError'
import { setTokenExpiredLogoutFlash } from './authFlash'
import { getAccessToken, getTokenType } from './authToken'
import type { ApiResponse } from './apiTypes'
const BASE = import.meta.env.VITE_API_BASE_URL ?? ''

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

// 쿼리 파라미터 빌드
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
}

// HTTP 요청 함수
async function request<T>(path: string, init: RequestInit & RequestOptions = {}): Promise<T> {
  const { query, auth, ...fetchInit } = init
  const url = BASE + path + (query ? buildQuery(query) : '')
  
  // 헤더 초기화
  const isFormData = fetchInit.body instanceof FormData
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(fetchInit.headers as Record<string, string> | undefined),
  }

  // 인증 헤더 추가
  const sentAuthToken = Boolean(auth && getAccessToken())
  if (auth) {
    const token = getAccessToken()
    if (token) {
      headers.Authorization = `${getTokenType()} ${token}`
    }
  }

  const res = await fetch(url, { ...fetchInit, headers })

  if (res.status === 204) return undefined as T

  const json: ApiResponse<T> = await res.json()

  if (json.success) return json.data

  const err = json.error
  const apiError = new ApiError(
    err?.code ?? 'UNKNOWN',
    err?.message ?? '알 수 없는 오류가 발생했습니다.',
    res.status,
  )

  // auth: true 요청에서 만료된 access token 응답 시 로그아웃
  if (sentAuthToken && isExpiredAuthTokenError(apiError)) {
    void handleAuthSessionExpired()
  }

  throw apiError
}

// HTTP 요청 메소드 모음
export const http = {
  get: <T>(path: string, opts: RequestOptions = {}) =>
    request<T>(path, { method: 'GET', ...opts }),
  post: <T>(path: string, body: unknown, opts: RequestOptions = {}) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body), ...opts }),
  patch: <T>(path: string, body: unknown, opts: RequestOptions = {}) =>
    request<T>(path, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...opts,
    }),
  delete: <T>(path: string, opts: RequestOptions = {}) =>
    request<T>(path, { method: 'DELETE', ...opts }),
}

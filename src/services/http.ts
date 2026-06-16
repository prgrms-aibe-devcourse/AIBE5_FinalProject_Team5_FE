import { ApiError } from './ApiError'
import type { ApiResponse } from './apiTypes'

const BASE = import.meta.env.VITE_API_BASE_URL ?? ''

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
  const { query, auth: _auth, ...fetchInit } = init
  const url = BASE + path + (query ? buildQuery(query) : '')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchInit.headers as Record<string, string> | undefined),
  }

  const res = await fetch(url, { ...fetchInit, headers })

  if (res.status === 204) return undefined as T

  const json: ApiResponse<T> = await res.json()

  if (json.success) return json.data

  const err = json.error
  throw new ApiError(
    err?.code ?? 'UNKNOWN',
    err?.message ?? '알 수 없는 오류가 발생했습니다.',
    res.status,
  )
}

// HTTP 요청 메소드 모음
export const http = {
  get: <T>(path: string, opts: RequestOptions = {}) =>
    request<T>(path, { method: 'GET', ...opts }),
  post: <T>(path: string, body: unknown, opts: RequestOptions = {}) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body), ...opts }),
  patch: <T>(path: string, body: unknown, opts: RequestOptions = {}) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body), ...opts }),
  delete: <T>(path: string, opts: RequestOptions = {}) =>
    request<T>(path, { method: 'DELETE', ...opts }),
}

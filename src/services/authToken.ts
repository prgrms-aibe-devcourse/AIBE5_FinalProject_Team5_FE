/**
 * 토큰 저장소 — 현재 localStorage 사용.
 * TODO: 쿠키(HttpOnly) 도입 시 이 파일 수정 필요.
 */
const TOKEN_STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
} as const

const ALL_TOKEN_STORAGE_KEYS = Object.values(TOKEN_STORAGE_KEYS)

/** 이전에 localStorage에 저장하던 토큰 메타 키 — 저장/삭제 시 정리 */
const LEGACY_TOKEN_STORAGE_KEYS = ['tokenType', 'expiresIn', 'refreshTokenExpiresIn'] as const

const DEFAULT_TOKEN_TYPE = 'Bearer'

export interface TokenBundle {
  accessToken: string
  tokenType: string
  expiresIn: number
  refreshToken: string
  refreshTokenExpiresIn: number
}

function clearLegacyTokenStorage(): void {
  LEGACY_TOKEN_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))
}

export function saveTokens(tokens: TokenBundle): void {
  clearLegacyTokenStorage()
  localStorage.setItem(TOKEN_STORAGE_KEYS.accessToken, tokens.accessToken)
  localStorage.setItem(TOKEN_STORAGE_KEYS.refreshToken, tokens.refreshToken)
}

export function clearTokens(): void {
  ALL_TOKEN_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))
  clearLegacyTokenStorage()
}

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEYS.accessToken)
}

export function getTokenType(): string {
  return DEFAULT_TOKEN_TYPE
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEYS.refreshToken)
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken())
}

export function getTokenBundle(): TokenBundle | null {
  const accessToken = getAccessToken()
  const refreshToken = getRefreshToken()
  if (!accessToken || !refreshToken) return null

  return {
    accessToken,
    tokenType: DEFAULT_TOKEN_TYPE,
    expiresIn: 0,
    refreshToken,
    refreshTokenExpiresIn: 0,
  }
}

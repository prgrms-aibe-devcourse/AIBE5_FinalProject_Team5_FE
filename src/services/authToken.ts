/** 이전 localStorage 토큰 방식 잔여 데이터 정리 */
const LEGACY_TOKEN_STORAGE_KEYS = [
  'accessToken',
  'refreshToken',
  'tokenType',
  'expiresIn',
  'refreshTokenExpiresIn',
] as const

export function clearLegacyTokenStorage(): void {
  LEGACY_TOKEN_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))
}

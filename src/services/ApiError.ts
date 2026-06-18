export class ApiError extends Error {
  public readonly code: string
  public readonly status: number

  constructor(code: string, message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }
}

const EXPIRED_AUTH_TOKEN_CODES = new Set([
  'TOKEN_EXPIRED',
  'ACCESS_TOKEN_EXPIRED',
  'EXPIRED_TOKEN',
  'JWT_EXPIRED',
  'AUTH_TOKEN_EXPIRED',
  'EXPIRED_AUTH_TOKEN',
  'AUTHENTICATION_TOKEN_EXPIRED',
])

/** access token 만료 — auth: true API 요청 시 로그아웃 처리 대상 */
export function isExpiredAuthTokenError(error: ApiError): boolean {
  if (EXPIRED_AUTH_TOKEN_CODES.has(error.code)) return true
  return error.message.includes('만료된 인증 토큰')
}

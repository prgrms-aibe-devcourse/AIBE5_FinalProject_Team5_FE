const AUTH_LOGOUT_FLASH_KEY = 'bootsignal:auth-logout-flash'

export const AUTH_LOGOUT_FLASH_MESSAGE =
  '토큰 만료로 인해 로그아웃되었습니다. 다시 로그인해 주세요.'

export function setTokenExpiredLogoutFlash(): void {
  try {
    sessionStorage.setItem(AUTH_LOGOUT_FLASH_KEY, 'TOKEN_EXPIRED')
  } catch {
    // private mode 등
  }
}

export function consumeAuthLogoutFlashMessage(): string | null {
  try {
    const value = sessionStorage.getItem(AUTH_LOGOUT_FLASH_KEY)
    if (!value) return null
    sessionStorage.removeItem(AUTH_LOGOUT_FLASH_KEY)
    if (value === 'TOKEN_EXPIRED') return AUTH_LOGOUT_FLASH_MESSAGE
    return null
  } catch {
    return null
  }
}

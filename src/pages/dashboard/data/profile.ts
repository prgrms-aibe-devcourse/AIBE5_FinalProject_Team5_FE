export type LoginProvider = 'EMAIL' | 'KAKAO' | 'GOOGLE'

export const LOGIN_PROVIDER_LABEL: Record<LoginProvider, string> = {
  EMAIL: '이메일',
  KAKAO: '카카오',
  GOOGLE: '구글',
}

export function getProfileAccountDisplay(provider: LoginProvider, email: string) {
  if (provider === 'EMAIL') return email
  return `${LOGIN_PROVIDER_LABEL[provider]} 로그인`
}

/** API 연동 후 제거 예정 — 프로필 더미 데이터 */
export const defaultProfile = {
  nickname: '닉네임',
  email: 'useremail@email.com',
  greetingName: '00',
  joinedAt: '2026-01-15',
  loginProvider: 'EMAIL' as LoginProvider,
}

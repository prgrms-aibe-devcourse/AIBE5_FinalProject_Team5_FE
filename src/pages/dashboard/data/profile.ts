export type LoginProvider = 'LOCAL' | 'EMAIL' | 'KAKAO' | 'GOOGLE'

export function getProfileEmailDisplay(provider: LoginProvider, email: string) {
  const emailValue = email.trim() || '--'

  if (provider === 'GOOGLE') {
    return { label: '이메일(구글 연동)', value: emailValue }
  }

  if (provider === 'KAKAO') {
    return { label: '이메일(카카오 연동)', value: emailValue }
  }

  return { label: '이메일', value: emailValue }
}

export function getProfileProviderLabel(provider: LoginProvider) {
  if (provider === 'GOOGLE') return '구글 연동'
  if (provider === 'KAKAO') return '카카오 연동'
  return '이메일 가입'
}

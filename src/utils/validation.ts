/** 이메일 형식 유효 여부 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim())
}

export const EMAIL_INVALID_MESSAGE = '올바른 이메일 형식을 입력해 주세요.'

/** 비밀번호와 확인 값 일치 여부 */
export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword
}

export const PASSWORD_MISMATCH_MESSAGE = '비밀번호가 일치하지 않습니다.'
export const PASSWORD_MATCH_MESSAGE = '비밀번호가 일치합니다.'

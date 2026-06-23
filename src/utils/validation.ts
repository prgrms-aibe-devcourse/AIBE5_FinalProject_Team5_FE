/** 이메일 형식 유효 여부 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim())
}

export const EMAIL_INVALID_MESSAGE = '올바른 이메일 형식을 입력해 주세요.'
export const EMAIL_AVAILABLE_MESSAGE = '사용 가능한 이메일입니다.'
export const EMAIL_UNAVAILABLE_MESSAGE = '이미 사용 중인 이메일입니다.'
export const EMAIL_CHECK_REQUIRED_MESSAGE = '이메일 중복 확인을 해 주세요.'

/** 비밀번호와 확인 값 일치 여부 */
export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword
}

export const PASSWORD_MISMATCH_MESSAGE = '비밀번호가 일치하지 않습니다.'
export const PASSWORD_MATCH_MESSAGE = '비밀번호가 일치합니다.'
export const PASSWORD_CONFIRM_REQUIRED_MESSAGE = '비밀번호 확인 버튼을 눌러 주세요.'

export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 64
export const PASSWORD_MIN_LENGTH_MESSAGE = '비밀번호는 8자 이상이어야 합니다.'
export const PASSWORD_MAX_LENGTH_MESSAGE = `비밀번호는 ${PASSWORD_MAX_LENGTH}자 이하여야 합니다.`
export const PASSWORD_REQUIRED_MESSAGE = '비밀번호를 입력해 주세요.'

/** @deprecated PASSWORD_MIN_LENGTH_MESSAGE 사용 */
export const PASSWORD_LENGTH_MESSAGE = PASSWORD_MIN_LENGTH_MESSAGE

/** 입력 중 표시용 — 빈 값이면 null */
export function getPasswordFormatError(password: string): string | null {
  if (!password) return null
  if (password.length < PASSWORD_MIN_LENGTH) {
    return PASSWORD_MIN_LENGTH_MESSAGE
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return PASSWORD_MAX_LENGTH_MESSAGE
  }
  return null
}

/** 제출·확인 시 검사용 */
export function getPasswordValidationError(password: string): string | null {
  if (!password.trim()) return PASSWORD_REQUIRED_MESSAGE
  return getPasswordFormatError(password)
}

export function isValidPassword(password: string): boolean {
  return getPasswordValidationError(password) === null
}

export const NICKNAME_MAX_LENGTH = 8
export const NICKNAME_LENGTH_MESSAGE = '닉네임은 8자 이하로 입력해 주세요.'

/** 닉네임 8자 초과 여부 */
export function isNicknameTooLong(nickname: string): boolean {
  return nickname.length > NICKNAME_MAX_LENGTH
}

/** 로그인 제출 가능 여부 — 이메일·비밀번호 빈칸 없음 (형식은 submit 시 검사) */
export function isLoginFormValid(email: string, password: string): boolean {
  return Boolean(email.trim() && password.trim())
}

/** 회원가입 제출 가능 여부 — 빈칸 없음 + 이메일 형식 + 비밀번호 확인 완료 */
export function isSignupFormValid(
  email: string,
  nickname: string,
  password: string,
  confirmPassword: string,
  isEmailVerified: boolean,
  isPasswordConfirmed: boolean,
): boolean {
  return Boolean(
    email.trim() &&
      nickname.trim() &&
      password.trim() &&
      confirmPassword.trim() &&
      isValidEmail(email) &&
      !isNicknameTooLong(nickname) &&
      isEmailVerified &&
      isPasswordConfirmed &&
      isValidPassword(password) &&
      passwordsMatch(password, confirmPassword),
  )
}

import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthInput from './components/AuthInput.tsx'
import AuthInputWithButton from './components/AuthInputWithButton.tsx'
import AuthPasswordInput from './components/AuthPasswordInput.tsx'
import AuthButton from './components/AuthButton.tsx'
import AuthSocial from './components/AuthSocial.tsx'
import LoginVisualPanel from './components/LoginVisualPanel.tsx'
import AuthExitButton from './components/AuthExitButton.tsx'
import {
  EMAIL_AVAILABLE_MESSAGE,
  EMAIL_CHECK_REQUIRED_MESSAGE,
  EMAIL_INVALID_MESSAGE,
  EMAIL_UNAVAILABLE_MESSAGE,
  isSignupFormValid,
  isValidEmail,
  isNicknameTooLong,
  NICKNAME_LENGTH_MESSAGE,
  PASSWORD_CONFIRM_REQUIRED_MESSAGE,
  PASSWORD_MATCH_MESSAGE,
  PASSWORD_MISMATCH_MESSAGE,
  getPasswordFormatError,
  getPasswordValidationError,
  isValidPassword,
  passwordsMatch,
} from '../../utils/validation.ts'
import { checkEmail, signup } from '../../services/auth.ts'
import { ApiError } from '../../services/ApiError.ts'

/** 데스크톱 회원가입 페이지 (50:50 — 사이드 배경 | 폼) */
export default function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [nicknameError, setNicknameError] = useState<string | null>(null)
  const [passwordConfirmError, setPasswordConfirmError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [isEmailChecking, setIsEmailChecking] = useState(false)
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false)
  const [signupError, setSignupError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = isSignupFormValid(
    email,
    name,
    nickname,
    password,
    confirmPassword,
    isEmailVerified,
    isPasswordConfirmed,
  )

  const resetPasswordConfirmState = () => {
    setPasswordConfirmError(null)
    setIsPasswordConfirmed(false)
  }

  /* 이메일 중복 확인 */
  const handleEmailDuplicateCheck = async () => {
    // 에러 체크
    if (!isValidEmail(email)) {
      setEmailError(EMAIL_INVALID_MESSAGE)
      setIsEmailVerified(false)
      return
    }

    setEmailError(null)
    setIsEmailVerified(false)
    setIsEmailChecking(true)

    // 이메일 중복 확인 요청 
    try {
      const result = await checkEmail(email.trim())

      if (result.available) {
        setIsEmailVerified(true)
        return
      }

      setEmailError(EMAIL_UNAVAILABLE_MESSAGE)
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : '이메일 확인 중 오류가 발생했습니다.'
      setEmailError(message)
    } finally {
      setIsEmailChecking(false)
    }
  }

  // 비밀번호 확인
  const handlePasswordConfirm = () => {
    const passwordValidationError = getPasswordValidationError(password)
    if (passwordValidationError) {
      setPasswordError(passwordValidationError)
      setPasswordConfirmError(null)
      setIsPasswordConfirmed(false)
      return
    }

    if (!confirmPassword.trim()) {
      setPasswordConfirmError('비밀번호 확인을 입력해 주세요.')
      setIsPasswordConfirmed(false)
      return
    }

    if (passwordsMatch(password, confirmPassword)) {
      setPasswordError(null)
      setPasswordConfirmError(null)
      setIsPasswordConfirmed(true)
      return
    }

    setPasswordConfirmError(PASSWORD_MISMATCH_MESSAGE)
    setIsPasswordConfirmed(false)
  }

  /* 회원가입 처리리 */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // 에러 체크
    if (!isValidEmail(email)) {
      setEmailError(EMAIL_INVALID_MESSAGE)
      return
    }

    if (!isEmailVerified) {
      setEmailError(EMAIL_CHECK_REQUIRED_MESSAGE)
      return
    }

    if (isNicknameTooLong(nickname)) {
      setNicknameError(NICKNAME_LENGTH_MESSAGE)
      return
    }

    const passwordValidationError = getPasswordValidationError(password)
    if (passwordValidationError) {
      setPasswordError(passwordValidationError)
      return
    }

    if (!isPasswordConfirmed || !passwordsMatch(password, confirmPassword)) {
      setPasswordConfirmError(
        isPasswordConfirmed ? PASSWORD_MISMATCH_MESSAGE : PASSWORD_CONFIRM_REQUIRED_MESSAGE,
      )
      setIsPasswordConfirmed(false)
      return
    }

    setEmailError(null)
    setNicknameError(null)
    setPasswordError(null)
    setPasswordConfirmError(null)
    setSignupError(null)
    setIsSubmitting(true)

    // 회원가입 요청 전송
    try {
      await signup({
        email: email.trim(),
        password,
        name: name.trim(),
        nickname: nickname.trim(),
      })
      navigate('/login')
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === 'DUPLICATE_EMAIL') {
          setEmailError(err.message)
          setIsEmailVerified(false)
        } else if (err.code === 'DUPLICATE_NICKNAME') {
          setNicknameError(err.message)
        } else {
          setSignupError(err.message)
        }
      } else {
        setSignupError('회원가입 중 오류가 발생했습니다.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex h-dvh w-full overflow-hidden font-pretendard">
      {/* 좌측 사이드 배경 — 추후 회원가입 전용 이미지로 교체 */}
      <LoginVisualPanel overlayText="SIGN UP" />

      {/* 우측 폼 영역 */}
      <div className="relative flex h-full w-1/2 flex-col overflow-y-auto glass-panel px-8 py-6">
        {/* 뒤로가기 */}
        <div className="absolute left-8 top-6 z-10">
          <AuthExitButton />
        </div>

        {/* 회원가입 폼 영역 */}
        <div className="flex w-full flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-md">
            <h1 className="mb-8 text-center text-2xl font-semibold text-deepOceanNavy">
              회원가입
            </h1>
            {/* 입력 영역 */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <AuthInputWithButton
                label="이메일"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setEmailError(null)
                  setIsEmailVerified(false)
                }}
                placeholder="example@email.com"
                autoComplete="email"
                buttonLabel={isEmailChecking ? '확인 중...' : '중복 확인'}
                onButtonClick={handleEmailDuplicateCheck}
                buttonDisabled={!email.trim() || isEmailChecking}
                error={emailError ?? undefined}
                success={isEmailVerified ? EMAIL_AVAILABLE_MESSAGE : undefined}
              />

              <AuthInput
                label="이름"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                autoComplete="name"
              />

              <AuthInput
                label="닉네임"
                type="text"
                value={nickname}
                onChange={(e) => {
                  const value = e.target.value
                  setNickname(value)
                  if (isNicknameTooLong(value)) {
                    setNicknameError(NICKNAME_LENGTH_MESSAGE)
                  } else if (nicknameError) {
                    setNicknameError(null)
                  }
                }}
                placeholder="Input nickname"
                autoComplete="username"
                error={nicknameError ?? undefined}
              />

              <AuthPasswordInput
                placeholder="Password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  const value = e.target.value
                  setPassword(value)
                  resetPasswordConfirmState()
                  setPasswordError(getPasswordFormatError(value))
                }}
                error={passwordError ?? undefined}
              />

              <AuthInputWithButton
                label="비밀번호 확인"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  resetPasswordConfirmState()
                }}
                placeholder="Password Confirmation"
                autoComplete="new-password"
                buttonLabel="확인"
                onButtonClick={handlePasswordConfirm}
                buttonDisabled={!confirmPassword.trim()}
                error={passwordConfirmError ?? undefined}
                success={isPasswordConfirmed ? PASSWORD_MATCH_MESSAGE : undefined}
              />

              {signupError && (
                <p className="text-sm text-red-500 font-pretendard" role="alert">
                  {signupError}
                </p>
              )}

              <AuthButton
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="mt-2 rounded-full py-3.5 text-base"
              >
                {isSubmitting ? '가입 중...' : '회원가입'}
              </AuthButton>
            </form>

            {/* 구분선 */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-mistSkyBlue" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-transparent px-3 text-sm text-softAquaBlue font-pretendard">Or</span>
              </div>
            </div>

            {/* 소셜 회원가입 */}
            <AuthSocial variant="signup" />
          </div>
        </div>
      </div>
    </div>
  )
}

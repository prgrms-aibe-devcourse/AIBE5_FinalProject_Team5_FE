import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthInput from './components/AuthInput.tsx'
import AuthInputWithButton from './components/AuthInputWithButton.tsx'
import AuthPasswordInput from './components/AuthPasswordInput.tsx'
import AuthButton from './components/AuthButton.tsx'
import AuthSocial from './components/AuthSocial.tsx'
import AuthPageLayout from './components/AuthPageLayout.tsx'
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
  passwordsMatch,
} from '../../utils/validation.ts'
import { checkEmail, signup } from '../../services/auth.ts'
import { ApiError } from '../../services/ApiError.ts'

export default function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
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

  const handleEmailDuplicateCheck = async () => {
    if (!isValidEmail(email)) {
      setEmailError(EMAIL_INVALID_MESSAGE)
      setIsEmailVerified(false)
      return
    }

    setEmailError(null)
    setIsEmailVerified(false)
    setIsEmailChecking(true)

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

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

    try {
      const trimmedNickname = nickname.trim()
      await signup({
        email: email.trim(),
        password,
        name: trimmedNickname,
        nickname: trimmedNickname,
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
    <AuthPageLayout visualOverlayText="SIGN UP" visualPosition="left">
      <div className="w-full max-w-md px-1 sm:px-0">
        <h1 className="mb-6 text-center text-xl font-semibold text-deepOceanNavy md:mb-8 md:text-2xl">
          회원가입
        </h1>

        <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
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
            className="mt-1 rounded-full py-3 text-base sm:mt-2 sm:py-3.5"
          >
            {isSubmitting ? '가입 중...' : '회원가입'}
          </AuthButton>
        </form>

        <div className="relative my-6 sm:my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-mistSkyBlue" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-transparent px-3 text-sm text-softAquaBlue font-pretendard">Or</span>
          </div>
        </div>

        <AuthSocial variant="signup" />
      </div>
    </AuthPageLayout>
  )
}

import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AuthPasswordInput from './components/AuthPasswordInput.tsx'
import AuthInputWithButton from './components/AuthInputWithButton.tsx'
import AuthButton from './components/AuthButton.tsx'
import AuthPageLayout from './components/AuthPageLayout.tsx'
import {
  PASSWORD_CONFIRM_REQUIRED_MESSAGE,
  PASSWORD_MATCH_MESSAGE,
  PASSWORD_MISMATCH_MESSAGE,
  getPasswordFormatError,
  getPasswordValidationError,
  isValidPassword,
  passwordsMatch,
} from '../../utils/validation.ts'
import { resetPassword } from '../../services/auth.ts'
import { ApiError } from '../../services/ApiError.ts'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')?.trim() ?? ''

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordConfirmError, setPasswordConfirmError] = useState<string | null>(null)
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = Boolean(
    token &&
      newPassword.trim() &&
      confirmPassword.trim() &&
      isPasswordConfirmed &&
      isValidPassword(newPassword) &&
      passwordsMatch(newPassword, confirmPassword),
  )

  const resetPasswordConfirmState = () => {
    setPasswordConfirmError(null)
    setIsPasswordConfirmed(false)
  }

  const handlePasswordConfirm = () => {
    const passwordValidationError = getPasswordValidationError(newPassword)
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

    if (passwordsMatch(newPassword, confirmPassword)) {
      setPasswordError(null)
      setPasswordConfirmError(null)
      setIsPasswordConfirmed(true)
      return
    }

    setPasswordConfirmError(PASSWORD_MISMATCH_MESSAGE)
    setIsPasswordConfirmed(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const passwordValidationError = getPasswordValidationError(newPassword)
    if (passwordValidationError) {
      setPasswordError(passwordValidationError)
      return
    }

    if (!isPasswordConfirmed || !passwordsMatch(newPassword, confirmPassword)) {
      setPasswordConfirmError(
        isPasswordConfirmed ? PASSWORD_MISMATCH_MESSAGE : PASSWORD_CONFIRM_REQUIRED_MESSAGE,
      )
      setIsPasswordConfirmed(false)
      return
    }

    setSubmitError(null)
    setIsSubmitting(true)

    try {
      await resetPassword({
        token,
        newPassword: newPassword.trim(),
      })
      navigate('/login?reset=success', { replace: true })
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : '비밀번호 재설정에 실패했습니다. 잠시 후 다시 시도해 주세요.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthPageLayout visualOverlayText="RESET">
      <div className="w-full max-w-md px-1 sm:px-0">
        <h1 className="mb-3 text-center text-xl font-semibold text-deepOceanNavy md:text-2xl">
          새 비밀번호 설정
        </h1>
        <p className="mb-6 text-center text-xs text-softAquaBlue sm:mb-8 sm:text-sm">
          8자 이상 64자 이하의 새 비밀번호를 입력해 주세요.
        </p>

        {!token ? (
          <div className="space-y-5 text-center sm:space-y-6">
            <p className="text-sm text-red-500" role="alert">
              유효하지 않은 비밀번호 재설정 링크입니다.
              <br />
              비밀번호 찾기를 다시 요청해 주세요.
            </p>
            <AuthButton
              type="button"
              className="rounded-full py-3 text-base sm:py-3.5"
              onClick={() => navigate('/forgot-password')}
            >
              비밀번호 찾기
            </AuthButton>
          </div>
        ) : (
          <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
            <AuthPasswordInput
              label="새 비밀번호"
              placeholder="8자 이상의 새 비밀번호를 입력해 주세요"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => {
                const value = event.target.value
                setNewPassword(value)
                resetPasswordConfirmState()
                setPasswordError(getPasswordFormatError(value))
                if (submitError) setSubmitError(null)
              }}
              error={passwordError ?? undefined}
            />

            <AuthInputWithButton
              label="새 비밀번호 확인"
              type="password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value)
                resetPasswordConfirmState()
                if (submitError) setSubmitError(null)
              }}
              placeholder="새 비밀번호를 다시 입력해 주세요"
              autoComplete="new-password"
              buttonLabel="확인"
              onButtonClick={handlePasswordConfirm}
              buttonDisabled={!confirmPassword.trim() || !newPassword.trim()}
              error={passwordConfirmError ?? undefined}
              success={isPasswordConfirmed ? PASSWORD_MATCH_MESSAGE : undefined}
            />

            {submitError && (
              <p className="text-sm text-red-500 font-pretendard" role="alert">
                {submitError}
              </p>
            )}

            <AuthButton
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="mt-1 rounded-full py-3 text-base sm:mt-2 sm:py-3.5"
            >
              {isSubmitting ? '변경 중...' : '비밀번호 변경'}
            </AuthButton>
          </form>
        )}

        <p className="mt-5 text-center text-sm text-deepOceanNavy sm:mt-6">
          <Link
            to="/login"
            className="font-semibold text-waterlineBlue transition-colors hover:text-deepOceanNavy"
          >
            로그인으로 돌아가기
          </Link>
        </p>
      </div>
    </AuthPageLayout>
  )
}

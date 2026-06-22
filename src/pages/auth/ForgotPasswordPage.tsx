import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthInput from './components/AuthInput.tsx'
import AuthButton from './components/AuthButton.tsx'
import LoginVisualPanel from './components/LoginVisualPanel.tsx'
import AuthExitButton from './components/AuthExitButton.tsx'
import { EMAIL_INVALID_MESSAGE, isValidEmail } from '../../utils/validation.ts'
import { forgotPassword, getPasswordResetNavigationPath } from '../../services/auth.ts'
import { ApiError } from '../../services/ApiError.ts'

/** 비밀번호 찾기 — 재설정 안내 메일 발송 요청 */
export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const canSubmit = Boolean(email.trim())

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isValidEmail(email)) {
      setEmailError(EMAIL_INVALID_MESSAGE)
      return
    }

    setEmailError(null)
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      const result = await forgotPassword({ email: email.trim() })
      const resetPath = getPasswordResetNavigationPath(result)
      if (resetPath) {
        navigate(resetPath, { replace: true })
        return
      }
      setIsSubmitted(true)
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : '비밀번호 재설정 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex h-dvh w-full overflow-hidden font-pretendard">
      <div className="relative flex h-full w-1/2 flex-col overflow-y-auto glass-panel px-8 py-6">
        <div className="absolute left-8 top-6 z-10">
          <AuthExitButton />
        </div>

        <div className="flex w-full flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-md">
            <h1 className="mb-3 text-center text-2xl font-semibold text-deepOceanNavy">
              비밀번호 재설정
            </h1>
            <p className="mb-8 text-center text-sm text-softAquaBlue">
              가입 시 사용한 이메일을 입력하면 비밀번호 재설정 안내를 보내 드립니다.
            </p>

            {isSubmitted ? (
              <div className="space-y-6 text-center">
                <p className="text-sm leading-relaxed text-deepOceanNavy">
                  입력하신 이메일로 비밀번호 재설정 안내를 보냈습니다.
                  <br />
                  메일함을 확인해 주세요.
                </p>
                <AuthButton
                  type="button"
                  className="rounded-full py-3.5 text-base"
                  onClick={() => navigate('/login')}
                >
                  로그인으로 돌아가기
                </AuthButton>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <AuthInput
                  label="이메일"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    if (emailError) setEmailError(null)
                    if (submitError) setSubmitError(null)
                  }}
                  placeholder="example@email.com"
                  autoComplete="email"
                  error={emailError ?? undefined}
                />

                {submitError && (
                  <p className="text-sm text-red-500 font-pretendard" role="alert">
                    {submitError}
                  </p>
                )}

                <AuthButton
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="mt-2 rounded-full py-3.5 text-base"
                >
                  {isSubmitting ? '전송 중...' : '재설정 안내 보내기'}
                </AuthButton>
              </form>
            )}

            {!isSubmitted && (
              <p className="mt-6 text-center text-sm text-deepOceanNavy">
                비밀번호가 기억나셨나요?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-waterlineBlue transition-colors hover:text-deepOceanNavy"
                >
                  로그인
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>

      <LoginVisualPanel />
    </div>
  )
}

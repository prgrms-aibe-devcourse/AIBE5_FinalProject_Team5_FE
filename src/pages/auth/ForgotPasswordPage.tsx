import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthInput from './components/AuthInput.tsx'
import AuthButton from './components/AuthButton.tsx'
import AuthPageLayout from './components/AuthPageLayout.tsx'
import { EMAIL_INVALID_MESSAGE, isValidEmail } from '../../utils/validation.ts'
import { forgotPassword } from '../../services/auth.ts'
import { ApiError } from '../../services/ApiError.ts'

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
      await forgotPassword({ email: email.trim() })
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
    <AuthPageLayout>
      <div className="w-full max-w-md px-1 sm:px-0">
        <h1 className="mb-3 text-center text-xl font-semibold text-deepOceanNavy md:text-2xl">
          비밀번호 재설정
        </h1>
        {isSubmitted ? (
          <div className="space-y-5 text-center sm:space-y-6">
            <p className="text-sm leading-relaxed text-deepOceanNavy sm:text-base">
              가입 이메일로 비밀번호 재설정 URL을 전송드렸습니다.
              <br />
              해당 URL을 통해 접속해 주세요.
            </p>
            <p className="text-xs font-medium leading-relaxed text-waterlineBlue">
              전송된 URL의 유효시간은 3분입니다. 해당 시간 내에 접속해 새 비밀번호를 설정해 주세요.
            </p>
            <AuthButton
              type="button"
              className="rounded-full py-3 text-base sm:py-3.5"
              onClick={() => navigate('/login')}
            >
              로그인으로 돌아가기
            </AuthButton>
          </div>
        ) : (
          <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
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
              className="mt-1 rounded-full py-3 text-base sm:mt-2 sm:py-3.5"
            >
              {isSubmitting ? '전송 중...' : '재설정 안내 보내기'}
            </AuthButton>
          </form>
        )}

        {!isSubmitted && (
          <p className="mt-5 text-center text-sm text-deepOceanNavy sm:mt-6">
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
    </AuthPageLayout>
  )
}

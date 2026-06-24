import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AuthInput from './components/AuthInput.tsx'
import AuthPasswordInput from './components/AuthPasswordInput.tsx'
import AuthButton from './components/AuthButton.tsx'
import AuthSocial from './components/AuthSocial.tsx'
import AuthPageLayout from './components/AuthPageLayout.tsx'
import { EMAIL_INVALID_MESSAGE, isLoginFormValid, isValidEmail } from '../../utils/validation.ts'
import { login } from '../../services/auth.ts'

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? '/'
  const passwordResetSuccess = searchParams.get('reset') === 'success'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = isLoginFormValid(email, password)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isValidEmail(email)) {
      setEmailError(EMAIL_INVALID_MESSAGE)
      return
    }

    setEmailError(null)
    setLoginError(null)
    setIsSubmitting(true)

    try {
      await login({ email, password })
      window.location.href = redirectTo
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : '로그인에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthPageLayout>
      <div className="w-full max-w-md px-1 sm:px-0">
        <h1 className="mb-6 text-center text-xl font-semibold text-deepOceanNavy md:mb-8 md:text-2xl">
          로그인
        </h1>

        <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
          <AuthInput
            label="이메일"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (emailError) setEmailError(null)
              if (loginError) setLoginError(null)
            }}
            placeholder="example@email.com"
            autoComplete="email"
            error={emailError ?? undefined}
          />
          <div className="space-y-2">
            <AuthPasswordInput
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (loginError) setLoginError(null)
              }}
            />
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-waterlineBlue underline underline-offset-2 transition-colors hover:text-deepOceanNavy sm:text-sm"
              >
                비밀번호를 잊어버리셨나요?
              </Link>
            </div>
          </div>

          {passwordResetSuccess && (
            <p className="text-sm text-waterlineBlue font-pretendard" role="status">
              비밀번호가 변경되었습니다. 새 비밀번호로 로그인해 주세요.
            </p>
          )}

          {loginError && (
            <p className="text-sm text-red-500 font-pretendard" role="alert">
              {loginError}
            </p>
          )}

          <AuthButton
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="mt-1 rounded-full py-3 text-base sm:mt-2 sm:py-3.5"
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </AuthButton>
        </form>

        <p className="mt-5 text-center text-sm text-deepOceanNavy sm:mt-6">
          계정이 없으신가요?{' '}
          <a
            href="/signup"
            className="font-semibold text-waterlineBlue transition-colors hover:text-deepOceanNavy"
          >
            회원가입
          </a>
        </p>

        <div className="relative my-6 sm:my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-mistSkyBlue" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-transparent px-3 text-sm text-softAquaBlue font-pretendard">Or</span>
          </div>
        </div>

        <AuthSocial />
      </div>
    </AuthPageLayout>
  )
}

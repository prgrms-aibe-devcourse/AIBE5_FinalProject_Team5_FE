import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import AuthInput from './components/AuthInput.tsx'
import AuthPasswordInput from './components/AuthPasswordInput.tsx'
import AuthButton from './components/AuthButton.tsx'
import AuthSocial from './components/AuthSocial.tsx'
import LoginVisualPanel from './components/LoginVisualPanel.tsx'
import AuthExitButton from './components/AuthExitButton.tsx'
import { EMAIL_INVALID_MESSAGE, isLoginFormValid, isValidEmail } from '../../utils/validation.ts'
import { login } from '../../services/auth.ts'

/** 데스크톱 로그인 페이지 (50:50 — 폼 | 사이드 배경) */
export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = isLoginFormValid(email, password)

  /** 로그인 제출  */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // 에러 처리
    if (!isValidEmail(email)) {
      setEmailError(EMAIL_INVALID_MESSAGE)
      return
    }

    setEmailError(null)
    setLoginError(null)
    setIsSubmitting(true)

    // 로그인 요청
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
    <div className="flex h-dvh w-full overflow-hidden font-pretendard">
      {/* 좌측 사이드 영역 */}
      <div className="relative flex h-full w-1/2 flex-col overflow-y-auto glass-panel px-8 py-6">
          {/* 뒤로가기 */}
          <div className="absolute left-8 top-6 z-10">
            <AuthExitButton />
          </div>

          {/* 로그인 폼 영역 */}
          <div className="flex w-full flex-1 flex-col items-center justify-center">
            <div className="w-full max-w-md">
              <h1 className="mb-8 text-center text-2xl font-semibold text-deepOceanNavy">
                로그인
              </h1>

              {/* 입력 영역 */}
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* 이메일 */}
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
                {/* 비밀번호 */}
                <div className="space-y-2">
                  <AuthPasswordInput
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (loginError) setLoginError(null)
                    }}
                  />
                  <div className="flex justify-end">
                    <a href="/forgot-password"
                      className="text-sm text-waterlineBlue underline underline-offset-2 transition-colors hover:text-deepOceanNavy"
                    >
                      비밀번호 찾기
                    </a>
                  </div>
                </div>

                {loginError && (
                  <p className="text-sm text-red-500 font-pretendard" role="alert">
                    {loginError}
                  </p>
                )}

                {/* 제출 버튼 */}
                <AuthButton
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="mt-2 rounded-full py-3.5 text-base"
                >
                  {isSubmitting ? '로그인 중...' : '로그인'}
                </AuthButton>
              </form>

              {/* 회원가입 링크 */}
              <p className="mt-6 text-center text-sm text-deepOceanNavy">
                계정이 없으신가요?{' '}
                <a href="/signup"
                  className="font-semibold text-waterlineBlue transition-colors hover:text-deepOceanNavy"
                >
                  회원가입
                </a>
              </p>
              {/* 구분선 */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-mistSkyBlue" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-transparent px-3 text-sm text-softAquaBlue font-pretendard">Or</span>
                </div>
              </div>
              {/* 소셜 로그인 */}
              <AuthSocial />
            </div>
          </div>
        </div>

        {/* 우측 사이드 배경 패널 */}
        <LoginVisualPanel />
    </div>
  )
}

import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import AuthInput from './components/AuthInput.tsx'
import AuthPasswordInput from './components/AuthPasswordInput.tsx'
import AuthButton from './components/AuthButton.tsx'
import AuthSocial from './components/AuthSocial.tsx'
import LoginVisualPanel from './components/LoginVisualPanel.tsx'
import AuthExitButton from './components/AuthExitButton.tsx'
import { EMAIL_INVALID_MESSAGE, isLoginFormValid, isValidEmail } from '../../utils/validation.ts'
import { DUMMY_ADMIN_LOGIN, DUMMY_LOGIN, login, USE_AUTH_DUMMY } from '../../services/auth.ts'

/** 데스크톱 로그인 페이지 (50:50 — 폼 | 사이드 배경) */
export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? '/'

  // 더미 끄기: USE_AUTH_DUMMY = false 후 아래를 useState('') 두 줄로 교체
  const [email, setEmail] = useState(USE_AUTH_DUMMY ? DUMMY_LOGIN.request.email : '')
  const [password, setPassword] = useState(USE_AUTH_DUMMY ? DUMMY_LOGIN.request.password : '')
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

              {/* 빠른 테스트 로그인 */}
              {USE_AUTH_DUMMY && (
                <div className="mt-8 rounded-xl border border-mistSkyBlue/40 bg-foamWhite/50 p-4">
                  <p className="mb-3 text-center text-xs font-semibold text-secondary">빠른 테스트 로그인</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        await login(DUMMY_LOGIN.request)
                        window.location.href = redirectTo
                      }}
                      className="flex-1 rounded-lg border border-waterlineBlue/60 bg-white/70 py-2 text-xs font-semibold text-deepOceanNavy transition-colors hover:bg-waterlineBlue hover:text-white"
                    >
                      일반 사용자
                      <span className="mt-0.5 block font-normal text-[#94a3b8] hover:text-white/80 text-[10px]">
                        {DUMMY_LOGIN.request.email}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await login(DUMMY_ADMIN_LOGIN.request)
                        window.location.href = '/admin'
                      }}
                      className="flex-1 rounded-lg border border-deepOceanNavy/60 bg-white/70 py-2 text-xs font-semibold text-deepOceanNavy transition-colors hover:bg-deepOceanNavy hover:text-white"
                    >
                      관리자
                      <span className="mt-0.5 block font-normal text-[#94a3b8] text-[10px]">
                        {DUMMY_ADMIN_LOGIN.request.email}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 우측 사이드 배경 패널 */}
        <LoginVisualPanel />
    </div>
  )
}

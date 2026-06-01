import { useState } from 'react'
import AuthInput from '../components/AuthInput.tsx'
import AuthPasswordInput from '../components/AuthPasswordInput.tsx'
import AuthButton from '../components/AuthButton.tsx'
import AuthSocial from '../components/AuthSocial.tsx'
import LoginVisualPanel from '../components/LoginVisualPanel.tsx'
import AuthExitButton from '../components/AuthExitButton.tsx'

/** 데스크톱 로그인 페이지 (50:50 — 폼 | 사이드 배경) */
export default function LoginPage() {
  const [email, setEmail] = useState('yogavwijaya@gmail.com')

  return (
    <div className="flex h-dvh w-full overflow-hidden font-pretendard">
      {/* 좌측 사이드 영역 */}
      <div className="relative flex h-full w-1/2 flex-col overflow-y-auto bg-white px-8 py-6">
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
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                {/* 이메일 */}
                <AuthInput label="이메일" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  autoComplete="email"
                />
                {/* 비밀번호 */}
                <div className="space-y-2">
                  <AuthPasswordInput />
                  <div className="flex justify-end">
                    <a href="/forgot-password"
                      className="text-sm text-waterlineBlue underline underline-offset-2 transition-colors hover:text-deepOceanNavy"
                    >
                      비밀번호 찾기
                    </a>
                  </div>
                </div>

                {/* 제출 버튼 */}
                <AuthButton type="submit" className="mt-2 rounded-full py-3.5 text-base">
                  로그인
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
                  <span className="bg-white px-3 text-sm text-softAquaBlue font-pretendard">Or</span>
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

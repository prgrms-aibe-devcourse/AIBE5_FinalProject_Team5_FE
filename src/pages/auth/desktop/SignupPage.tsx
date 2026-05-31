import { useState } from 'react'
import AuthInput from '../components/AuthInput.tsx'
import AuthInputWithButton from '../components/AuthInputWithButton.tsx'
import AuthPasswordInput from '../components/AuthPasswordInput.tsx'
import AuthButton from '../components/AuthButton.tsx'
import AuthSocial from '../components/AuthSocial.tsx'
import LoginVisualPanel from '../components/LoginVisualPanel.tsx'
import AuthExitButton from '../components/AuthExitButton.tsx'
import {
  EMAIL_INVALID_MESSAGE,
  isValidEmail,
  PASSWORD_MATCH_MESSAGE,
  PASSWORD_MISMATCH_MESSAGE,
  passwordsMatch,
} from '../../../utils/validation.ts'

/** 데스크톱 회원가입 페이지 (50:50 — 사이드 배경 | 폼) */
export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordConfirmError, setPasswordConfirmError] = useState<string | null>(null)
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false)

  const resetPasswordConfirmState = () => {
    setPasswordConfirmError(null)
    setIsPasswordConfirmed(false)
  }

  // 이메일 중복 확인 
  const handleEmailDuplicateCheck = () => {
    if (!isValidEmail(email)) { // 이메일 형식 유효성 검사
      setEmailError(EMAIL_INVALID_MESSAGE)
      return
    }

    setEmailError(null)
    // TODO: 백엔드 이메일 중복 확인 API 연동
  }

  const handlePasswordConfirm = () => {
    if (passwordsMatch(password, confirmPassword)) {
      setPasswordConfirmError(null)
      setIsPasswordConfirmed(true)
      return
    }

    setPasswordConfirmError(PASSWORD_MISMATCH_MESSAGE)
    setIsPasswordConfirmed(false)
  }

  return (
    <div className="flex h-dvh w-full overflow-hidden font-pretendard">
      {/* 좌측 사이드 배경 — 추후 회원가입 전용 이미지로 교체 */}
      <LoginVisualPanel overlayText="SIGN UP" />

      {/* 우측 폼 영역 */}
      <div className="relative flex h-full w-1/2 flex-col overflow-y-auto bg-white px-8 py-6">
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
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <AuthInputWithButton
                label="이메일"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (emailError) setEmailError(null)
                }}
                placeholder="example@email.com"
                autoComplete="email"
                buttonLabel="중복 확인"
                onButtonClick={handleEmailDuplicateCheck}
                buttonDisabled={!email.trim()}
                error={emailError ?? undefined}
              />

              <AuthInput
                label="닉네임"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Input nickname"
                autoComplete="username"
              />

              <AuthPasswordInput
                placeholder="Password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  resetPasswordConfirmState()
                }}
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

              <AuthButton type="submit" className="mt-2 rounded-full py-3.5 text-base">
                회원가입
              </AuthButton>
            </form>

            {/* 구분선 */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-mistSkyBlue" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-sm text-softAquaBlue font-pretendard">Or</span>
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

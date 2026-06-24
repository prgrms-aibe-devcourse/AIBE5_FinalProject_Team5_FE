import type { ReactNode } from 'react'
import LoginVisualPanel from './LoginVisualPanel.tsx'
import AuthExitButton from './AuthExitButton.tsx'

interface AuthPageLayoutProps {
  children: ReactNode
  visualOverlayText?: string
  /** 로그인·비밀번호 찾기·재설정: 폼 왼쪽 / 회원가입: 비주얼 왼쪽 */
  visualPosition?: 'left' | 'right'
}

export default function AuthPageLayout({
  children,
  visualOverlayText = 'LOGIN',
  visualPosition = 'right',
}: AuthPageLayoutProps) {
  const formPanel = (
    <div className="relative flex min-h-dvh w-full flex-1 flex-col overflow-y-auto glass-panel px-4 pb-10 pt-14 sm:px-6 md:min-h-0 md:h-full md:w-1/2 md:px-8 md:py-6">
      <div className="absolute left-4 top-4 z-10 md:left-8 md:top-6">
        <AuthExitButton />
      </div>
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        {children}
      </div>
    </div>
  )

  const visualPanel = <LoginVisualPanel overlayText={visualOverlayText} />

  return (
    <div className="flex min-h-dvh w-full flex-col overflow-x-hidden md:h-dvh md:flex-row md:overflow-hidden">
      {visualPosition === 'left' ? (
        <>
          {visualPanel}
          {formPanel}
        </>
      ) : (
        <>
          {formPanel}
          {visualPanel}
        </>
      )}
    </div>
  )
}

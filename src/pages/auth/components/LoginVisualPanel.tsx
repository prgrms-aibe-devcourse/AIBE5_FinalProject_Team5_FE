import loginSideBg from '../../../assets/bg/login_side_bg.png'

interface LoginVisualPanelProps {
  overlayText?: string
}

/** Auth 페이지 50% 사이드 배경 패널 — 모바일에서는 숨김 */
export default function LoginVisualPanel({ overlayText = 'LOGIN' }: LoginVisualPanelProps) {
  return (
    <div className="relative hidden h-dvh w-1/2 shrink-0 overflow-hidden md:block">
      {/* 사이드 이미지 배경 */}
      <img src={loginSideBg} alt=""
        className="h-full w-full object-cover object-center"
      />

      {/* 오버레이 텍스트 */}
      <div className="pointer-events-none absolute inset-x-0 top-[40%] flex justify-center">
        <span className="text-2xl tracking-[0.4em] text-white font-manrope md:text-4xl">
          {overlayText}
        </span>
      </div>
      
    </div>
  )
}

import loginSideBg from '../../../assets/bg/login_side_bg.png'

/** 로그인 우측 50% — loginSideBg cover로 사이드 영역 전체 덮기 */
export default function LoginVisualPanel() {
  return (
    <div className="relative h-dvh w-1/2 shrink-0 overflow-hidden">
      {/* 사이드 이미지 배경 */}
      <img src={loginSideBg} alt="loginSideBg"
        className="h-full w-full object-cover object-center"
      />

      {/* 로그인 텍스트 */}
      <div className="pointer-events-none absolute inset-x-0 top-[40%] flex justify-center">
        <span className="text-2xl tracking-[0.4em] text-white font-manrope md:text-4xl">
          LOGIN
        </span>
      </div>
      
    </div>
  )
}

/** 홈(/) 이동 — 좌상단 뒤로가기 */
export default function AuthExitButton() {
  return (
    <a
      href="/"
      aria-label="나가기"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-deepOceanNavy transition-colors hover:bg-foamWhite"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M15 6l-6 6 6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  )
}

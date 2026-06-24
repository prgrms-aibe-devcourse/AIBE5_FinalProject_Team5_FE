import type { InputHTMLAttributes } from 'react'

interface AuthInputWithButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  buttonLabel: string
  onButtonClick?: () => void
  buttonDisabled?: boolean
  /** 검증 실패 메시지 — 있으면 입력란 빨간 테두리 + 하단 에러 문구 */
  error?: string
  /** 검증 성공 메시지 — error가 없을 때만 하단에 표시 */
  success?: string
}

/** 체크 표시 아이콘 */
function CheckIcon({ className = 'h-[18px] w-[18px] sm:h-[22px] sm:w-[22px]' }: { className?: string }) {
  return (
    <svg className={`shrink-0 ${className}`} viewBox="0 0 22 22" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="11" fill="#5484B7" />
      <path
        d="M6.5 11.2l2.8 2.8 6.2-6.4"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** 인증 입력 폼 + 우측 액션 버튼 (이메일 중복 확인, 비밀번호 확인) */
export default function AuthInputWithButton({
  label,
  buttonLabel,
  onButtonClick,
  buttonDisabled,
  error,
  success,
  id,
  className = '',
  ...props
}: AuthInputWithButtonProps) {
  const inputId = id ?? label

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-deepOceanNavy font-pretendard">
        {label}
      </label>
      <div className="flex items-stretch gap-2">
        <input
          id={inputId}
          className={`min-w-0 flex-1 rounded-lg border bg-white px-3 py-2.5 text-sm text-deepOceanNavy placeholder:text-softAquaBlue outline-none transition-colors font-pretendard sm:px-4 sm:py-3 ${error ? 'border-red-500 focus:border-red-500' : 'border-mistSkyBlue focus:border-waterlineBlue'} ${className}`}
          {...props}
        />

        <button
          type="button"
          onClick={onButtonClick}
          disabled={buttonDisabled}
          aria-label={buttonLabel}
          className="flex shrink-0 items-center gap-1 rounded-lg border border-mistSkyBlue bg-white px-2 py-2.5 text-xs font-medium text-deepOceanNavy transition-colors hover:border-waterlineBlue disabled:cursor-not-allowed disabled:opacity-50 font-pretendard sm:gap-1.5 sm:px-3 sm:py-3 sm:text-sm"
        >
          <CheckIcon />
          <span className="whitespace-nowrap">{buttonLabel}</span>
        </button>
      </div>

      {/* 검증 실패 — 예: 이메일 형식 오류, 비밀번호 불일치 */}
      {error && <p className="text-xs text-red-500 font-pretendard" role="alert">{error}</p>}
      {/* 검증 성공 — error와 동시에 표시되지 않음 */}
      {!error && success && <p className="text-xs text-waterlineBlue font-pretendard">{success}</p>}
    </div>
  )
}

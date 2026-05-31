import type { InputHTMLAttributes, ReactNode } from 'react'

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  suffix?: ReactNode
}

/** 라벨 + 인풋 (suffix로 우측 아이콘) */
export default function AuthInput({ label, error, id, suffix, className = '', ...props }: AuthInputProps) {
  const inputId = id ?? label

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-deepOceanNavy font-pretendard">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          className={`w-full rounded-lg border border-mistSkyBlue bg-white px-4 py-3 text-sm text-deepOceanNavy placeholder:text-softAquaBlue outline-none transition-colors font-pretendard focus:border-waterlineBlue ${suffix ? 'pr-11' : ''} ${className}`}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {suffix}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 font-pretendard">{error}</p>}
    </div>
  )
}

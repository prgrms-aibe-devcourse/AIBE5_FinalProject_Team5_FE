import type { ButtonHTMLAttributes } from 'react'

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline'
  fullWidth?: boolean
}

/** Auth 주요 액션 버튼 (로그인, 회원가입) */
export default function AuthButton({
  variant = 'primary',
  fullWidth = true,
  className = '',
  type = 'button',
  children,
  ...props
}: AuthButtonProps) {
  const base =
    'rounded-lg px-4 py-2.5 text-sm font-medium transition-colors font-pretendard disabled:cursor-not-allowed disabled:opacity-50'
  const variants = {
    primary: 'bg-deepOceanNavy text-white hover:bg-waterlineBlue',
    outline: 'border border-deepOceanNavy text-deepOceanNavy hover:bg-foamWhite',
  }

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

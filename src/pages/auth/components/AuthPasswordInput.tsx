import { useState, type ChangeEventHandler } from 'react'
import AuthInput from './AuthInput'

interface AuthPasswordInputProps {
  label?: string
  placeholder?: string
  autoComplete?: string
  value?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 3l18 18M10.58 10.58A2 2 0 0012 15a2 2 0 001.42-.58M9.88 5.09A10.94 10.94 0 0112 5c5 0 9.27 3.11 11 7a11.8 11.8 0 01-2.16 3.19M6.23 6.23A11.75 11.75 0 001 12c1.73 3.89 6 7 11 7 1.28 0 2.49-.22 3.62-.62"
        stroke="#8BB4D2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
        stroke="#8BB4D2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="#8BB4D2" strokeWidth="1.5" />
    </svg>
  )
}

/** 비밀번호 입력 폼 (보기/숨기기 토글) */
export default function AuthPasswordInput({
  label = '비밀번호',
  placeholder = 'Input password',
  autoComplete = 'current-password',
  value,
  onChange,
}: AuthPasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <AuthInput
      label={label}
      type={visible ? 'text' : 'password'}
      placeholder={placeholder}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      suffix={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="pointer-events-auto text-softAquaBlue hover:text-waterlineBlue transition-colors"
          aria-label={visible ? '비밀번호 숨기기' : '비밀번호 보기'}
        >
          {visible ? <EyeIcon /> : <EyeOffIcon />}
        </button>
      }
    />
  )
}

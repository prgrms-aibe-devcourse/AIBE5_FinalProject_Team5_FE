import { useState, type FormEvent } from 'react'
import { PASSWORD_MISMATCH_MESSAGE, passwordsMatch } from '../../../../utils/validation'
import DashboardActionButton from '../DashboardActionButton'
import { scheduleInputClassName } from '../ScheduleEventForm'
import DashboardModal from './DashboardModal'

export type PasswordChangePayload = {
  currentPassword: string
  newPassword: string
}

type PasswordChangeModalProps = {
  onClose: () => void
  onSubmit: (payload: PasswordChangePayload) => void
}

type PasswordFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  autoComplete: string
}

function PasswordField({ label, value, onChange, placeholder, autoComplete }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <label className="block">
      <span className="mb-2 block font-pretendard text-sm font-semibold text-deepOceanNavy">{label}</span>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${scheduleInputClassName} pr-11`}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-secondary transition-colors hover:text-deepOceanNavy"
          aria-label={visible ? '비밀번호 숨기기' : '비밀번호 보기'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {visible ? (
              <>
                <path
                  d="M3 3l18 18M10.58 10.58A2 2 0 0012 15a2 2 0 001.42-.58M9.88 5.09A10.94 10.94 0 0112 5c5 0 9.27 3.11 11 7a11.8 11.8 0 01-2.16 3.19M6.23 6.23A11.75 11.75 0 001 12c1.73 3.89 6 7 11 7 1.28 0 2.49-.22 3.62-.62"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            ) : (
              <>
                <path
                  d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
              </>
            )}
          </svg>
        </button>
      </div>
    </label>
  )
}

export default function PasswordChangeModal({ onClose, onSubmit }: PasswordChangeModalProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!currentPassword.trim()) {
      setError('현재 비밀번호를 입력해주세요.')
      return
    }

    if (!newPassword.trim()) {
      setError('새 비밀번호를 입력해주세요.')
      return
    }

    if (!confirmPassword.trim()) {
      setError('새 비밀번호 확인을 입력해주세요.')
      return
    }

    if (!passwordsMatch(newPassword, confirmPassword)) {
      setError(PASSWORD_MISMATCH_MESSAGE)
      return
    }

    if (passwordsMatch(currentPassword, newPassword)) {
      setError('현재 비밀번호와 동일한 비밀번호는 사용할 수 없습니다.')
      return
    }

    onSubmit({
      currentPassword: currentPassword.trim(),
      newPassword: newPassword.trim(),
    })
  }

  return (
    <DashboardModal
      title="비밀번호 변경"
      onClose={onClose}
      maxWidthClass="max-w-md"
      ariaLabelledBy="password-change-modal-title"
      footer={
        <div className="flex justify-end gap-3">
          <DashboardActionButton label="취소" variant="secondary" onClick={onClose} />
          <DashboardActionButton label="변경" type="submit" form="password-change-form" />
        </div>
      }
    >
      <form id="password-change-form" className="space-y-4" onSubmit={handleSubmit}>
        <PasswordField
          label="현재 비밀번호"
          value={currentPassword}
          onChange={(value) => {
            setCurrentPassword(value)
            setError('')
          }}
          placeholder="현재 비밀번호를 입력해주세요"
          autoComplete="current-password"
        />

        <PasswordField
          label="새 비밀번호"
          value={newPassword}
          onChange={(value) => {
            setNewPassword(value)
            setError('')
          }}
          placeholder="새 비밀번호를 입력해주세요"
          autoComplete="new-password"
        />

        <PasswordField
          label="새 비밀번호 확인"
          value={confirmPassword}
          onChange={(value) => {
            setConfirmPassword(value)
            setError('')
          }}
          placeholder="새 비밀번호를 다시 입력해주세요"
          autoComplete="new-password"
        />

        {error ? <p className="font-pretendard text-xs font-medium text-red-600">{error}</p> : null}
      </form>
    </DashboardModal>
  )
}

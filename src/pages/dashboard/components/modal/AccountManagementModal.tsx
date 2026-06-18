import DashboardModal from './DashboardModal'

type AccountManagementModalProps = {
  onClose: () => void
  isLocalAccount: boolean
  onChangePassword: () => void
  onWithdraw: () => void
}

type AccountActionRowProps = {
  title: string
  description: string
  onClick: () => void
  danger?: boolean
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AccountActionRow({ title, description, onClick, danger = false }: AccountActionRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left font-pretendard transition-colors ${
        danger
          ? 'border-red-200/80 bg-white/55 text-red-600 hover:border-red-300 hover:bg-red-50/60'
          : 'border-mistSkyBlue/45 bg-white/55 text-deepOceanNavy hover:border-waterlineBlue/45 hover:bg-white/70'
      }`}
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{title}</span>
        <span className={`mt-0.5 block text-xs leading-relaxed ${danger ? 'text-red-500/80' : 'text-secondary'}`}>
          {description}
        </span>
      </span>
      <ChevronRightIcon />
    </button>
  )
}

export default function AccountManagementModal({
  onClose,
  isLocalAccount,
  onChangePassword,
  onWithdraw,
}: AccountManagementModalProps) {
  return (
    <DashboardModal
      title="계정 관리"
      onClose={onClose}
      maxWidthClass="max-w-md"
      ariaLabelledBy="account-management-modal-title"
    >
      <div className="space-y-2">
        {isLocalAccount ? (
          <AccountActionRow
            title="비밀번호 변경"
            description="로그인에 사용하는 비밀번호를 변경합니다."
            onClick={onChangePassword}
          />
        ) : null}
        <AccountActionRow
          title="회원 탈퇴"
          description="탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다."
          onClick={onWithdraw}
          danger
        />
      </div>
    </DashboardModal>
  )
}

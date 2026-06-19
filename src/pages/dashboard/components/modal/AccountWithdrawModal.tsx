import DashboardActionButton from '../DashboardActionButton'
import DashboardModal from './DashboardModal'

type AccountWithdrawModalProps = {
  onClose: () => void
  onConfirm: () => void
  isWithdrawing?: boolean
}

export default function AccountWithdrawModal({
  onClose,
  onConfirm,
  isWithdrawing = false,
}: AccountWithdrawModalProps) {
  return (
    <DashboardModal
      title="회원 탈퇴"
      onClose={onClose}
      maxWidthClass="max-w-md"
      ariaLabelledBy="account-withdraw-modal-title"
      footer={
        <div className="flex justify-end gap-3">
          <DashboardActionButton label="취소" variant="secondary" onClick={onClose} disabled={isWithdrawing} />
          <DashboardActionButton
            label={isWithdrawing ? '탈퇴 처리 중...' : '탈퇴하기'}
            onClick={onConfirm}
            disabled={isWithdrawing}
            className="!border-[#CA3838] !bg-[#CA3838] !text-white !shadow-none hover:!border-[#B52F2F] hover:!bg-[#B52F2F]"
          />
        </div>
      }
    >
      <div className="space-y-3 font-pretendard">
        <p className="text-sm leading-relaxed text-deepOceanNavy">
          정말 <span className="font-semibold">회원 탈퇴</span>를 진행할까요?
        </p>
        <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-secondary">
          <li>스크랩, 일정, 작성 글 등 모든 활동 데이터가 삭제됩니다.</li>
          <li>탈퇴 후에는 계정과 데이터를 복구할 수 없습니다.</li>
        </ul>
      </div>
    </DashboardModal>
  )
}

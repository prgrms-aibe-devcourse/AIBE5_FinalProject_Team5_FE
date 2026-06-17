import DashboardActionButton from '../DashboardActionButton'
import DashboardModal from './DashboardModal'

type DeleteConfirmModalProps = {
  targetTitle: string
  targetLabel: string
  onClose: () => void
  onConfirm: () => void
  isDeleting?: boolean
}

export default function DeleteConfirmModal({
  targetTitle,
  targetLabel,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmModalProps) {
  return (
    <DashboardModal
      title="삭제 확인"
      onClose={onClose}
      maxWidthClass="max-w-md"
      ariaLabelledBy="delete-confirm-modal-title"
      footer={
        <div className="flex justify-end gap-3">
          <DashboardActionButton label="취소" variant="secondary" onClick={onClose} disabled={isDeleting} />
          <DashboardActionButton
            label={isDeleting ? '삭제 중...' : '삭제'}
            onClick={onConfirm}
            disabled={isDeleting}
            className="!border-[#CA3838] !bg-[#CA3838] !text-white !shadow-none hover:!border-[#B52F2F] hover:!bg-[#B52F2F]"
          />
        </div>
      }
    >
      <div className="space-y-3 font-pretendard">
        <p className="line-clamp-2 text-sm leading-relaxed text-deepOceanNavy">
          <span className="font-semibold">{targetTitle}</span> 이 {targetLabel}을 삭제할까요?
        </p>
        <p className="text-xs leading-relaxed text-red-700">
          삭제 후에는 복구할 수 없습니다. 삭제하기 전에 내용을 다시 한번 확인해 주세요.
        </p>
      </div>
    </DashboardModal>
  )
}

import DashboardActionButton from '../DashboardActionButton'
import DashboardModal from './DashboardModal'

type DeleteConfirmModalProps = {
  targetTitle: string
  targetLabel: string
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteConfirmModal({
  targetTitle,
  targetLabel,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <DashboardModal
      title="삭제"
      onClose={onClose}
      maxWidthClass="max-w-md"
      ariaLabelledBy="delete-confirm-modal-title"
      footer={
        <div className="flex justify-end gap-3">
          <DashboardActionButton label="취소" variant="secondary" onClick={onClose} />
          <DashboardActionButton
            label="삭제"
            onClick={onConfirm}
            className="!border-red-600 !bg-red-600 !text-white hover:!border-red-700 hover:!bg-red-700"
          />
        </div>
      }
    >
      <div className="space-y-4">
        <p className="font-pretendard text-sm leading-relaxed text-deepOceanNavy">
          <span className="font-semibold">{targetTitle}</span> {targetLabel}을 삭제하시겠습니까?
        </p>

        <p className="rounded-xl border border-red-200/80 bg-red-50/80 px-4 py-3 font-pretendard text-xs leading-relaxed text-red-700">
          삭제 후에는 복구할 수 없습니다. 삭제하기 전에 내용을 다시 한번 확인해 주세요.
        </p>
      </div>
    </DashboardModal>
  )
}

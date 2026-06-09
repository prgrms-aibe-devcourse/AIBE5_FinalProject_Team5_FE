import { useState } from 'react'
import DashboardActionButton from '../DashboardActionButton'
import DashboardModal from './DashboardModal'
import { scheduleInputClassName } from '../ScheduleEventForm'

export type InquiryWritePayload = {
  title: string
  content: string
}

type InquiryWriteModalProps = {
  onClose: () => void
  onSubmit: (payload: InquiryWritePayload) => void
}

export default function InquiryWriteModal({ onClose, onSubmit }: InquiryWriteModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!title.trim()) {
      setError('문의 제목을 입력해주세요.')
      return
    }

    if (!content.trim()) {
      setError('문의 내용을 입력해주세요.')
      return
    }

    onSubmit({ title: title.trim(), content: content.trim() })
  }

  return (
    <DashboardModal
      title="문의하기"
      onClose={onClose}
      maxWidthClass="max-w-xl"
      ariaLabelledBy="inquiry-write-modal-title"
      footer={
        <div className="flex justify-end gap-3">
          <DashboardActionButton label="취소" variant="secondary" onClick={onClose} />
          <DashboardActionButton label="등록" onClick={handleSubmit} />
        </div>
      }
    >
      <div className="space-y-4">
        <p className="rounded-xl border border-mistSkyBlue/35 bg-foamWhite/80 px-4 py-3 font-pretendard text-xs leading-relaxed text-secondary">
          등록된 문의는 수정할 수 없습니다. 내용을 확인한 뒤 등록해 주세요.
        </p>

        <label className="block">
          <span className="mb-2 block font-pretendard text-sm font-semibold text-deepOceanNavy">제목</span>
          <input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value)
              setError('')
            }}
            className={scheduleInputClassName}
            placeholder="문의 제목을 입력해주세요"
          />
        </label>

        <label className="block">
          <span className="mb-2 block font-pretendard text-sm font-semibold text-deepOceanNavy">내용</span>
          <textarea
            value={content}
            onChange={(event) => {
              setContent(event.target.value)
              setError('')
            }}
            rows={6}
            className={`${scheduleInputClassName} min-h-[9rem] resize-y`}
            placeholder="문의 내용을 입력해주세요"
          />
        </label>

        {error ? <p className="font-pretendard text-xs font-medium text-red-600">{error}</p> : null}
      </div>
    </DashboardModal>
  )
}

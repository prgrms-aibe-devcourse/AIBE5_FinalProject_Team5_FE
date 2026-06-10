import { useEffect, useState } from 'react'
import { createReport, REPORT_REASON_OPTIONS, type ReportTargetType } from '../../services/report'

const TARGET_TYPE_LABEL: Record<ReportTargetType, string> = {
  REVIEW: '리뷰',
  POST: '게시글',
  COMMENT: '댓글',
}

type ReportModalProps = {
  targetType: ReportTargetType
  targetId: number
  onClose: () => void
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function ReportModal({ targetType, targetId, onClose }: ReportModalProps) {
  const [reason, setReason] = useState('')
  const [detail, setDetail] = useState('')
  const [status, setStatus] = useState<SubmitStatus>('idle')

  const canSubmit = reason !== '' && detail.trim().length > 0 && status === 'idle'

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleSubmit = async () => {
    if (!canSubmit) return
    setStatus('submitting')
    try {
      await createReport({ targetType, targetId, reason, detail: detail.trim() })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-deepOceanNavy/45 px-4 py-6"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-mistSkyBlue/50 bg-white shadow-[0_18px_50px_rgba(36,57,84,0.28)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="shrink-0 border-b border-mistSkyBlue/45 bg-gradient-to-r from-mistSkyBlue/55 via-softAquaBlue/40 to-waterlineBlue/20 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <h2
              id="report-modal-title"
              className="font-pretendard text-xl font-bold text-deepOceanNavy"
            >
              {TARGET_TYPE_LABEL[targetType]} 신고
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-secondary transition-colors hover:bg-white/80 hover:text-deepOceanNavy"
              aria-label="닫기"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 바디 */}
        {status === 'success' ? (
          <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ecfdf5]">
              <svg
                className="h-7 w-7 text-[#16a34a]"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="font-pretendard text-base font-semibold text-deepOceanNavy">
              신고가 접수되었습니다.
            </p>
            <p className="font-pretendard text-sm text-secondary">
              검토 후 적절한 조치를 취하겠습니다.
            </p>
          </div>
        ) : (
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6">
            {/* 신고 사유 선택 */}
            <div>
              <label
                htmlFor="report-reason"
                className="font-pretendard text-sm font-bold text-deepOceanNavy"
              >
                신고 사유 <span className="text-[#dc2626]">*</span>
              </label>
              <select
                id="report-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-2 w-full rounded-xl border border-mistSkyBlue/45 bg-white px-3 py-2.5 font-pretendard text-sm text-deepOceanNavy outline-none transition-colors focus:border-waterlineBlue"
              >
                <option value="">사유를 선택해 주세요</option>
                {REPORT_REASON_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* 상세 내용 */}
            <div>
              <label
                htmlFor="report-detail"
                className="font-pretendard text-sm font-bold text-deepOceanNavy"
              >
                상세 내용 <span className="text-[#dc2626]">*</span>
              </label>
              <textarea
                id="report-detail"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="신고 내용을 구체적으로 입력해 주세요."
                rows={4}
                className="mt-2 w-full resize-none rounded-xl border border-mistSkyBlue/45 bg-white px-3 py-2.5 font-pretendard text-sm leading-relaxed text-deepOceanNavy outline-none transition-colors placeholder:text-softAquaBlue focus:border-waterlineBlue"
              />
            </div>

            {status === 'error' ? (
              <p className="font-pretendard text-sm text-[#dc2626]">
                신고 제출에 실패했습니다. 다시 시도해 주세요.
              </p>
            ) : null}
          </div>
        )}

        {/* 푸터 */}
        <div className="shrink-0 border-t border-mistSkyBlue/45 px-6 py-4">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded border border-mistSkyBlue/60 bg-white px-5 py-2.5 font-pretendard text-sm font-semibold text-secondary transition-colors hover:border-waterlineBlue hover:bg-foamWhite/60 hover:text-deepOceanNavy"
            >
              {status === 'success' ? '닫기' : '취소'}
            </button>
            {status !== 'success' ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="inline-flex items-center justify-center rounded border border-deepOceanNavy bg-deepOceanNavy px-5 py-2.5 font-pretendard text-sm font-semibold text-white shadow-sm transition-colors hover:border-waterlineBlue hover:bg-waterlineBlue disabled:cursor-not-allowed disabled:opacity-40"
              >
                {status === 'submitting' ? '제출 중...' : '신고하기'}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

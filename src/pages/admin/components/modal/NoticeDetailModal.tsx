import { useEffect } from 'react'
import type { AdminNoticeResponse } from '../../../../services/notice'
import { formatRequestedDate } from '../../../../utils/formatRequestedDate'

type NoticeDetailModalProps = {
  notice: AdminNoticeResponse
  onClose: () => void
  onDelete?: (id: number) => void
}

export default function NoticeDetailModal({ notice, onClose, onDelete }: NoticeDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleDelete = () => {
    if (window.confirm('정말로 이 공지를 삭제하시겠습니까?')) {
      onDelete?.(notice.id)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-deepOceanNavy/45 px-4 py-6"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-mistSkyBlue/50 bg-white shadow-[0_18px_50px_rgba(36,57,84,0.28)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notice-detail-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="shrink-0 border-b border-mistSkyBlue/45 bg-gradient-to-r from-mistSkyBlue/55 via-softAquaBlue/40 to-waterlineBlue/20 px-6 py-5 md:px-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h2
                id="notice-detail-title"
                className="font-pretendard text-xl font-bold text-deepOceanNavy md:text-2xl"
              >
                공지 상세
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-pretendard text-sm text-secondary">
                <span>{formatRequestedDate(notice.sentAt)} 발송</span>
                <span className="hidden text-mistSkyBlue sm:inline" aria-hidden="true">
                  ·
                </span>
                <span>발송자 {notice.senderNickname || notice.sentBy}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-secondary transition-colors hover:bg-white/80 hover:text-deepOceanNavy"
              aria-label="닫기"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6 md:px-7">
          <div>
            <p className="font-pretendard text-xs font-semibold uppercase tracking-wide text-secondary">제목</p>
            <p className="mt-2 font-pretendard text-base font-bold text-deepOceanNavy">{notice.title}</p>
          </div>

          <div>
            <p className="font-pretendard text-xs font-semibold uppercase tracking-wide text-secondary">내용</p>
            <div className="mt-2 rounded-2xl border border-mistSkyBlue/45 bg-foamWhite/30 px-5 py-4">
              <p className="whitespace-pre-wrap font-pretendard text-sm leading-relaxed text-primary/90">
                {notice.content}
              </p>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-mistSkyBlue/45 bg-white px-6 py-4 md:px-7">
          <div className="flex justify-between items-center">
            {onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center justify-center rounded border border-rose-200 bg-rose-50 px-5 py-2.5 font-pretendard text-sm font-semibold text-rose-600 transition-colors hover:border-rose-300 hover:bg-rose-100 hover:text-rose-700"
              >
                삭제
              </button>
            ) : (
              <div />
            )}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded border border-mistSkyBlue/60 bg-white px-5 py-2.5 font-pretendard text-sm font-semibold text-secondary transition-colors hover:border-waterlineBlue hover:bg-foamWhite/60 hover:text-deepOceanNavy"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

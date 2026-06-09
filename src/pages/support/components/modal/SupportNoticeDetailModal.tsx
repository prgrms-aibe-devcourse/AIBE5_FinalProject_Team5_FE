import { useEffect } from 'react'
import type { SupportNotice } from '../../data/supportData'

type SupportNoticeDetailModalProps = {
  notice: SupportNotice
  onClose: () => void
}

// 고객센터 - 공지사항 상세 모달
export default function SupportNoticeDetailModal({ notice, onClose }: SupportNoticeDetailModalProps) {
  useEffect(() => { // 모달 닫기 이벤트 핸들러
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-deepOceanNavy/45 px-4 py-6"
      role="presentation"
      onClick={onClose}
    >
      {/* 모달 컨테이너 */}
      <div
        className="flex h-[min(560px,90vh)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl glass-modal border border-mistSkyBlue/50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-notice-detail-title"
        onClick={(event) => event.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="shrink-0 border-b border-mistSkyBlue/45 bg-gradient-to-r from-mistSkyBlue/55 via-softAquaBlue/40 to-waterlineBlue/20 px-6 py-5 md:px-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="font-pretendard text-xs text-secondary">{notice.postedAt}</p>
              <h2
                id="support-notice-detail-title"
                className="mt-2 font-pretendard text-xl font-bold leading-snug text-deepOceanNavy md:text-2xl"
              >
                {notice.title}
              </h2>
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

        {/* 공지사항 내용 */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 md:px-7">
          <div className="rounded-2xl border border-mistSkyBlue/45 bg-foamWhite/30 px-5 py-4">
            <p className="whitespace-pre-wrap font-pretendard text-sm leading-[1.8] text-primary/90">{notice.content}</p>
          </div>
        </div>

        {/* 확인 버튼 */}
        <div className="flex shrink-0 justify-end border-t border-mistSkyBlue/45 bg-white px-6 py-4 md:px-7">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded border border-mistSkyBlue/60 bg-white px-5 py-2.5 font-pretendard text-sm font-semibold text-secondary transition-colors hover:border-waterlineBlue hover:bg-foamWhite/60 hover:text-deepOceanNavy"
          >
            확인
          </button>
        </div>

      </div>
    </div>
  )
}

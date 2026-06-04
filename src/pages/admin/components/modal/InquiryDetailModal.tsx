import { useEffect, useState } from 'react'
import type { Inquiry } from '../../AdminInquiriesPage'
import { formatRequestedDate } from '../../../../utils/formatRequestedDate'
import InquiryStatusBadge from '../inquiry/InquiryStatusBadge'

type FooterMode = 'idle' | 'complete_confirm'

type InquiryDetailModalProps = {
  inquiry: Inquiry // 모달 요청
  onClose: () => void // 모달 닫기
  onComplete: (id: number, reply: string) => void // 모달 답변 등록
}

// 관리자 문의 상세 모달 (문의 상세 조회, 답변 등록)
export default function InquiryDetailModal({ inquiry, onClose, onComplete }: InquiryDetailModalProps) {
  const isPending = inquiry.status === 'PENDING'
  const [footerMode, setFooterMode] = useState<FooterMode>('idle')
  const [reply, setReply] = useState('')

  useEffect(() => {
    setFooterMode('idle')
    setReply('')
  }, [inquiry.id])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleSubmitReply = () => {
    if (!reply.trim()) return
    onComplete(inquiry.id, reply.trim())
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
        aria-labelledby="inquiry-detail-title"
        onClick={(event) => event.stopPropagation()} 
      >
        {/* 모달 헤더 영역 (문의 상세 제목, 상태) */}
        <div className="shrink-0 border-b border-mistSkyBlue/45 bg-gradient-to-r from-mistSkyBlue/55 via-softAquaBlue/40 to-waterlineBlue/20 px-6 py-5 md:px-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 id="inquiry-detail-title" className="font-pretendard text-xl font-bold text-deepOceanNavy md:text-2xl">
                  문의 상세
                </h2>
                <InquiryStatusBadge status={inquiry.status} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-pretendard text-sm">
                <span className="inline-flex items-center gap-2 font-semibold text-deepOceanNavy">
                  <span
                    className="block h-9 w-9 shrink-0 rounded-full bg-[#f8fafc] bg-cover bg-center ring-1 ring-mistSkyBlue/45"
                    style={
                      inquiry.profileImageUrl ? { backgroundImage: `url(${inquiry.profileImageUrl})` } : undefined
                    }
                    aria-hidden="true"
                  />
                  {inquiry.userName}
                </span>
                <span className="hidden text-mistSkyBlue sm:inline" aria-hidden="true">
                  ·
                </span>
                <span className="text-secondary">{formatRequestedDate(inquiry.requestedAt)} 문의</span>
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

        {/* 모달 본문 영역 (문의 제목, 문의 본문, 관리자 답변) */}
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6 md:px-7">
          <div>
            <p className="font-pretendard text-xs font-semibold uppercase tracking-wide text-secondary">문의 제목</p>
            <p className="mt-2 font-pretendard text-base font-bold text-deepOceanNavy">{inquiry.title}</p>
          </div>

          <div>
            <p className="font-pretendard text-xs font-semibold uppercase tracking-wide text-secondary">문의 상세</p>
            <div className="mt-2 rounded-2xl border border-mistSkyBlue/45 bg-foamWhite/30 px-5 py-4">
              <p className="whitespace-pre-wrap font-pretendard text-sm leading-relaxed text-primary/90">
                {inquiry.content}
              </p>
            </div>
          </div>

          {/* 관리자 답변 입력 영역 (대기 상태) */}
          {isPending ? ( 
            <div>
              <label htmlFor="inquiry-admin-reply" className="font-pretendard text-xs font-semibold uppercase tracking-wide text-secondary">
                관리자 답변
              </label>
              <textarea
                id="inquiry-admin-reply"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="사용자에게 전달할 답변을 입력해 주세요."
                rows={5}
                className="mt-2 w-full resize-none rounded-xl border border-mistSkyBlue/60 bg-white px-4 py-3 font-pretendard text-sm text-deepOceanNavy outline-none transition-colors placeholder:text-secondary/60 focus:border-waterlineBlue focus:ring-2 focus:ring-waterlineBlue/20"
              />
            </div>
          ) : null}
  
          {/* 관리자 답변 영역 (승인 상태) */}
          {!isPending && inquiry.adminReply ? (
            <div>
              <p className="font-pretendard text-xs font-semibold uppercase tracking-wide text-secondary">관리자 답변</p>
              <div className="mt-2 rounded-2xl border border-mistSkyBlue/45 bg-[#eef4fa]/40 px-5 py-4">
                <p className="whitespace-pre-wrap font-pretendard text-sm leading-relaxed text-deepOceanNavy">
                  {inquiry.adminReply}
                </p>
              </div>
            </div>
          ) : null}
        </div>
        
        {/* 모달 푸터 영역 (닫기, 답변 등록, 완료 처리) */}
        <div className="shrink-0 border-t border-mistSkyBlue/45 bg-white">
          {isPending && footerMode === 'complete_confirm' ? (
            <div className="border-b border-[#bbf7d0] bg-[#ecfdf5] px-6 py-4 md:px-7">
              <p className="font-pretendard text-sm font-semibold text-[#166534]">답변을 등록하고 완료 처리하시겠습니까?</p>
              <p className="mt-1 font-pretendard text-xs text-[#15803d]">완료 후에는 문의 상태가 완료로 변경됩니다.</p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3 px-6 py-4 md:px-7">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded border border-mistSkyBlue/60 bg-white px-5 py-2.5 font-pretendard text-sm font-semibold text-secondary transition-colors hover:border-waterlineBlue hover:bg-foamWhite/60 hover:text-deepOceanNavy"
            >
              닫기
            </button>
            <div className="flex-1" />

            {isPending && footerMode === 'idle' ? (
              <button
                type="button"
                onClick={() => setFooterMode('complete_confirm')}
                disabled={!reply.trim()}
                className="inline-flex items-center justify-center rounded border border-deepOceanNavy bg-deepOceanNavy px-5 py-2.5 font-pretendard text-sm font-semibold text-white shadow-sm transition-colors hover:border-waterlineBlue hover:bg-waterlineBlue disabled:cursor-not-allowed disabled:opacity-40"
              >
                답변 등록
              </button>
            ) : null}

            {isPending && footerMode === 'complete_confirm' ? (
              <>
                <button
                  type="button"
                  onClick={() => setFooterMode('idle')}
                  className="inline-flex items-center justify-center rounded border border-mistSkyBlue/60 bg-white px-5 py-2.5 font-pretendard text-sm font-semibold text-secondary transition-colors hover:bg-foamWhite/60 hover:text-deepOceanNavy"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSubmitReply}
                  className="inline-flex items-center justify-center rounded border border-deepOceanNavy bg-deepOceanNavy px-5 py-2.5 font-pretendard text-sm font-semibold text-white shadow-sm transition-colors hover:border-waterlineBlue hover:bg-waterlineBlue"
                >
                  완료 처리
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

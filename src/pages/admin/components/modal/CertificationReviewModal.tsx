import { useEffect, useMemo, useState } from 'react'
import type { CertificationRequest } from '../../AdminCertificationsPage'
import { formatRequestedDate } from '../../../../utils/formatRequestedDate'
import StatusBadge from '../certification/StatusBadge'
import { certificationIconProps } from '../certification/certificationIcons'
import DocumentPreview from './DocumentPreview'

type FooterMode = 'idle' | 'reject' | 'approve_confirm'

type CertificationReviewModalProps = {
  request: CertificationRequest // 모달 요청
  onClose: () => void // 모달 닫기
  onApprove: (id: number) => void // 모달 승인
  onReject: (id: number, reason: string) => void // 모달 반려
}

// 관리자 인증 관리 요청 리스트 모달
export default function CertificationReviewModal({
  request, // 모달 요청
  onClose, // 모달 닫기
  onApprove, // 모달 승인
  onReject, // 모달 반려
}: CertificationReviewModalProps) {
  const isPending = request.status === 'PENDING'
  const [selectedDocId, setSelectedDocId] = useState<number | null>(request.documents[0]?.id ?? null)
  const [footerMode, setFooterMode] = useState<FooterMode>('idle')
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    setSelectedDocId(request.documents[0]?.id ?? null)
    setFooterMode('idle')
    setRejectReason('')
  }, [request.id, request.documents])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const selectedDocument = useMemo(
    () => request.documents.find((doc) => doc.id === selectedDocId) ?? request.documents[0] ?? null,
    [request.documents, selectedDocId],
  )

  const resetFooter = () => {
    setFooterMode('idle')
    setRejectReason('')
  }

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) return
    onReject(request.id, rejectReason.trim())
  }

  const handleConfirmApprove = () => {
    onApprove(request.id)
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-deepOceanNavy/45 px-4 py-6"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-mistSkyBlue/50 bg-white shadow-[0_18px_50px_rgba(36,57,84,0.28)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cert-review-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="shrink-0 border-b border-mistSkyBlue/45 bg-gradient-to-r from-mistSkyBlue/55 via-softAquaBlue/40 to-waterlineBlue/20 px-6 py-5 md:px-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 id="cert-review-title" className="font-pretendard text-xl font-bold text-deepOceanNavy md:text-2xl">
                  증빙서류 열람
                </h2>
                <StatusBadge status={request.status} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-pretendard text-sm">
                <span className="inline-flex items-center gap-2 font-semibold text-deepOceanNavy">
                  <span
                    className="block h-9 w-9 shrink-0 rounded-full bg-[#f8fafc] bg-cover bg-center ring-1 ring-mistSkyBlue/45"
                    aria-hidden="true"
                  />
                  {request.userName}
                </span>
                <span className="hidden text-mistSkyBlue sm:inline" aria-hidden="true">
                  ·
                </span>
                <span className="text-secondary">{request.courseName}</span>
              </div>
              <p className="mt-2 font-pretendard text-xs text-secondary/80">
                요청일 {formatRequestedDate(request.requestedAt)}
              </p>
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

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <aside className="flex w-72 shrink-0 flex-col border-r border-mistSkyBlue/45 bg-foamWhite/30">
            <p className="border-b border-mistSkyBlue/35 px-5 py-3.5 font-pretendard text-xs font-semibold uppercase tracking-wide text-secondary">
              첨부 파일 ({request.documents.length})
            </p>
            <ul className="flex-1 space-y-1.5 overflow-y-auto p-3">
              {request.documents.map((doc) => {
                const isSelected = selectedDocument?.id === doc.id

                return (
                  <li key={doc.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedDocId(doc.id)}
                      className={`w-full rounded-xl px-3 py-3 text-left transition-all ${
                        isSelected
                          ? 'bg-white shadow-[0_2px_8px_rgba(52,74,100,0.08)] ring-1 ring-waterlineBlue/35'
                          : 'hover:bg-white/70 hover:ring-1 hover:ring-mistSkyBlue/40'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                            isSelected
                              ? 'bg-gradient-to-br from-foamWhite to-mistSkyBlue/50 text-waterlineBlue ring-1 ring-mistSkyBlue/50'
                              : 'bg-white text-secondary ring-1 ring-mistSkyBlue/35'
                          }`}
                        >
                          <svg {...certificationIconProps}>
                            <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <path d="M14 3v5h5" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p
                            className={`truncate font-pretendard text-sm ${
                              isSelected ? 'font-semibold text-deepOceanNavy' : 'font-medium text-primary/90'
                            }`}
                          >
                            {doc.name}
                          </p>
                          <p className="mt-0.5 font-pretendard text-[11px] text-secondary/80">
                            {formatRequestedDate(doc.uploadedAt)}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          </aside>

          {/* 증빙서류 미리보기 영역 */}
          <div className="min-w-0 flex-1 overflow-hidden bg-white">
            {selectedDocument ? (
              <DocumentPreview document={selectedDocument} />
            ) : (
              <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-2 font-pretendard text-sm text-secondary">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foamWhite text-waterlineBlue ring-1 ring-mistSkyBlue/50">
                  <svg {...certificationIconProps} width={22} height={22}>
                    <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 3v5h5" />
                  </svg>
                </div>
                선택된 파일이 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* 반려 사유 영역 */}
        {request.status === 'REJECTED' && request.rejectReason ? (
          <div className="shrink-0 border-b border-red-200/80 bg-red-50/70 px-6 py-4 md:px-7">
            <p className="font-pretendard text-xs font-semibold uppercase tracking-wide text-[#991b1b]">반려 사유</p>
            <p className="mt-2 font-pretendard text-sm leading-relaxed text-[#7f1d1d]">{request.rejectReason}</p>
          </div>
        ) : null}

        {/* 반려 사유 입력 영역 */}
        <div className="shrink-0 border-t border-mistSkyBlue/45 bg-white">
          {isPending && footerMode === 'reject' ? (
            <div className="border-b border-red-200/80 bg-red-50/80 px-6 py-4 md:px-7">
              <label htmlFor="reject-reason" className="font-pretendard text-sm font-semibold text-[#991b1b]">
                반려 사유
              </label>
              <p className="mt-1 font-pretendard text-xs text-[#b91c1c]/90">
                사용자에게 전달될 반려 사유를 입력해 주세요.
              </p>
              <textarea
                id="reject-reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="예) 제출하신 수료증명서의 과정명이 일치하지 않습니다."
                rows={3}
                className="mt-3 w-full resize-none rounded-xl border border-red-200 bg-white px-4 py-3 font-pretendard text-sm text-deepOceanNavy outline-none transition-colors placeholder:text-secondary/60 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100"
              />
            </div>
          ) : null}

          {/* 승인 확인 영역 */}
          {isPending && footerMode === 'approve_confirm' ? (
            <div className="border-b border-[#bbf7d0] bg-[#ecfdf5] px-6 py-4 md:px-7">
              <p className="font-pretendard text-sm font-semibold text-[#166534]">인증 요청을 승인하시겠습니까?</p>
              <p className="mt-1 font-pretendard text-xs text-[#15803d]">
                승인 후에는 해당 사용자의 수강 인증이 완료 처리됩니다.
              </p>
            </div>
          ) : null}

          {/* 모달 푸터 영역 (닫기, 승인, 반려 버튼) */}
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
              <>
                <button
                  type="button"
                  onClick={() => setFooterMode('reject')}
                  className="inline-flex items-center justify-center rounded border border-red-200 bg-red-50 px-5 py-2.5 font-pretendard text-sm font-semibold text-[#b91c1c] transition-colors hover:border-red-300 hover:bg-red-100"
                >
                  반려
                </button>
                <button
                  type="button"
                  onClick={() => setFooterMode('approve_confirm')}
                  className="inline-flex items-center justify-center rounded border border-deepOceanNavy bg-deepOceanNavy px-5 py-2.5 font-pretendard text-sm font-semibold text-white shadow-sm transition-colors hover:border-waterlineBlue hover:bg-waterlineBlue"
                >
                  승인
                </button>
              </>
            ) : null}

            {/* 반려 확인 영역 */}
            {isPending && footerMode === 'reject' ? (
              <>
                <button
                  type="button"
                  onClick={resetFooter}
                  className="inline-flex items-center justify-center rounded border border-mistSkyBlue/60 bg-white px-5 py-2.5 font-pretendard text-sm font-semibold text-secondary transition-colors hover:bg-foamWhite/60 hover:text-deepOceanNavy"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  disabled={!rejectReason.trim()}
                  className="inline-flex items-center justify-center rounded border border-[#dc2626] bg-[#dc2626] px-5 py-2.5 font-pretendard text-sm font-semibold text-white transition-colors hover:bg-[#b91c1c] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  반려 처리
                </button>
              </>
            ) : null}
    
            {/* 승인 확인 영역 */}  
            {isPending && footerMode === 'approve_confirm' ? (
              <>
                <button
                  type="button"
                  onClick={resetFooter}
                  className="inline-flex items-center justify-center rounded border border-mistSkyBlue/60 bg-white px-5 py-2.5 font-pretendard text-sm font-semibold text-secondary transition-colors hover:bg-foamWhite/60 hover:text-deepOceanNavy"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleConfirmApprove}
                  className="inline-flex items-center justify-center rounded border border-deepOceanNavy bg-deepOceanNavy px-5 py-2.5 font-pretendard text-sm font-semibold text-white shadow-sm transition-colors hover:border-waterlineBlue hover:bg-waterlineBlue"
                >
                  승인하기
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

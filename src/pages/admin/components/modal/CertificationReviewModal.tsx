import { useCallback, useEffect, useMemo, useState } from 'react'
import CertificationEvidencePreview from '../../../dashboard/components/modal/CertificationEvidencePreview'
import {
  EvidenceThumbnailPlaceholder,
  truncateFileName,
} from '../../../dashboard/components/modal/certificationEvidenceUi'
import { getCertificationDocumentLabel } from '../../../dashboard/data/certifications'
import { ApiError } from '../../../../services/ApiError'
import {
  approveAdminVerification,
  getAdminVerificationDetail,
  getAdminVerificationEvidence,
  rejectAdminVerification,
  type AdminCertificationDetail,
} from '../../../../services/verification'
import { formatRequestedDate } from '../../../../utils/formatRequestedDate'
import StatusBadge from '../certification/StatusBadge'

type FooterMode = 'idle' | 'reject' | 'approve_confirm'

type CertificationReviewModalProps = {
  verificationId: number
  onClose: () => void
  onProcessed: () => void
}

function CertificationDetailSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 overflow-hidden" aria-hidden="true">
      <aside className="flex w-72 shrink-0 animate-pulse flex-col border-r border-mistSkyBlue/45 bg-foamWhite/30 p-3">
        <div className="mb-3 h-4 w-24 rounded bg-mistSkyBlue/30" />
        <div className="space-y-2">
          <div className="h-16 rounded-xl bg-mistSkyBlue/25" />
          <div className="h-16 rounded-xl bg-mistSkyBlue/25" />
        </div>
      </aside>
      <div className="min-w-0 flex-1 animate-pulse bg-foamWhite/20 p-8">
        <div className="mx-auto h-full max-w-2xl rounded-2xl border border-dashed border-mistSkyBlue/50 bg-white" />
      </div>
    </div>
  )
}

export default function CertificationReviewModal({
  verificationId,
  onClose,
  onProcessed,
}: CertificationReviewModalProps) {
  const [request, setRequest] = useState<AdminCertificationDetail | null>(null)
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [footerMode, setFooterMode] = useState<FooterMode>('idle')
  const [rejectReason, setRejectReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const loadDetail = useCallback(() => {
    setIsLoading(true)
    setError(null)
    setFooterMode('idle')
    setRejectReason('')

    getAdminVerificationDetail(verificationId)
      .then((data) => {
        setRequest(data)
        setSelectedDocId(data.documents[0]?.id ?? null)
      })
      .catch((err: unknown) => {
        setRequest(null)
        setSelectedDocId(null)
        setError(
          err instanceof ApiError ? err.message : '인증 상세 정보를 불러오는 중 오류가 발생했습니다.',
        )
      })
      .finally(() => setIsLoading(false))
  }, [verificationId])

  useEffect(() => {
    loadDetail()
  }, [loadDetail])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const selectedDocument = useMemo(
    () => request?.documents.find((doc) => doc.id === selectedDocId) ?? request?.documents[0] ?? null,
    [request?.documents, selectedDocId],
  )

  const isPending = request?.status === 'PENDING'

  const resetFooter = () => {
    setFooterMode('idle')
    setRejectReason('')
    setActionError(null)
  }

  const handleConfirmReject = async () => {
    if (!request || !rejectReason.trim() || isSubmitting) return

    setIsSubmitting(true)
    setActionError(null)

    try {
      await rejectAdminVerification(request.id, rejectReason.trim())
      onProcessed()
      onClose()
    } catch (err: unknown) {
      setActionError(
        err instanceof ApiError ? err.message : '인증 반려 처리 중 오류가 발생했습니다.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmApprove = async () => {
    if (!request || isSubmitting) return

    setIsSubmitting(true)
    setActionError(null)

    try {
      await approveAdminVerification(request.id)
      onProcessed()
      onClose()
    } catch (err: unknown) {
      setActionError(
        err instanceof ApiError ? err.message : '인증 승인 처리 중 오류가 발생했습니다.',
      )
    } finally {
      setIsSubmitting(false)
    }
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
                {request ? <StatusBadge status={request.status} /> : null}
              </div>
              {isLoading ? (
                <div className="mt-3 space-y-2 animate-pulse" aria-hidden="true">
                  <div className="h-4 w-40 rounded bg-mistSkyBlue/30" />
                  <div className="h-4 w-2/3 rounded bg-mistSkyBlue/30" />
                  <div className="h-3 w-32 rounded bg-mistSkyBlue/25" />
                </div>
              ) : request ? (
                <>
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
                </>
              ) : null}
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

        {isLoading ? (
          <CertificationDetailSkeleton />
        ) : error ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-12 text-center">
            <p className="font-pretendard text-sm font-semibold text-red-600">{error}</p>
            <button
              type="button"
              onClick={loadDetail}
              className="mt-4 inline-flex items-center justify-center rounded-full border border-mistSkyBlue/60 bg-white px-5 py-2.5 font-pretendard text-sm font-semibold text-deepOceanNavy transition-colors hover:border-waterlineBlue hover:bg-foamWhite/60"
            >
              다시 시도
            </button>
          </div>
        ) : request ? (
          <div className="flex min-h-0 flex-1 overflow-hidden">
            <aside className="flex w-72 shrink-0 flex-col border-r border-mistSkyBlue/45 bg-foamWhite/30">
              <p className="border-b border-mistSkyBlue/35 px-5 py-3.5 font-pretendard text-xs font-semibold uppercase tracking-wide text-secondary">
                첨부 파일 ({request.documents.length})
              </p>
              {request.documents.length > 0 ? (
                <ul className="flex-1 space-y-1.5 overflow-y-auto p-3">
                  {request.documents.map((doc) => {
                    const isSelected = selectedDocument?.id === doc.id
                    const truncatedFileName = truncateFileName(doc.name)

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
                          <div className="flex items-center gap-3">
                            <EvidenceThumbnailPlaceholder
                              size="sm"
                              className={isSelected ? 'ring-waterlineBlue/35' : ''}
                            />
                            <div className="min-w-0 flex-1">
                              <p
                                className={`truncate font-pretendard text-sm ${
                                  isSelected ? 'font-semibold text-deepOceanNavy' : 'font-medium text-primary/90'
                                }`}
                              >
                                {getCertificationDocumentLabel(doc.type)}
                              </p>
                              <p
                                className="mt-1 truncate font-pretendard text-xs text-secondary/85"
                                title={doc.name}
                              >
                                {truncatedFileName}
                              </p>
                              <p className="mt-1 font-pretendard text-[11px] text-secondary/60">
                                업로드 {formatRequestedDate(doc.uploadedAt)}
                              </p>
                            </div>
                          </div>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="flex-1 px-5 py-6 font-pretendard text-sm text-secondary">첨부된 파일이 없습니다.</p>
              )}
            </aside>

            <div className="min-w-0 flex-1 overflow-hidden bg-white">
              {selectedDocument ? (
                <CertificationEvidencePreview
                  verificationId={verificationId}
                  document={selectedDocument}
                  fetchEvidence={getAdminVerificationEvidence}
                />
              ) : (
                <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-2 font-pretendard text-sm text-secondary">
                  <EvidenceThumbnailPlaceholder />
                  선택된 파일이 없습니다.
                </div>
              )}
            </div>
          </div>
        ) : null}

        {request?.status === 'REJECTED' && request.rejectReason ? (
          <div className="shrink-0 border-b border-red-200/80 bg-red-50/70 px-6 py-4 md:px-7">
            <p className="font-pretendard text-xs font-semibold uppercase tracking-wide text-[#991b1b]">반려 사유</p>
            <p className="mt-2 font-pretendard text-sm leading-relaxed text-[#7f1d1d]">{request.rejectReason}</p>
          </div>
        ) : null}

        {request?.status === 'APPROVED' && request.adminMemo ? (
          <div className="shrink-0 border-b border-[#bbf7d0] bg-[#ecfdf5] px-6 py-4 md:px-7">
            <p className="font-pretendard text-xs font-semibold uppercase tracking-wide text-[#166534]">
              관리자 메모
            </p>
            <p className="mt-2 font-pretendard text-sm leading-relaxed text-[#15803d]">{request.adminMemo}</p>
            {request.processedByNickname ? (
              <p className="mt-2 font-pretendard text-xs text-[#15803d]/90">
                처리: {request.processedByNickname}
                {request.processedAt ? ` · ${formatRequestedDate(request.processedAt.split('T')[0])}` : ''}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="shrink-0 border-t border-mistSkyBlue/45 bg-white">
          {actionError ? (
            <div className="border-b border-red-200/80 bg-red-50/80 px-6 py-3 md:px-7">
              <p className="font-pretendard text-sm font-semibold text-[#b91c1c]">{actionError}</p>
            </div>
          ) : null}

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

          {isPending && footerMode === 'approve_confirm' ? (
            <div className="border-b border-[#bbf7d0] bg-[#ecfdf5] px-6 py-4 md:px-7">
              <p className="font-pretendard text-sm font-semibold text-[#166534]">인증 요청을 승인하시겠습니까?</p>
              <p className="mt-1 font-pretendard text-xs text-[#15803d]">
                승인 후에는 해당 사용자의 수강 인증이 완료 처리됩니다.
              </p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3 px-6 py-4 md:px-7">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded border border-mistSkyBlue/60 bg-white px-5 py-2.5 font-pretendard text-sm font-semibold text-secondary transition-colors hover:border-waterlineBlue hover:bg-foamWhite/60 hover:text-deepOceanNavy disabled:cursor-not-allowed disabled:opacity-50"
            >
              닫기
            </button>
            <div className="flex-1" />

            {isPending && footerMode === 'idle' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setActionError(null)
                    setFooterMode('reject')
                  }}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded border border-red-200 bg-red-50 px-5 py-2.5 font-pretendard text-sm font-semibold text-[#b91c1c] transition-colors hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  반려
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActionError(null)
                    setFooterMode('approve_confirm')
                  }}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded border border-deepOceanNavy bg-deepOceanNavy px-5 py-2.5 font-pretendard text-sm font-semibold text-white shadow-sm transition-colors hover:border-waterlineBlue hover:bg-waterlineBlue disabled:cursor-not-allowed disabled:opacity-50"
                >
                  승인
                </button>
              </>
            ) : null}

            {isPending && footerMode === 'reject' ? (
              <>
                <button
                  type="button"
                  onClick={resetFooter}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded border border-mistSkyBlue/60 bg-white px-5 py-2.5 font-pretendard text-sm font-semibold text-secondary transition-colors hover:bg-foamWhite/60 hover:text-deepOceanNavy disabled:cursor-not-allowed disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  disabled={!rejectReason.trim() || isSubmitting}
                  className="inline-flex items-center justify-center rounded border border-[#dc2626] bg-[#dc2626] px-5 py-2.5 font-pretendard text-sm font-semibold text-white transition-colors hover:bg-[#b91c1c] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isSubmitting ? '처리 중…' : '반려 처리'}
                </button>
              </>
            ) : null}

            {isPending && footerMode === 'approve_confirm' ? (
              <>
                <button
                  type="button"
                  onClick={resetFooter}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded border border-mistSkyBlue/60 bg-white px-5 py-2.5 font-pretendard text-sm font-semibold text-secondary transition-colors hover:bg-foamWhite/60 hover:text-deepOceanNavy disabled:cursor-not-allowed disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleConfirmApprove}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded border border-deepOceanNavy bg-deepOceanNavy px-5 py-2.5 font-pretendard text-sm font-semibold text-white shadow-sm transition-colors hover:border-waterlineBlue hover:bg-waterlineBlue disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? '처리 중…' : '승인하기'}
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

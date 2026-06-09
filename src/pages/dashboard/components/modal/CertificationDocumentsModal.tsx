import { useEffect, useMemo, useState } from 'react'
import DocumentPreview from '../../../admin/components/modal/DocumentPreview'
import StatusBadge from '../../../admin/components/certification/StatusBadge'
import { formatRequestedDate } from '../../../../utils/formatRequestedDate'
import { getCertificationDocumentLabel, type UserCertificationRequest } from '../../data/certifications'

const certificationIconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

type CertificationDocumentsModalProps = {
  request: UserCertificationRequest
  onClose: () => void
}

export default function CertificationDocumentsModal({ request, onClose }: CertificationDocumentsModalProps) {
  const [selectedDocId, setSelectedDocId] = useState<number | null>(request.documents[0]?.id ?? null)

  useEffect(() => {
    setSelectedDocId(request.documents[0]?.id ?? null)
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

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-deepOceanNavy/45 px-4 py-6"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-mistSkyBlue/50 glass-modal shadow-[0_18px_50px_rgba(36,57,84,0.28)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="certification-documents-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="shrink-0 border-b border-mistSkyBlue/45 bg-gradient-to-r from-mistSkyBlue/55 via-softAquaBlue/40 to-waterlineBlue/20 px-6 py-5 md:px-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2
                  id="certification-documents-modal-title"
                  className="font-pretendard text-xl font-bold text-deepOceanNavy md:text-2xl"
                >
                  인증 요청 상세
                </h2>
                <StatusBadge status={request.status} />
              </div>
              <p className="mt-3 font-pretendard text-sm font-semibold text-deepOceanNavy">{request.courseName}</p>
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
            {request.documents.length > 0 ? (
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
                              {getCertificationDocumentLabel(doc.type)}
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
            ) : (
              <p className="flex-1 px-5 py-6 font-pretendard text-sm text-secondary">첨부된 파일이 없습니다.</p>
            )}
          </aside>

          <div className="min-w-0 flex-1 overflow-hidden bg-transparent">
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

        {request.status === 'REJECTED' && request.rejectReason ? (
          <div className="shrink-0 border-b border-red-200/80 bg-red-50/70 px-6 py-4 md:px-7">
            <p className="font-pretendard text-xs font-semibold uppercase tracking-wide text-[#991b1b]">반려 사유</p>
            <p className="mt-2 font-pretendard text-sm leading-relaxed text-[#7f1d1d]">{request.rejectReason}</p>
          </div>
        ) : null}

        <div className="shrink-0 border-t border-mistSkyBlue/45 bg-transparent px-6 py-4 md:px-7">
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
  )
}

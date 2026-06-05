import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Report, ReportContentAction, ReportType } from '../../AdminReportsPage'
import { formatRequestedDate } from '../../../../utils/formatRequestedDate'
import { truncateText } from '../../../../utils/truncateText'
import ReportStatusBadge from '../report/ReportStatusBadge'

const REPORT_TYPE_LABEL: Record<ReportType, string> = { // 신고 대상 유형 라벨
  REVIEW: '리뷰',
  POST: '게시글',
  COMMENT: '댓글',
}

const REPORT_CONTENT_ACTION_OPTIONS: { // 신고 콘텐츠 조치 옵션
  key: ReportContentAction
  label: string
  description: string
  tone: 'primary' | 'neutral'
}[] = [
  {
    key: 'HIDE',
    label: '비공개 처리',
    description: '신고된 콘텐츠를 비공개 처리합니다.',
    tone: 'primary',
  },
  {
    key: 'INVALID_REASON',
    label: '신고 사유 부적격',
    description: '가이드 위반에 해당하지 않아 신고를 기각합니다. 콘텐츠는 유지됩니다.',
    tone: 'neutral',
  },
]

const REPORT_CONTENT_ACTION_LABEL: Record<ReportContentAction, string> = { // 신고 콘텐츠 조치 라벨
  HIDE: '비공개 처리',
  INVALID_REASON: '신고 사유 부적격',
}

type FooterMode = 'idle' | 'complete_confirm'

const SECTION_LABEL_CLASS = 'font-pretendard text-sm font-bold text-deepOceanNavy'
const SECTION_VALUE_CLASS = 'mt-2 font-pretendard text-sm font-normal leading-relaxed text-primary/80'

type ReportDetailModalProps = {
  report: Report
  onClose: () => void
  onComplete: (id: number, contentAction: ReportContentAction) => void
}

export default function ReportDetailModal({ report, onClose, onComplete }: ReportDetailModalProps) {
  const isPending = report.status === 'PENDING'
  const [footerMode, setFooterMode] = useState<FooterMode>('idle')
  const [contentAction, setContentAction] = useState<ReportContentAction | null>(null)

  const selectedActionOption = REPORT_CONTENT_ACTION_OPTIONS.find((option) => option.key === contentAction)

  useEffect(() => {
    setFooterMode('idle')
    setContentAction(null)
  }, [report.id])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleConfirmComplete = () => {
    if (!contentAction) return
    onComplete(report.id, contentAction)
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
        aria-labelledby="report-detail-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="shrink-0 border-b border-mistSkyBlue/45 bg-gradient-to-r from-mistSkyBlue/55 via-softAquaBlue/40 to-waterlineBlue/20 px-6 py-5 md:px-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 id="report-detail-title" className="font-pretendard text-xl font-bold text-deepOceanNavy md:text-2xl">
                  신고 상세
                </h2>
                <ReportStatusBadge status={report.status} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-pretendard text-sm">
                <span className="inline-flex items-center gap-2 font-semibold text-deepOceanNavy">
                  <span
                    className="block h-9 w-9 shrink-0 rounded-full bg-[#f8fafc] bg-cover bg-center ring-1 ring-mistSkyBlue/45"
                    style={
                      report.profileImageUrl ? { backgroundImage: `url(${report.profileImageUrl})` } : undefined
                    }
                    aria-hidden="true"
                  />
                  {report.reporterName}
                </span>
                <span className="hidden text-mistSkyBlue sm:inline" aria-hidden="true">
                  ·
                </span>
                <span className="text-secondary">{formatRequestedDate(report.reportedAt)} 신고</span>
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
            <p className={SECTION_LABEL_CLASS}>신고 대상</p>
            <p className={SECTION_VALUE_CLASS}>{report.targetLabel}</p>
          </div>

          <div>
            <p className={SECTION_LABEL_CLASS}>신고 대상 유형</p>
            <p className={SECTION_VALUE_CLASS}>{REPORT_TYPE_LABEL[report.type]}</p>
          </div>

          <div>
            <p className={SECTION_LABEL_CLASS}>신고 사유 카테고리</p>
            <p className={SECTION_VALUE_CLASS}>{report.reasonCategory}</p>
          </div>

          <div>
            <p className={SECTION_LABEL_CLASS}>신고 사유 상세</p>
            <div className="mt-2 rounded-2xl border border-mistSkyBlue/45 bg-foamWhite/30 px-5 py-4">
              <p className={`whitespace-pre-wrap ${SECTION_VALUE_CLASS} mt-0`}>{report.reasonDetail}</p>
            </div>
          </div>

          <div>
            <p className={SECTION_LABEL_CLASS}>신고 콘텐츠</p>
            <Link
              to={report.contentUrl}
              className="group mt-2 block rounded-xl border border-mistSkyBlue/45 bg-[#eef4fa]/40 px-4 py-3.5 transition-colors hover:border-waterlineBlue hover:bg-foamWhite/70"
            >
              <p className="font-pretendard text-sm font-normal leading-relaxed text-primary/85 group-hover:text-deepOceanNavy">
                {truncateText(report.contentBody, 50)}
              </p>
              <span className="mt-2 inline-flex items-center gap-1 font-pretendard text-xs font-medium text-waterlineBlue">
                콘텐츠 페이지로 이동
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </div>

          {isPending ? (
            <div>
              <p className={SECTION_LABEL_CLASS}>
                콘텐츠 조치 <span className="text-[#dc2626]">*</span>
              </p>
              <p className="mt-1 font-pretendard text-xs font-normal text-secondary">
                신고 내용을 검토한 뒤 적용할 조치를 선택해 주세요.
              </p>
              <div className="mt-3 space-y-2.5" role="radiogroup" aria-label="콘텐츠 조치 선택">
                {REPORT_CONTENT_ACTION_OPTIONS.map((option) => {
                  const isSelected = contentAction === option.key
                  const isPrimaryTone = option.tone === 'primary'

                  return (
                    <button
                      key={option.key}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setContentAction(option.key)}
                      className={`w-full rounded-xl border px-4 py-3.5 text-left transition-all ${
                        isSelected
                          ? isPrimaryTone
                            ? 'border-waterlineBlue bg-gradient-to-r from-mistSkyBlue/40 via-softAquaBlue/25 to-foamWhite/50 shadow-[0_1px_3px_rgba(52,74,100,0.08)] ring-2 ring-waterlineBlue/25'
                            : 'border-mistSkyBlue bg-foamWhite/60 ring-2 ring-mistSkyBlue/50'
                          : 'border-mistSkyBlue/50 bg-white hover:border-mistSkyBlue hover:bg-foamWhite/40'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            isSelected
                              ? 'border-waterlineBlue bg-waterlineBlue'
                              : 'border-mistSkyBlue bg-white'
                          }`}
                          aria-hidden="true"
                        >
                          {isSelected ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="font-pretendard text-sm font-bold text-deepOceanNavy">
                            {option.label}
                          </span>
                          <span className="mt-1 block font-pretendard text-xs leading-relaxed text-secondary">
                            {option.description}
                          </span>
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : null}

          {!isPending && report.contentAction ? (
            <div>
              <p className={SECTION_LABEL_CLASS}>콘텐츠 조치</p>
              <div
                className={`mt-2 inline-flex rounded-full px-3 py-1 font-pretendard text-xs font-semibold ${
                  report.contentAction === 'HIDE'
                    ? 'bg-[#eef4fa] text-waterlineBlue ring-1 ring-mistSkyBlue/60'
                    : 'bg-[#f1f5f9] text-secondary ring-1 ring-[#e2e8f0]'
                }`}
              >
                {REPORT_CONTENT_ACTION_LABEL[report.contentAction]}
              </div>
            </div>
          ) : null}
        </div>

        <div className="shrink-0 border-t border-mistSkyBlue/45 bg-white">
          {isPending && footerMode === 'complete_confirm' && selectedActionOption ? (
            <div className="border-b border-[#bbf7d0] bg-[#ecfdf5] px-6 py-4 md:px-7">
              <p className="font-pretendard text-sm font-semibold text-[#166534]">
                「{selectedActionOption.label}」 조치로 처리완료하시겠습니까?
              </p>
              <p className="mt-1 font-pretendard text-xs text-[#15803d]">
                {selectedActionOption.description}
              </p>
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
                disabled={!contentAction}
                className="inline-flex items-center justify-center rounded border border-deepOceanNavy bg-deepOceanNavy px-5 py-2.5 font-pretendard text-sm font-semibold text-white shadow-sm transition-colors hover:border-waterlineBlue hover:bg-waterlineBlue disabled:cursor-not-allowed disabled:opacity-40"
              >
                처리 완료
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
                  onClick={handleConfirmComplete}
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

import { LoaderCircle } from 'lucide-react'
import {
  PORTFOLIO_DRAFT_TONE_LABELS,
  type PortfolioDraftHistoryDetail,
  type PortfolioDraftHistorySummary,
} from '../../../../services/aiPortfolio'
import AiPortfolioDraftResultView from '../AiPortfolioDraftResultView'
import DashboardModal from './DashboardModal'

type AiPortfolioHistoryDetailModalProps = {
  item: PortfolioDraftHistorySummary
  detail: PortfolioDraftHistoryDetail | null
  isLoading: boolean
  errorMessage: string | null
  onClose: () => void
}

function formatCreatedAt(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`
}

export default function AiPortfolioHistoryDetailModal({
  item,
  detail,
  isLoading,
  errorMessage,
  onClose,
}: AiPortfolioHistoryDetailModalProps) {
  return (
    <DashboardModal
      title={item.targetJob}
      subtitle={
        <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
          <time dateTime={item.createdAt}>{formatCreatedAt(item.createdAt)}</time>
          <span className="inline-flex items-center rounded-full bg-[#f2faf4] px-2.5 py-0.5 text-[10px] font-semibold text-[#1f8a3b]">
            {PORTFOLIO_DRAFT_TONE_LABELS[item.tone]}
          </span>
        </span>
      }
      onClose={onClose}
      maxWidthClass="max-w-3xl"
      ariaLabelledBy="ai-portfolio-history-detail-title"
    >
      <div className="space-y-4 font-pretendard">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-secondary">
            <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
            <span className="text-sm">이력을 불러오는 중…</span>
          </div>
        ) : errorMessage ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
        ) : detail ? (
          <AiPortfolioDraftResultView
            draft={detail}
            title="생성 결과"
            emptyMessage="저장된 생성 결과가 없습니다."
            scrollable={false}
          />
        ) : null}
      </div>
    </DashboardModal>
  )
}

import { useEffect, useState } from 'react'
import Pagination from '../../../components/common/Pagination'
import { ApiError } from '../../../services/ApiError'
import {
  deletePortfolioDraftHistory,
  getPortfolioDraftHistory,
  getPortfolioDraftHistoryDetail,
  type PortfolioDraftHistoryDetail,
  type PortfolioDraftHistorySummary,
} from '../../../services/aiPortfolio'
import DashboardCard from './DashboardCard'
import AiPortfolioHistoryRowCard from './AiPortfolioHistoryRowCard'
import AiPortfolioHistoryDetailModal from './modal/AiPortfolioHistoryDetailModal'
import DeleteConfirmModal from './modal/DeleteConfirmModal'

const PAGE_SIZE = 10

type AiPortfolioHistorySectionProps = {
  refreshKey?: number
}

export default function AiPortfolioHistorySection({ refreshKey = 0 }: AiPortfolioHistorySectionProps) {
  const [items, setItems] = useState<PortfolioDraftHistorySummary[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [selectedItem, setSelectedItem] = useState<PortfolioDraftHistorySummary | null>(null)
  const [detailById, setDetailById] = useState<Record<number, PortfolioDraftHistoryDetail>>({})
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<PortfolioDraftHistorySummary | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadHistory() {
      setIsLoading(true)
      setFetchError(null)

      try {
        const data = await getPortfolioDraftHistory(currentPage - 1, PAGE_SIZE)
        if (cancelled) return

        setItems(data.content)
        setTotalPages(Math.max(1, data.totalPages))
      } catch (error) {
        if (cancelled) return
        setItems([])
        setTotalPages(1)
        setFetchError(error instanceof ApiError ? error.message : '생성 이력을 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void loadHistory()
    return () => {
      cancelled = true
    }
  }, [currentPage, refreshKey])

  useEffect(() => {
    setCurrentPage(1)
    setSelectedItem(null)
  }, [refreshKey])

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  async function handleOpenDetail(item: PortfolioDraftHistorySummary) {
    setSelectedItem(item)
    setDetailError(null)

    if (detailById[item.historyId]) return

    setIsDetailLoading(true)

    try {
      const detail = await getPortfolioDraftHistoryDetail(item.historyId)
      setDetailById((current) => ({ ...current, [item.historyId]: detail }))
    } catch (error) {
      setDetailError(error instanceof ApiError ? error.message : '이력 상세를 불러오지 못했습니다.')
    } finally {
      setIsDetailLoading(false)
    }
  }

  function handleCloseDetail() {
    setSelectedItem(null)
    setDetailError(null)
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return

    setIsDeleting(true)
    setActionError(null)

    try {
      await deletePortfolioDraftHistory(deleteTarget.historyId)

      setDetailById((current) => {
        const next = { ...current }
        delete next[deleteTarget.historyId]
        return next
      })

      if (selectedItem?.historyId === deleteTarget.historyId) {
        setSelectedItem(null)
      }

      setDeleteTarget(null)

      if (items.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1)
      } else {
        const data = await getPortfolioDraftHistory(currentPage - 1, PAGE_SIZE)
        setItems(data.content)
        setTotalPages(Math.max(1, data.totalPages))
      }
    } catch (error) {
      setActionError(error instanceof ApiError ? error.message : '이력 삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <DashboardCard title="생성 이력" className="mt-6">
        {actionError ? (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 font-pretendard text-sm text-red-600" role="alert">
            {actionError}
          </p>
        ) : null}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="font-pretendard text-sm text-secondary">생성 이력을 불러오는 중…</p>
          </div>
        ) : fetchError ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-mistSkyBlue/45 bg-foamWhite/30 px-6 py-12 text-center">
            <p className="font-pretendard text-sm font-semibold text-deepOceanNavy">생성 이력을 불러올 수 없습니다</p>
            <p className="mt-1.5 font-pretendard text-xs leading-relaxed text-secondary">{fetchError}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-mistSkyBlue/45 bg-foamWhite/30 px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foamWhite text-waterlineBlue ring-1 ring-mistSkyBlue/50">
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path d="M14 3v6h6M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <p className="mt-4 font-pretendard text-sm font-semibold text-deepOceanNavy">생성 이력이 없습니다</p>
            <p className="mt-1.5 font-pretendard text-xs leading-relaxed text-secondary">
              포트폴리오 초안을 생성하면 이곳에서 이전 결과를 확인할 수 있습니다.
            </p>
          </div>
        ) : (
          <>
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <li key={item.historyId}>
                  <AiPortfolioHistoryRowCard
                    item={item}
                    onOpen={() => void handleOpenDetail(item)}
                    onDelete={() => {
                      setActionError(null)
                      setDeleteTarget(item)
                    }}
                  />
                </li>
              ))}
            </ul>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="mt-6"
            />
          </>
        )}
      </DashboardCard>

      {selectedItem ? (
        <AiPortfolioHistoryDetailModal
          item={selectedItem}
          detail={detailById[selectedItem.historyId] ?? null}
          isLoading={isDetailLoading}
          errorMessage={detailError}
          onClose={handleCloseDetail}
        />
      ) : null}

      {deleteTarget ? (
        <DeleteConfirmModal
          targetTitle={deleteTarget.targetJob}
          targetLabel="생성 이력"
          onClose={() => {
            if (!isDeleting) setDeleteTarget(null)
          }}
          onConfirm={() => void handleDeleteConfirm()}
          isDeleting={isDeleting}
        />
      ) : null}
    </>
  )
}

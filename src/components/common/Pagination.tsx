/** 목록 하단 페이지 이동 [이전·번호·다음] — 여러 페이지 공통 **/

import { useMemo, useState } from 'react'

const DEFAULT_MAX_VISIBLE_PAGES = 5

/** 현재 페이지가 속한 페이지 번호 묶음 인덱스 (0-based) */
export function getPageWindowIndex(
  currentPage: number,
  maxVisible = DEFAULT_MAX_VISIBLE_PAGES,
): number {
  return Math.floor((currentPage - 1) / maxVisible)
}

/** 현재 묶음에 표시할 페이지 번호 목록 — 예: 1~5, 6~7 */
export function getVisiblePages(
  currentPage: number,
  totalPages: number,
  maxVisible = DEFAULT_MAX_VISIBLE_PAGES,
): number[] {
  if (totalPages <= 0) return []
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const windowIndex = getPageWindowIndex(currentPage, maxVisible)
  const start = windowIndex * maxVisible + 1
  const end = Math.min(start + maxVisible - 1, totalPages)

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

/** 이전/다음 화살표로 이동할 페이지 (묶음의 첫 페이지) */
export function getAdjacentWindowPage(
  currentPage: number,
  totalPages: number,
  direction: 'prev' | 'next',
  maxVisible = DEFAULT_MAX_VISIBLE_PAGES,
): number | null {
  if (totalPages <= maxVisible) return null

  const windowIndex = getPageWindowIndex(currentPage, maxVisible)
  const maxWindowIndex = getPageWindowIndex(totalPages, maxVisible)

  if (direction === 'prev') {
    if (windowIndex <= 0) return null
    return (windowIndex - 1) * maxVisible + 1
  }

  if (windowIndex >= maxWindowIndex) return null
  return (windowIndex + 1) * maxVisible + 1
}

export function usePaginatedList<T>(items: T[], pageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const displayedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, currentPage, pageSize])

  const onPageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages))
  }

  return { currentPage, totalPages, displayedItems, onPageChange }
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  maxVisiblePages?: number
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = 'mt-10',
  maxVisiblePages = DEFAULT_MAX_VISIBLE_PAGES,
}: PaginationProps) {
  const pages = useMemo(
    () => getVisiblePages(currentPage, totalPages, maxVisiblePages),
    [currentPage, totalPages, maxVisiblePages],
  )

  const prevWindowPage = getAdjacentWindowPage(currentPage, totalPages, 'prev', maxVisiblePages)
  const nextWindowPage = getAdjacentWindowPage(currentPage, totalPages, 'next', maxVisiblePages)

  const pageButtonClass = (page: number) =>
    `flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
      page === currentPage
        ? 'bg-foamWhite text-deepOceanNavy'
        : 'text-secondary hover:bg-foamWhite/60'
    }`

  return (
    <nav
      className={`flex items-center justify-center gap-2 font-pretendard ${className}`}
      aria-label="페이지 이동"
    >
      <button
        type="button"
        aria-label="이전 페이지 묶음"
        disabled={prevWindowPage === null}
        onClick={() => prevWindowPage !== null && onPageChange(prevWindowPage)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-deepOceanNavy transition-colors hover:bg-foamWhite disabled:cursor-not-allowed disabled:opacity-40"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-label={`${page}페이지`}
          aria-current={page === currentPage ? 'page' : undefined}
          onClick={() => onPageChange(page)}
          className={pageButtonClass(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        aria-label="다음 페이지 묶음"
        disabled={nextWindowPage === null}
        onClick={() => nextWindowPage !== null && onPageChange(nextWindowPage)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-deepOceanNavy transition-colors hover:bg-foamWhite disabled:cursor-not-allowed disabled:opacity-40"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </nav>
  )
}

/** 목록 하단 페이지 이동 [이전·번호·다음] — 여러 페이지 공통 **/

import { useMemo, useState } from 'react'

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
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = 'mt-10',
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav
      className={`flex items-center justify-center gap-2 font-pretendard ${className}`}
      aria-label="페이지 이동"
    >
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
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
          className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
            page === currentPage
              ? 'bg-foamWhite text-deepOceanNavy'
              : 'text-secondary hover:bg-foamWhite/60'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-deepOceanNavy transition-colors hover:bg-foamWhite disabled:cursor-not-allowed disabled:opacity-40"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </nav>
  )
}

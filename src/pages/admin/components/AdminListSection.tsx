import type { ReactNode } from 'react'

const adminListIconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export type AdminListColumn = {
  label: string
  align?: 'left' | 'center' | 'right'
}

type AdminListSectionProps = {
  columns: AdminListColumn[]
  gridColsClass: string
  isEmpty: boolean
  emptyTitle: string
  emptyDescription?: string
  emptyIcon?: ReactNode
  gridGapClass?: string
  children: ReactNode
}

function DefaultEmptyIcon() {
  return (
    <svg {...adminListIconProps} width={24} height={24}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="12" cy="11" r="2.5" />
      <path d="M8 18v-1a4 4 0 0 1 8 0v1" />
    </svg>
  )
}

function columnAlignClass(align: AdminListColumn['align']) {
  if (align === 'center') return 'text-center'
  if (align === 'right') return 'text-right'
  return ''
}

export default function AdminListSection({
  columns,
  gridColsClass,
  isEmpty,
  emptyTitle,
  emptyDescription = '다른 탭을 선택해 보세요.',
  emptyIcon,
  gridGapClass = 'md:gap-4',
  children,
}: AdminListSectionProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-mistSkyBlue/45 bg-white shadow-[0_2px_12px_rgba(52,74,100,0.06)]">
      <div
        className={`hidden border-b border-mistSkyBlue/45 bg-foamWhite px-6 py-3.5 md:grid ${gridColsClass} md:items-center ${gridGapClass}`}
      >
        {columns.map((column) => (
          <span
            key={column.label}
            className={`font-pretendard text-xs font-semibold uppercase tracking-wide text-secondary ${columnAlignClass(column.align)}`}
          >
            {column.label}
          </span>
        ))}
      </div>

      <ul>
        {isEmpty ? (
          <li className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foamWhite text-waterlineBlue ring-1 ring-mistSkyBlue/50">
              {emptyIcon ?? <DefaultEmptyIcon />}
            </div>
            <p className="mt-4 font-pretendard text-sm font-semibold text-deepOceanNavy">{emptyTitle}</p>
            <p className="mt-1 font-pretendard text-xs text-secondary">{emptyDescription}</p>
          </li>
        ) : null}
        {children}
      </ul>
    </section>
  )
}

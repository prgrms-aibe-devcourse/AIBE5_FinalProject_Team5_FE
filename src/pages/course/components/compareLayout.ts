// 과정 비교 레이아웃 설정
import type { CSSProperties } from 'react'

export type CompareColumnCount = 2 | 3

export interface CompareLayoutConfig {
  columnCount: CompareColumnCount
  gridTemplateColumns: string
  mobileGridTemplateColumns: string
  containerClassName: string
  scrollMinWidth: string
  summaryCardMaxWidth: string
}

/** 모바일·데스크톱 그리드 열 전환용 CSS 변수 */
export function getCompareGridVars(layout: CompareLayoutConfig): CSSProperties {
  return {
    '--compare-mobile-cols': layout.mobileGridTemplateColumns,
    '--compare-desktop-cols': layout.gridTemplateColumns,
  } as CSSProperties
}

export const COMPARE_RESPONSIVE_GRID_CLASS =
  'grid [grid-template-columns:var(--compare-mobile-cols)] md:[grid-template-columns:var(--compare-desktop-cols)]'

export function getCompareLayoutConfig(courseCount: number): CompareLayoutConfig {
  const columnCount: CompareColumnCount = courseCount === 2 ? 2 : 3
  const labelColumn = '7rem'
  const mobileLabelColumn = '4.5rem'
  const courseColumns = `repeat(${columnCount}, minmax(0, 1fr))`

  if (columnCount === 2) {
    return {
      columnCount,
      gridTemplateColumns: `${labelColumn} ${courseColumns}`,
      mobileGridTemplateColumns: `${mobileLabelColumn} ${courseColumns}`,
      containerClassName: 'mx-auto w-full max-w-5xl',
      scrollMinWidth: '36rem',
      summaryCardMaxWidth: 'max-w-[22rem]',
    }
  }

  return {
    columnCount,
    gridTemplateColumns: `${labelColumn} ${courseColumns}`,
    mobileGridTemplateColumns: `${mobileLabelColumn} ${courseColumns}`,
    containerClassName: 'w-full',
    scrollMinWidth: '40rem',
    summaryCardMaxWidth: 'max-w-[19rem]',
  }
}

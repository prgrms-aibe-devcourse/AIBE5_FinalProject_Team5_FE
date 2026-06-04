// 과정 비교 레이아웃 설정
export type CompareColumnCount = 2 | 3

export interface CompareLayoutConfig {
  columnCount: CompareColumnCount
  gridTemplateColumns: string
  containerClassName: string
  scrollMinWidth: string
  summaryCardMaxWidth: string
}

export function getCompareLayoutConfig(courseCount: number): CompareLayoutConfig {
  const columnCount: CompareColumnCount = courseCount === 2 ? 2 : 3
  const labelColumn = '10.5rem'

  if (columnCount === 2) {
    return {
      columnCount,
      gridTemplateColumns: `${labelColumn} repeat(2, minmax(0, 1fr))`,
      containerClassName: 'mx-auto w-full max-w-5xl',
      scrollMinWidth: '36rem',
      summaryCardMaxWidth: 'max-w-[20rem]',
    }
  }

  return {
    columnCount,
    gridTemplateColumns: `${labelColumn} repeat(3, minmax(0, 1fr))`,
    containerClassName: 'w-full',
    scrollMinWidth: '40rem',
    summaryCardMaxWidth: 'max-w-[17rem]',
  }
}

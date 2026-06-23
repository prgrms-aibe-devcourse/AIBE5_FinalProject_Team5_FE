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
  const labelColumn = '7rem'
  const courseColumns = `repeat(${columnCount}, minmax(0, 1fr))`

  if (columnCount === 2) {
    return {
      columnCount,
      gridTemplateColumns: `${labelColumn} ${courseColumns}`,
      containerClassName: 'mx-auto w-full max-w-5xl',
      scrollMinWidth: '36rem',
      summaryCardMaxWidth: 'max-w-[22rem]',
    }
  }

  return {
    columnCount,
    gridTemplateColumns: `${labelColumn} ${courseColumns}`,
    containerClassName: 'w-full',
    scrollMinWidth: '40rem',
    summaryCardMaxWidth: 'max-w-[19rem]',
  }
}

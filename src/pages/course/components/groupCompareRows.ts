import type { CourseDetail } from '../../../services/course.ts'
import type { CompareTableRow } from '../data/mockCourseCompare.ts'

export interface CompareFieldRow {
  label: string
  getValue: (course: CourseDetail) => string
  multiline?: boolean
}

export interface CompareSectionGroup {
  label: string
  fields: CompareFieldRow[]
  includeStats?: boolean
  contentOnly?: boolean
}

// 비교 표 항목 그룹화
export function groupCompareRows(rows: CompareTableRow[]): CompareSectionGroup[] {
  const groups: CompareSectionGroup[] = []
  let current: CompareSectionGroup | null = null

  for (const row of rows) {
    if (row.type === 'section') {
      current = { label: row.label, fields: [], contentOnly: row.contentOnly }
      groups.push(current)
      continue
    }

    if (row.type === 'stats') {
      if (current) current.includeStats = true
      continue
    }

    if (current) {
      current.fields.push({
        label: row.label,
        getValue: row.getValue,
        multiline: row.multiline,
      })
    }
  }

  return groups
}

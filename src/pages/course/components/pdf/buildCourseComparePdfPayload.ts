import type { CourseDetail } from '../../../../services/course.ts'
import type { VerifiedReviewStats } from '../../data/mockCourseReviews.ts'
import { COMPARE_TABLE_ROWS } from '../../data/mockCourseCompare.ts'
import { groupCompareRows } from '../groupCompareRows.ts'
import type { CourseComparePdfPayload } from './courseComparePdfTypes.ts'

export function buildCourseComparePdfPayload(
  courses: CourseDetail[],
  statsByColumn: VerifiedReviewStats[],
): CourseComparePdfPayload {
  const sections = groupCompareRows(COMPARE_TABLE_ROWS)

  return {
    generatedAt: new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
    courses: courses.map((course, index) => ({
      index: index + 1,
      title: course.title,
      company: course.company,
      dateRange: course.dateRange,
    })),
    sections: sections.map((section) => ({
      label: section.label,
      rows: section.fields.map((field) => ({
        label: field.label,
        values: courses.map((course) => field.getValue(course)),
      })),
      stats: section.includeStats
        ? statsByColumn.map((stats) => ({
            reviewCount: stats.reviewCount,
            averageRating: stats.averageRating,
            metrics: stats.qualityMetrics.slice(0, 3).map((item) => ({
              label: item.label,
              value: item.value,
            })),
          }))
        : undefined,
    })),
  }
}

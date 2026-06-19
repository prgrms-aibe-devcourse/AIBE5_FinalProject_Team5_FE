/**
 * 과정 비교 페이지 — 비교 행 정의
 * (과정 상세: GET /api/course-sessions/{courseSessionId}, 인증 리뷰 통계: GET /api/courses/{courseId}/reviews/statistics)
 */

import type { CourseDetail } from '../../../services/course.ts'

export type CompareTableRow =
  | { type: 'section'; label: string; contentOnly?: boolean }
  | { type: 'field'; label: string; getValue: (course: CourseDetail) => string; multiline?: boolean }
  | { type: 'stats' }

export const COMPARE_TABLE_ROWS: CompareTableRow[] = [
  { type: 'section', label: '기본 정보' },
  { type: 'field', label: '교육기관', getValue: (c) => c.company },
  { type: 'field', label: '진행 지역', getValue: (c) => c.location },
  { type: 'field', label: '부담 비용', getValue: (c) => c.price },
  { type: 'field', label: '진행 기간', getValue: (c) => c.dateRange },
  { type: 'field', label: '기수', getValue: (c) => c.batch },
  { type: 'section', label: '모집 현황' },
  { type: 'field', label: '모집 정원', getValue: (c) => `${c.recruitment.capacity}명` },
  { type: 'field', label: '지원자', getValue: (c) => `${c.recruitment.applicants}명` },
  { type: 'field', label: '확정자', getValue: (c) => `${c.recruitment.confirmed}명` },
  { type: 'section', label: '지원자격', contentOnly: true },
  { type: 'field', label: '지원자격', getValue: (c) => c.eligibility, multiline: true },
  { type: 'section', label: '과정목표', contentOnly: true },
  { type: 'field', label: '과정목표', getValue: (c) => c.goals, multiline: true },
  { type: 'section', label: '인증 후기 통계' },
  { type: 'stats' },
]

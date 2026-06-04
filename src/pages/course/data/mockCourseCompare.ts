/**
 * 과정 비교 페이지 mock — 상세 데이터 변형·비교 행 정의
 */

import type { CourseDetail } from '../../../services/course.ts'
import type { VerifiedReviewStats } from './mockCourseReviews.ts'
import { MOCK_VERIFIED_REVIEWS, getVerifiedReviewStats } from './mockCourseReviews.ts'
import { getMockCourseDetail } from './mockCourseDetail.ts'

const COMPARE_DETAIL_VARIANTS: Partial<CourseDetail>[] = [
  {
    satisfaction: '4.5/5',
    employmentRate: '52%',
    rating: '5/5',
    price: '500,000원',
    batch: '12기',
  },
  {
    satisfaction: '4.2/5',
    employmentRate: '38%',
    rating: '4/5',
    price: '무료',
    batch: '9기',
  },
  {
    satisfaction: '4.0/5',
    employmentRate: '41%',
    rating: '4/5',
    price: '300,000원',
    batch: '6기',
  },
]

const STATS_SCALE = [1, 0.92, 1.08]

export function getCourseDetailForCompare(courseId: string, columnIndex: number): CourseDetail {
  const variant = COMPARE_DETAIL_VARIANTS[columnIndex % COMPARE_DETAIL_VARIANTS.length]
  return {
    ...getMockCourseDetail(courseId),
    ...variant,
  }
}

export function getCompareStatsForCourse(columnIndex: number): VerifiedReviewStats {
  const base = getVerifiedReviewStats(MOCK_VERIFIED_REVIEWS)
  const scale = STATS_SCALE[columnIndex % STATS_SCALE.length]

  return {
    ...base,
    reviewCount: Math.round(12 * scale),
    averageRating: Number((4.3 * scale).toFixed(1)),
    qualityMetrics: base.qualityMetrics.map((item) => ({
      ...item,
      value: Number((item.value * scale || 4.2 * scale).toFixed(1)),
    })),
    priorKnowledgeDistribution: [
      { level: '비전공', count: Math.round(5 * scale), color: '#5C6AC4' },
      { level: '전공', count: Math.round(4 * scale), color: '#E88EB0' },
      { level: '현직', count: Math.round(2 * scale), color: '#8BB4D2' },
    ],
    ratingBars: [
      { score: 5, count: Math.round(8 * scale) },
      { score: 4, count: Math.round(3 * scale) },
      { score: 3, count: 1 },
      { score: 2, count: 0 },
      { score: 1, count: 0 },
    ],
  }
}

export type CompareTableRow =
  | { type: 'section'; label: string }
  | { type: 'field'; label: string; getValue: (course: CourseDetail) => string }
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
  { type: 'section', label: '평가 지표' },
  { type: 'field', label: '만족도', getValue: (c) => c.satisfaction },
  { type: 'field', label: '취업률', getValue: (c) => c.employmentRate },
  { type: 'field', label: '별점', getValue: (c) => c.rating },
  { type: 'section', label: '과정 정보' },
  {
    type: 'field',
    label: '지원자격',
    getValue: (c) => c.eligibility.split('\n')[0] ?? '-',
  },
  {
    type: 'field',
    label: '과정목표',
    getValue: (c) => c.goals.split('\n')[0] ?? '-',
  },
  { type: 'section', label: '인증 리뷰 통계' },
  { type: 'stats' },
]

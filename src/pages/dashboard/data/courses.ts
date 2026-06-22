import type { Course as ApiCourse } from '../../../services/course'

export type Course = {
  id: number
  title: string
  academy: string
  region: string
  subsidy: string
  period: string
  rating: string
  enrollment?: string
  logoUrl?: string
}

export function toApiCourse(course: Course): ApiCourse {
  return {
    id: String(course.id),
    title: course.title,
    company: course.academy,
    location: course.region,
    price: course.subsidy,
    dateRange: course.period,
    satisfaction: `${course.rating}/5`,
    employmentRate: '42%',
    rating: `${course.rating}/5`,
  }
}

/** API 연동 후 제거 예정 — 스크랩 목록 더미 데이터 (대시보드 미리보기용) */
export const mockBookmarkCourses: Course[] = [
  {
    id: 1,
    title: 'K-Digital Training: 생성형 AI 활용 백엔드 개발',
    academy: '(주)그렙',
    region: '서울',
    subsidy: '500,000',
    period: '2026.03.10 - 2027.03.09',
    rating: '4.2',
    enrollment: '32/50',
  },
  {
    id: 2,
    title: 'K-Digital Training: 생성형 AI 활용 프론트엔드 개발',
    academy: '(주)그렙',
    region: '서울',
    subsidy: '500,000',
    period: '2026.04.01 - 2027.03.31',
    rating: '4.5',
    enrollment: '28/40',
  },
  {
    id: 3,
    title: 'K-Digital Training: 생성형 AI 활용 데이터 분석',
    academy: '(주)그렙',
    region: '경기',
    subsidy: '450,000',
    period: '2026.05.15 - 2027.05.14',
    rating: '4.1',
    enrollment: '19/30',
  },
  {
    id: 4,
    title: 'K-Digital Training: 클라우드 네이티브 백엔드',
    academy: '(주)그렙',
    region: '서울',
    subsidy: '520,000',
    period: '2026.06.01 - 2027.05.31',
    rating: '4.2',
    enrollment: '41/50',
  },
  {
    id: 5,
    title: 'K-Digital Training: 생성형 AI 활용 머신러닝',
    academy: '(주)그렙',
    region: '부산',
    subsidy: '480,000',
    period: '2026.07.01 - 2027.06.30',
    rating: '4.7',
    enrollment: '12/25',
  },
  {
    id: 6,
    title: 'K-Digital Training: DevOps 엔지니어링',
    academy: '(주)그렙',
    region: '서울',
    subsidy: '500,000',
    period: '2026.08.10 - 2027.08.09',
    rating: '4.3',
    enrollment: '22/35',
  },
  {
    id: 7,
    title: 'K-Digital Training: 풀스택 웹 개발',
    academy: '(주)그렙',
    region: '대전',
    subsidy: '430,000',
    period: '2026.09.01 - 2027.08.31',
    rating: '4.0',
    enrollment: '15/30',
  },
  {
    id: 8,
    title: 'K-Digital Training: AI 서비스 기획',
    academy: '(주)그렙',
    region: '서울',
    subsidy: '460,000',
    period: '2026.10.01 - 2027.09.30',
    rating: '4.6',
    enrollment: '8/20',
  },
]

export const COURSE_SORT_MODES = ['만족도순', '임박순'] as const
export type CourseSortMode = (typeof COURSE_SORT_MODES)[number]

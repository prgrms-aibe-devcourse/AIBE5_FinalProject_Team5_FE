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

/** API 연동 후 제거 예정 — 찜 목록 더미 데이터 */
export const favoriteCourses: Course[] = [
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

export type RecentCourse = {
  id: number
  title: string
  academy: string
  region: string
  rating: string
  viewedAt: string
}

/** API 연동 후 제거 예정 — 최근 조회 코스 더미 데이터 */
export const recentCourses: RecentCourse[] = [
  {
    id: 101,
    title: '[프로그래머스] 국비지원 프론트엔드 데브코스',
    academy: '(주)그렙',
    region: '서울',
    rating: '4.5',
    viewedAt: '2시간 전',
  },
  {
    id: 102,
    title: '[프로그래머스] 국비지원 백엔드 데브코스',
    academy: '(주)그렙',
    region: '서울',
    rating: '4.3',
    viewedAt: '어제',
  },
  {
    id: 103,
    title: '[프로그래머스] 국비지원 AI 데브코스',
    academy: '(주)그렙',
    region: '경기',
    rating: '4.7',
    viewedAt: '3일 전',
  },
  {
    id: 104,
    title: '[프로그래머스] 프론티스트 대비',
    academy: '(주)그렙',
    region: '서울',
    rating: '4.1',
    viewedAt: '5일 전',
  },
  {
    id: 105,
    title: '[이젠아카데미] 인테리어 스케치업 + 캐드',
    academy: '이젠아카데미',
    region: '부산',
    rating: '4.0',
    viewedAt: '1주 전',
  },
]

export const COURSE_SORT_MODES = ['정렬', '평점순', '최신순'] as const
export type CourseSortMode = (typeof COURSE_SORT_MODES)[number]

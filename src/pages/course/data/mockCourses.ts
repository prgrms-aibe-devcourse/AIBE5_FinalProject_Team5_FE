/** 
  과정 조회 API 연동 전 임시 데이터
  사용처: CourseSearchPage, CourseSearchHero 
**/

import type { Course, CourseFilterConfig } from '../../../services/course.ts'

/** CourseResultsToolbar — "총 N개의 결과" 표시용 (mock) */
export const TOTAL_MOCK_RESULTS = 28

/** CourseSearchHero 필터 4종 **/
export const COURSE_FILTERS: CourseFilterConfig[] = [
  // 분야
  {
    id: 'category',
    label: '분야',
    expandList: true,
    options: [
      { value: 'all', label: '전체 분야' },
      { value: 'app-sw', label: '응용 SW' },
      { value: 'ui-ux', label: 'UI/UX' },
      { value: 'bigdata', label: '빅데이터' },
      { value: 'ai', label: '인공지능' },
      { value: 'cloud', label: '클라우드' },
      { value: 'security', label: '보안' },
      { value: 'vr', label: 'VR' },
    ],
  },
  // 가격
  {
    id: 'price',
    label: '가격',
    options: [
      { value: 'all', label: '전체 가격' },
      { value: 'paid', label: '유료' },
      { value: 'free', label: '무료' },
    ],
  },
  // 지역
  {
    id: 'region',
    label: '지역',
    expandList: true,
    options: [
      { value: 'all', label: '전체 지역' },
      { value: 'seoul', label: '서울' },
      { value: 'gyeonggi', label: '경기도' },
      { value: 'gangwon', label: '강원도' },
      { value: 'chungcheong', label: '충청도' },
      { value: 'jeolla', label: '전라도' },
      { value: 'gyeongsang', label: '경상도' },
      { value: 'jeju', label: '제주도' },
    ],
  },
  // 교육 기간
  {
    id: 'duration',
    label: '기간',
    options: [
      { value: 'all', label: '전체 기간' },
      { value: '3m', label: '3개월 이하' },
      { value: '6m', label: '6개월 이하' },
      { value: '12m', label: '12개월 이하' },
    ],
  },
]

/** 카드 공통 필드 — MOCK_COURSES 에 spread */
const baseCourse = {
  title: 'K-Digital Training: 생성형 AI 활용 백엔드',
  company: '(주)그렙',
  location: '서울',
  price: '500,000',
  dateRange: '2026.03.01 - 2027.02.28',
  satisfaction: '4.3/5',
  employmentRate: '45%',
  rating: '4/5',
} as const

/** 1페이지 9장 과정 카드 (3×3) */
export const MOCK_COURSES: Course[] = [
  { id: '1', ...baseCourse },
  { id: '2', ...baseCourse },
  { id: '3', ...baseCourse },
  { id: '4', ...baseCourse },
  { id: '5', ...baseCourse },
  { id: '6', ...baseCourse },
  { id: '7', ...baseCourse },
  { id: '8', ...baseCourse },
  { id: '9', ...baseCourse },
]

/** 과정 비교 상한 */
export const MAX_COMPARE_COURSES = 3

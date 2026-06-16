/**
  과정 조회 페이지 필터 UI 설정 (API와 무관한 화면 전용 설정)
  사용처: CourseSearchPage, CourseSearchHero
**/

import type { CourseFilterConfig } from '../../../services/course.ts'

/** CourseSearchHero 필터 4종 **/
export const COURSE_FILTERS: CourseFilterConfig[] = [
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
  {
    id: 'price',
    label: '가격',
    options: [
      { value: 'all', label: '전체 가격' },
      { value: 'paid', label: '유료' },
      { value: 'free', label: '무료' },
    ],
  },
  {
    id: 'region',
    label: '지역',
    expandList: true,
    options: [
      { value: 'all', label: '전체 지역' },
      { value: '11', label: '서울' },
      { value: '41', label: '경기' },
      { value: '42', label: '강원' },
      { value: '43', label: '충북' },
      { value: '44', label: '충남' },
      { value: '45', label: '전북' },
      { value: '46', label: '전남' },
      { value: '47', label: '경북' },
      { value: '48', label: '경남' },
      { value: '26', label: '부산' },
      { value: '27', label: '대구' },
      { value: '28', label: '인천' },
      { value: '29', label: '광주' },
      { value: '30', label: '대전' },
      { value: '31', label: '울산' },
      { value: '50', label: '제주' },
    ],
  },
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

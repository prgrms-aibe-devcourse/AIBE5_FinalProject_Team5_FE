/**
 * 과정 상세 API 연동 전 임시 데이터
 * 사용처: CourseDetailPage
 */

import type { CourseDetail } from '../../../services/course.ts'

const DEFAULT_DETAIL: Omit<CourseDetail, 'id'> = {
  title: 'K-Digital Training: 생성형 AI 활용 백엔드 개발',
  company: '(주) 그렙',
  location: '서울',
  price: '500,000원',
  dateRange: '2026.03.01 ~ 2027.02.28',
  satisfaction: '4.3/5',
  employmentRate: '45%',
  rating: '4/5',
  batch: '8기',
  recruitment: {
    capacity: 50,
    applicants: 38,
    confirmed: 33,
  },
  eligibility:
    '만 15세 이상 ~ 만 29세 이하 청년\n' +
    '국민내일배움카드 소지자\n' +
    '해당 분야 기초 지식 보유자 우대',
  goals:
    '생성형 AI 도구를 활용한 백엔드 서비스 설계·구현 역량 강화\n' +
    'REST API 및 데이터베이스 기반 실무 프로젝트 수행\n' +
    '협업·문서화·배포까지 포함한 엔드투엔드 개발 경험 확보',
  otherInfo:
    '교육 시간: 월~금 09:00 ~ 18:00\n' +
    '교육 장소: 서울 강남 캠퍼스\n' +
    '수료 후 취업 연계 프로그램 제공',
  institutionInfo:
    '그렙은 실무 중심의 IT 교육을 제공하는 기업으로, K-Digital Training 등 다양한 국비지원 과정을 운영하고 있습니다.',
  contact: {
    phone: '02-1234-5678',
    email: 'contact@grepp.co',
  },
  titleLink: 'https://www.work24.go.kr',
  homepageUrl: 'https://www.grepp.co',
}

/** 목록·상세 mock id 모두 동일 레이아웃으로 응답 */
export function getMockCourseDetail(courseId: string): CourseDetail {
  return {
    id: courseId,
    ...DEFAULT_DETAIL,
  }
}

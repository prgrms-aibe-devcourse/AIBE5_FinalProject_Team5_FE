/** 메인 페이지 목 데이터 */

export interface PopularCourse {
  id: number
  title: string
  academy: string
  region: string
  subsidy: string
  period: string
  rating: string
  capacity: string
}

export const popularCourses: PopularCourse[] = [
  {
    id: 1,
    title: 'K-Digital Training: 생성형 AI 활용 백엔드 개발',
    academy: '(주)그렙',
    region: '서울',
    subsidy: '500,000',
    period: '2026.03.02 - 2026.09.01',
    rating: '4.2',
    capacity: '32/50',
  },
  {
    id: 2,
    title: 'K-Digital Training: 클라우드 네이티브 풀스택',
    academy: '(주)그렙',
    region: '서울',
    subsidy: '480,000',
    period: '2026.03.10 - 2026.09.08',
    rating: '4.5',
    capacity: '28/40',
  },
  {
    id: 3,
    title: 'K-Digital Training: 데이터 분석 & AI 엔지니어링',
    academy: '(주)그렙',
    region: '경기',
    subsidy: '520,000',
    period: '2026.03.16 - 2026.09.14',
    rating: '4.1',
    capacity: '41/50',
  },
  {
    id: 4,
    title: 'K-Digital Training: 프론트엔드 심화 부트캠프',
    academy: '(주)그렙',
    region: '서울',
    subsidy: '450,000',
    period: '2026.04.01 - 2026.09.30',
    rating: '4.6',
    capacity: '19/40',
  },
  {
    id: 5,
    title: 'K-Digital Training: 클라우드 보안 전문가 과정',
    academy: '(주)그렙',
    region: '부산',
    subsidy: '510,000',
    period: '2026.04.06 - 2026.10.05',
    rating: '4.3',
    capacity: '23/45',
  },
  {
    id: 6,
    title: 'K-Digital Training: UI/UX 프로덕트 디자인',
    academy: '(주)그렙',
    region: '서울',
    subsidy: '470,000',
    period: '2026.04.13 - 2026.10.12',
    rating: '4.4',
    capacity: '30/40',
  },
]

export interface Review {
  id: number
  nickname: string
  course: string
  rating: string
  text: string
}

export const reviews: Review[] = [
  {
    id: 1,
    nickname: '바다거북',
    course: '생성형 AI 백엔드',
    rating: '4.2',
    text: '커리큘럼이 탄탄하고 멘토님 피드백이 빨라서 막히는 부분 없이 끝까지 완주했어요.',
  },
  {
    id: 2,
    nickname: '코딩하는곰',
    course: '클라우드 풀스택',
    rating: '4.5',
    text: '실무에 가까운 프로젝트 위주라 포트폴리오 만들기에 정말 좋았습니다.',
  },
  {
    id: 3,
    nickname: '데이터러버',
    course: '데이터 분석',
    rating: '4.8',
    text: '비전공자였는데 기초부터 차근차근 알려주셔서 취업까지 성공했어요. 강력 추천!',
  },
  {
    id: 4,
    nickname: '프론트초보',
    course: '프론트엔드 심화',
    rating: '4.4',
    text: '동기들과 함께 성장하는 분위기가 좋았고, 취업 지원 프로그램도 알찼습니다.',
  },
  {
    id: 5,
    nickname: '보안덕후',
    course: '클라우드 보안',
    rating: '4.3',
    text: '현직자 특강이 많아서 트렌드를 파악하는 데 큰 도움이 됐어요.',
  },
]

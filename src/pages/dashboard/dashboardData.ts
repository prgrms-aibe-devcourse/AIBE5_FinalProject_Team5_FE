export type Course = {
  id: number
  title: string
  academy: string
  region: string
  subsidy: string
  period: string
  rating: string
}

export type ScheduleEvent = {
  id: number
  date: string
  title: string
  startTime: string
  endTime: string
  description: string
}

export const favoriteCourses: Course[] = [
  {
    id: 1,
    title: 'K-Digital Training: 생성형 AI 활용 백엔드 개발',
    academy: '(주)그렙',
    region: '서울',
    subsidy: '500,000',
    period: '2026.xx.xx - 2027.xx.xx',
    rating: '4.2',
  },
  {
    id: 2,
    title: 'K-Digital Training: 생성형 AI 활용 프론트엔드 개발',
    academy: '(주)그렙',
    region: '서울',
    subsidy: '500,000',
    period: '2026.xx.xx - 2027.xx.xx',
    rating: '4.5',
  },
  {
    id: 3,
    title: 'K-Digital Training: 생성형 AI 활용 데이터 분석',
    academy: '(주)그렙',
    region: '서울',
    subsidy: '500,000',
    period: '2026.xx.xx - 2027.xx.xx',
    rating: '4.1',
  },
  {
    id: 4,
    title: 'K-Digital Training: 생성형 AI 활용 백엔드 개발',
    academy: '(주)그렙',
    region: '서울',
    subsidy: '500,000',
    period: '2026.xx.xx - 2027.xx.xx',
    rating: '4.2',
  },
  {
    id: 5,
    title: 'K-Digital Training: 생성형 AI 활용 머신러닝',
    academy: '(주)그렙',
    region: '서울',
    subsidy: '500,000',
    period: '2026.xx.xx - 2027.xx.xx',
    rating: '4.7',
  },
  {
    id: 6,
    title: 'K-Digital Training: 생성형 AI 활용 백엔드 개발',
    academy: '(주)그렙',
    region: '서울',
    subsidy: '500,000',
    period: '2026.xx.xx - 2027.xx.xx',
    rating: '4.3',
  },
  {
    id: 7,
    title: 'K-Digital Training: 생성형 AI 활용 백엔드 개발',
    academy: '(주)그렙',
    region: '서울',
    subsidy: '500,000',
    period: '2026.xx.xx - 2027.xx.xx',
    rating: '4.0',
  },
  {
    id: 8,
    title: 'K-Digital Training: 생성형 AI 활용 백엔드 개발',
    academy: '(주)그렙',
    region: '서울',
    subsidy: '500,000',
    period: '2026.xx.xx - 2027.xx.xx',
    rating: '4.6',
  },
]

export const recentPosts = [
  '[프로그래머스] 국비지원 프론트엔드 데브코스 리뷰',
  '네이버 부트캠프 수료 후 취업 성공기',
  '카카오뱅크 면접 후기',
  '카카오 모빌리티 대비 스터디 구인',
]

export const recentCourses = [
  '[프로그래머스] 국비지원 프론트엔드 데브코스',
  '[프로그래머스] 국비지원 백엔드 데브코스',
  '[프로그래머스] 국비지원 AI 데브코스',
  '[프로그래머스] 프론티스트 대비',
  '[이젠아카데미] 인테리어 스케치업 + 캐드',
  '[SBS아카데미] 어쩌구저쩌구',
]

export const scheduleEvents: ScheduleEvent[] = [
  {
    id: 1,
    date: '2026-06-15',
    title: '프로젝트 회의',
    startTime: '11:00',
    endTime: '12:00',
    description: '주간 진행 상황과 다음 작업을 정리합니다.',
  },
  {
    id: 2,
    date: '2026-06-15',
    title: '백엔드 스터디',
    startTime: '19:00',
    endTime: '20:30',
    description: '에러 처리와 API 계약을 다시 점검합니다.',
  },
  {
    id: 3,
    date: '2026-06-17',
    title: '포트폴리오 정리',
    startTime: '14:00',
    endTime: '15:30',
    description: '지원용 포트폴리오 문구와 레이아웃을 다듬습니다.',
  },
  {
    id: 4,
    date: '2026-06-17',
    title: '면접 준비',
    startTime: '20:00',
    endTime: '21:00',
    description: '자주 묻는 질문과 답변을 연습합니다.',
  },
  {
    id: 5,
    date: '2026-06-24',
    title: '팀 미팅',
    startTime: '10:00',
    endTime: '11:00',
    description: '역할 분담과 일정 확인을 진행합니다.',
  },
  {
    id: 6,
    date: '2026-06-24',
    title: '리뷰 작성',
    startTime: '13:00',
    endTime: '14:00',
    description: '학습 후기를 정리해서 게시글로 남깁니다.',
  },
  {
    id: 7,
    date: '2026-06-24',
    title: '자료 업로드',
    startTime: '16:00',
    endTime: '16:30',
    description: '공유 문서를 최신 상태로 맞춥니다.',
  },
  {
    id: 8,
    date: '2026-06-25',
    title: '컨디션 체크',
    startTime: '09:00',
    endTime: '09:30',
    description: '일주일 학습 흐름을 점검합니다.',
  },
  {
    id: 9,
    date: '2026-06-25',
    title: '코드 정리',
    startTime: '15:00',
    endTime: '16:00',
    description: '중복 로직과 공통 컴포넌트를 묶습니다.',
  },
]

export const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

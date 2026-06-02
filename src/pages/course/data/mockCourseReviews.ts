export interface RatingBarItem {
  score: number
  count: number
}

export interface KeywordBarItem {
  label: string
  value: number
}

export interface MockReviewItem {
  id: number
  user: string
  rating: number
  content: string
}

export interface VerifiedReviewDetail {
  majorStatus: '전공자' | '비전공자' | '기타'
  recommendTarget: string
  overallComment: string
  metrics: KeywordBarItem[]
}

export interface MockVerifiedReviewItem extends MockReviewItem {
  verified: true
  detail: VerifiedReviewDetail
}

export const MOCK_RATING_BARS: RatingBarItem[] = [
  { score: 5, count: 320 },
  { score: 4, count: 180 },
  { score: 3, count: 95 },
  { score: 2, count: 35 },
  { score: 1, count: 23 },
]

export const MOCK_KEYWORD_BARS: KeywordBarItem[] = [
  { label: '강의 품질', value: 3 },
  { label: '문항 환경', value: 2 },
  { label: '협업 환경', value: 5 },
  { label: '학습 밀도', value: 4 },
  { label: '취업 지원', value: 2 },
  { label: '시설 환경', value: 4 },
]

export const MOCK_REVIEWS: MockReviewItem[] = [
  {
    id: 1,
    user: '사용자',
    rating: 5,
    content:
      '프로젝트 중심 수업이라 실무 감각을 키우기 좋았습니다. 멘토 피드백도 빨라 만족했습니다.',
  },
  {
    id: 2,
    user: '사용자',
    rating: 4,
    content:
      '커리큘럼이 체계적이고 취업 관련 특강이 도움이 되었습니다. 과제 난이도는 약간 높은 편입니다.',
  },
  {
    id: 3,
    user: '사용자',
    rating: 4,
    content: '중간 점검 세션이 자주 있어 학습 방향을 잡기 좋았습니다.',
  },
]

export const MOCK_VERIFIED_REVIEWS: MockVerifiedReviewItem[] = [
  {
    id: 101,
    user: '사용자',
    verified: true,
    rating: 5,
    content: '실습 비중이 높아서 좋았고 팀 프로젝트 경험이 커리어에 큰 도움이 되었습니다.',
    detail: {
      majorStatus: '비전공자',
      recommendTarget: '실무 프로젝트 기반으로 성장하고 싶은 학습자',
      overallComment: '기초부터 단계적으로 올라가는 구성이라 비전공자도 따라가기 수월했습니다.',
      metrics: [
        { label: '강의 품질', value: 5 },
        { label: '문항 환경', value: 4 },
        { label: '협업 환경', value: 4 },
        { label: '학습 밀도', value: 5 },
        { label: '취업 지원', value: 4 },
        { label: '시설 환경', value: 4 },
      ],
    },
  },
  {
    id: 102,
    user: '사용자',
    verified: true,
    rating: 4,
    content: '멘토 피드백과 코드리뷰가 촘촘해서 학습 만족도가 높았습니다.',
    detail: {
      majorStatus: '전공자',
      recommendTarget: '백엔드 포트폴리오 완성을 목표로 하는 취준생',
      overallComment: '심화 주제까지 확장 가능해서 전공자에게도 충분히 유의미했습니다.',
      metrics: [
        { label: '강의 품질', value: 4 },
        { label: '문항 환경', value: 3 },
        { label: '협업 환경', value: 5 },
        { label: '학습 밀도', value: 4 },
        { label: '취업 지원', value: 3 },
        { label: '시설 환경', value: 4 },
      ],
    },
  },
]


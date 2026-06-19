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
  reviewedAt?: string | null
}

export interface VerifiedReviewDetail {
  // Step1
  priorKnowledgeLevel: '비전공' | '전공' | '현직'
  age: number
  learningGoal: '취업' | '이직' | '포트폴리오' | '창업' | '기타'
  attendanceType: '온라인' | '오프라인' | '혼합'
  cohort: number
  // Step2
  courseDifficulty: '상' | '중' | '하'
  progressSpeed: '느림' | '적당' | '빠름'
  teamProjectDifficulty: '상' | '중' | '하'
  avgSelfStudyHours: number
  // Step3
  instructorDeliveryRating: number
  curriculumRating: number
  employmentSupportSatisfactionRating: number
  // Step4
  projectCount: number
  projectAchievementRating: number
  toolSupportRating: number
  mentoringSatisfactionRating: number
  // Step5
  completionStatus: '수료' | '수강 중' | '중도 포기'
  dropoutMajorReason?: string
  dropoutSubReason?: string
  employmentStatusIn6Months?: '취업' | '준비중'
  freeReview: string
}

export interface MockVerifiedReviewItem extends MockReviewItem {
  verified: true
  detail: VerifiedReviewDetail
}

export const PRIOR_KNOWLEDGE_COLORS: Record<VerifiedReviewDetail['priorKnowledgeLevel'], string> = {
  비전공: '#5C6AC4',
  전공: '#E88EB0',
  현직: '#8BB4D2',
}

export interface PriorKnowledgeStatItem {
  level: VerifiedReviewDetail['priorKnowledgeLevel']
  count: number
  color: string
}

export interface VerifiedReviewStats {
  reviewCount: number
  averageRating: number
  ratingBars: RatingBarItem[]
  priorKnowledgeDistribution: PriorKnowledgeStatItem[]
  qualityMetrics: KeywordBarItem[]
}

export function getVerifiedReviewStats(reviews: MockVerifiedReviewItem[]): VerifiedReviewStats {
  const reviewCount = reviews.length

  const ratingBars: RatingBarItem[] = [5, 4, 3, 2, 1].map((score) => ({
    score,
    count: reviews.filter((review) => review.rating === score).length,
  }))

  const priorKnowledgeLevels: VerifiedReviewDetail['priorKnowledgeLevel'][] = ['비전공', '전공', '현직']
  const priorKnowledgeDistribution: PriorKnowledgeStatItem[] = priorKnowledgeLevels.map((level) => ({
    level,
    count: reviews.filter((review) => review.detail.priorKnowledgeLevel === level).length,
    color: PRIOR_KNOWLEDGE_COLORS[level],
  }))

  const qualityMetrics: KeywordBarItem[] = [
    {
      label: '강사 전달력',
      value:
        reviewCount === 0
          ? 0
          : reviews.reduce((sum, review) => sum + review.detail.instructorDeliveryRating, 0) / reviewCount,
    },
    {
      label: '커리큘럼',
      value:
        reviewCount === 0 ? 0 : reviews.reduce((sum, review) => sum + review.detail.curriculumRating, 0) / reviewCount,
    },
    {
      label: '취업 지원',
      value:
        reviewCount === 0
          ? 0
          : reviews.reduce((sum, review) => sum + review.detail.employmentSupportSatisfactionRating, 0) / reviewCount,
    },
    {
      label: '프로젝트 성취도',
      value:
        reviewCount === 0
          ? 0
          : reviews.reduce((sum, review) => sum + review.detail.projectAchievementRating, 0) / reviewCount,
    },
    {
      label: '툴 지원',
      value:
        reviewCount === 0 ? 0 : reviews.reduce((sum, review) => sum + review.detail.toolSupportRating, 0) / reviewCount,
    },
    {
      label: '멘토링',
      value:
        reviewCount === 0
          ? 0
          : reviews.reduce((sum, review) => sum + review.detail.mentoringSatisfactionRating, 0) / reviewCount,
    },
  ]

  const averageRating =
    reviewCount === 0 ? 0 : reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount

  return {
    reviewCount,
    averageRating,
    ratingBars,
    priorKnowledgeDistribution,
    qualityMetrics,
  }
}

export function buildPriorKnowledgeConicGradient(distribution: PriorKnowledgeStatItem[]) {
  const total = distribution.reduce((sum, item) => sum + item.count, 0)
  if (total === 0) return 'conic-gradient(#d8e4f0 0deg 360deg)'

  let degree = 0
  const segments = distribution
    .filter((item) => item.count > 0)
    .map((item) => {
      const start = degree
      degree += (item.count / total) * 360
      return `${item.color} ${start}deg ${degree}deg`
    })

  return `conic-gradient(${segments.join(', ')})`
}

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
      priorKnowledgeLevel: '비전공',
      age: 27,
      learningGoal: '취업',
      attendanceType: '온라인',
      cohort: 12,
      courseDifficulty: '중',
      progressSpeed: '적당',
      teamProjectDifficulty: '중',
      avgSelfStudyHours: 4,
      instructorDeliveryRating: 5,
      curriculumRating: 4,
      employmentSupportSatisfactionRating: 4,
      projectCount: 3,
      projectAchievementRating: 5,
      toolSupportRating: 4,
      mentoringSatisfactionRating: 5,
      completionStatus: '수료',
      employmentStatusIn6Months: '취업',
      freeReview: '기초부터 단계적으로 올라가는 구성이라 비전공자도 따라가기 수월했습니다.',
    },
  },
  {
    id: 102,
    user: '사용자',
    verified: true,
    rating: 4,
    content: '멘토 피드백과 코드리뷰가 촘촘해서 학습 만족도가 높았습니다.',
    detail: {
      priorKnowledgeLevel: '전공',
      age: 31,
      learningGoal: '이직',
      attendanceType: '혼합',
      cohort: 9,
      courseDifficulty: '상',
      progressSpeed: '빠름',
      teamProjectDifficulty: '상',
      avgSelfStudyHours: 5,
      instructorDeliveryRating: 4,
      curriculumRating: 4,
      employmentSupportSatisfactionRating: 3,
      projectCount: 2,
      projectAchievementRating: 4,
      toolSupportRating: 4,
      mentoringSatisfactionRating: 5,
      completionStatus: '중도 포기',
      dropoutMajorReason: '시간/일정',
      dropoutSubReason: '업무 병행 어려움',
      freeReview: '심화 주제까지 확장 가능해서 전공자에게도 충분히 유의미했지만 일정 병행이 어려웠습니다.',
    },
  },
]


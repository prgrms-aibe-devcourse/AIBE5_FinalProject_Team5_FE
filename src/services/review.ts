import { ApiError } from './ApiError'
import { http } from './http'

export interface CrawledReview {
  id: number
  source: 'WORK24'
  reviewerNickname: string | null
  rating: number | null
  content: string | null
  reviewedAt: string | null
  crawledAt: string
}

/** BE 크롤링 후기 응답 — camelCase / snake_case 모두 허용 */
type CrawledReviewDTO = {
  id?: number
  source?: CrawledReview['source']
  reviewerNickname?: string | null
  reviewer_nickname?: string | null
  rating?: number | null
  content?: string | null
  reviewedAt?: unknown
  reviewed_at?: unknown
  reviewDate?: unknown
  review_date?: unknown
  crawledAt?: unknown
  crawled_at?: unknown
}

function pickNullableString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (trimmed) return trimmed
    }
  }
  return null
}

function pickNullableNumber(value: unknown): number | null {
  if (typeof value === 'number' && !Number.isNaN(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (!Number.isNaN(parsed)) return parsed
  }
  return null
}

function formatIsoDateTime(y: number, m: number, d: number, h = 0, min = 0, s = 0): string {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/** API 날짜 필드 → ISO-like 문자열 (LocalDateTime 배열/객체 포함) */
export function parseApiDateTime(value: unknown): string | null {
  if (value == null) return null

  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed || null
  }

  if (Array.isArray(value)) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = value
    if (typeof year === 'number' && typeof month === 'number' && typeof day === 'number') {
      return formatIsoDateTime(year, month, day, Number(hour), Number(minute), Number(second))
    }
    return null
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    if ('year' in record) {
      const year = Number(record.year)
      const month = Number(record.monthValue ?? record.month)
      const day = Number(record.dayOfMonth ?? record.day)
      const hour = Number(record.hour ?? 0)
      const minute = Number(record.minute ?? 0)
      const second = Number(record.second ?? 0)
      if (!Number.isNaN(year) && !Number.isNaN(month) && !Number.isNaN(day)) {
        return formatIsoDateTime(year, month, day, hour, minute, second)
      }
    }
  }

  return null
}

function toCrawledReview(raw: CrawledReviewDTO): CrawledReview {
  return {
    id: Number(raw.id),
    source: raw.source ?? 'WORK24',
    reviewerNickname: pickNullableString(raw.reviewerNickname, raw.reviewer_nickname),
    rating: pickNullableNumber(raw.rating),
    content: pickNullableString(raw.content),
    reviewedAt: parseApiDateTime(raw.reviewedAt ?? raw.reviewed_at ?? raw.reviewDate ?? raw.review_date),
    crawledAt: parseApiDateTime(raw.crawledAt ?? raw.crawled_at) ?? '',
  }
}

// ApiResponse<Page<T>> → http.get이 data를 unwrap → Spring Page 구조
export interface SpringPage<T> {
  content: T[]
  totalPages: number
  totalElements: number
  number: number  // 0-based 현재 페이지
  size: number
  last: boolean
  first: boolean
  empty: boolean
}

/** 고용 24 등 크롤링 후기 목록 — GET /api/courses/{courseId}/crawled-reviews (courseSessionId 아님) */
export async function getCrawledReviews(
  courseId: number,
  page = 0,
  size = 10,
  sort = 'crawledAt,desc',
): Promise<SpringPage<CrawledReview>> {
  const data = await http.get<SpringPage<CrawledReviewDTO>>(
    `/api/courses/${courseId}/crawled-reviews`,
    {
      query: { page, size, sort },
      auth: false,
    },
  )

  return {
    ...data,
    content: (data.content ?? []).map(toCrawledReview),
  }
}

// ──────────────────────────────────────────────
// 과정별 리뷰 목록 GET /api/courses/{courseId}/reviews
// ──────────────────────────────────────────────

export type CourseReviewType = 'GENERAL' | 'VERIFIED'

export interface CourseReviewVerifiedDetail {
  priorKnowledgeLevel: '비전공' | '전공' | '현직'
  age: number
  learningGoal: '취업' | '이직' | '포트폴리오' | '창업' | '기타'
  attendanceType: '온라인' | '오프라인' | '혼합'
  cohort: number
  courseDifficulty: '상' | '중' | '하'
  progressSpeed: '느림' | '적당' | '빠름'
  teamProjectDifficulty: '상' | '중' | '하'
  avgSelfStudyHours: number
  instructorDeliveryRating: number
  curriculumRating: number
  employmentSupportSatisfactionRating: number
  projectCount: number
  projectAchievementRating: number
  toolSupportRating: number
  mentoringSatisfactionRating: number
  completionStatus: '수료' | '수강 중' | '중도 포기'
  dropoutMajorReason?: string | null
  dropoutSubReason?: string | null
  employmentStatusIn6Months?: '취업' | '준비중' | null
  freeReview: string
}

export interface CourseReview {
  reviewId: number
  userNickname: string
  userProfileImageUrl: string | null
  reviewType: CourseReviewType
  rating: number
  content: string
  createdAt: string
  verifiedDetail: CourseReviewVerifiedDetail | null
  courseTitle: string | null
}

type CourseReviewVerifiedDetailDTO = Partial<CourseReviewVerifiedDetail> & {
  priorKnowledgeLevel?: string
  learningGoal?: string
  attendanceType?: string
  courseDifficulty?: string
  progressSpeed?: string
  teamProjectDifficulty?: string
  completionStatus?: string
  employmentStatusIn6Months?: string | null
}

type CourseReviewDTO = {
  reviewId?: number
  review_id?: number
  userId?: number
  userNickname?: string | null
  user_nickname?: string | null
  userProfileImageUrl?: string | null
  user_profile_image_url?: string | null
  courseId?: number
  courseTitle?: string | null
  course_title?: string | null
  courseSessionId?: number | null
  reviewType?: string
  review_type?: string
  rating?: number | null
  content?: string | null
  verifiedDetail?: CourseReviewVerifiedDetailDTO | null
  verified_detail?: CourseReviewVerifiedDetailDTO | null
  createdAt?: unknown
  created_at?: unknown
  updatedAt?: unknown
  updated_at?: unknown
}

function toCourseReviewVerifiedDetail(
  raw: CourseReviewVerifiedDetailDTO | null | undefined,
): CourseReviewVerifiedDetail | null {
  if (!raw) return null

  return {
    priorKnowledgeLevel: (raw.priorKnowledgeLevel ?? '비전공') as CourseReviewVerifiedDetail['priorKnowledgeLevel'],
    age: Number(raw.age) || 0,
    learningGoal: (raw.learningGoal ?? '기타') as CourseReviewVerifiedDetail['learningGoal'],
    attendanceType: (raw.attendanceType ?? '온라인') as CourseReviewVerifiedDetail['attendanceType'],
    cohort: Number(raw.cohort) || 0,
    courseDifficulty: (raw.courseDifficulty ?? '중') as CourseReviewVerifiedDetail['courseDifficulty'],
    progressSpeed: (raw.progressSpeed ?? '적당') as CourseReviewVerifiedDetail['progressSpeed'],
    teamProjectDifficulty: (raw.teamProjectDifficulty ?? '중') as CourseReviewVerifiedDetail['teamProjectDifficulty'],
    avgSelfStudyHours: Number(raw.avgSelfStudyHours) || 0,
    instructorDeliveryRating: Number(raw.instructorDeliveryRating) || 0,
    curriculumRating: Number(raw.curriculumRating) || 0,
    employmentSupportSatisfactionRating: Number(raw.employmentSupportSatisfactionRating) || 0,
    projectCount: Number(raw.projectCount) || 0,
    projectAchievementRating: Number(raw.projectAchievementRating) || 0,
    toolSupportRating: Number(raw.toolSupportRating) || 0,
    mentoringSatisfactionRating: Number(raw.mentoringSatisfactionRating) || 0,
    completionStatus: (raw.completionStatus ?? '수강 중') as CourseReviewVerifiedDetail['completionStatus'],
    dropoutMajorReason: raw.dropoutMajorReason ?? null,
    dropoutSubReason: raw.dropoutSubReason ?? null,
    employmentStatusIn6Months: (raw.employmentStatusIn6Months ?? undefined) as
      CourseReviewVerifiedDetail['employmentStatusIn6Months'],
    freeReview: raw.freeReview ?? '',
  }
}

function toCourseReview(raw: CourseReviewDTO): CourseReview {
  const reviewTypeRaw = (raw.reviewType ?? raw.review_type ?? 'GENERAL').toUpperCase()
  const reviewType: CourseReviewType = reviewTypeRaw === 'VERIFIED' ? 'VERIFIED' : 'GENERAL'
  const verifiedRaw = raw.verifiedDetail ?? raw.verified_detail

  return {
    reviewId: Number(raw.reviewId ?? raw.review_id),
    userNickname: pickNullableString(raw.userNickname, raw.user_nickname) ?? '익명',
    userProfileImageUrl: pickNullableString(raw.userProfileImageUrl, raw.user_profile_image_url),
    reviewType,
    rating: pickNullableNumber(raw.rating) ?? 0,
    content: pickNullableString(raw.content) ?? '',
    createdAt: parseApiDateTime(raw.createdAt ?? raw.created_at) ?? '',
    verifiedDetail: reviewType === 'VERIFIED' ? toCourseReviewVerifiedDetail(verifiedRaw) : null,
    courseTitle: pickNullableString(raw.courseTitle, raw.course_title),
  }
}

export interface GetCourseReviewsParams {
  reviewType?: CourseReviewType
  page?: number
  size?: number
  sort?: string
}

/** 부트시그널 후기 목록 — GET /api/courses/{courseId}/reviews (courseSessionId 아님) */
export async function getCourseReviews(
  courseId: number,
  params: GetCourseReviewsParams = {},
): Promise<SpringPage<CourseReview>> {
  const { reviewType, page = 0, size = 10, sort = 'createdAt,desc' } = params
  const query: Record<string, unknown> = { page, size, sort }
  if (reviewType) query.reviewType = reviewType

  const data = await http.get<SpringPage<CourseReviewDTO>>(
    `/api/courses/${courseId}/reviews`,
    { query, auth: false },
  )

  return {
    ...data,
    content: (data.content ?? []).map(toCourseReview),
  }
}

// ──────────────────────────────────────────────
// 인증 리뷰 통계 GET /api/courses/{courseId}/reviews/statistics
// ──────────────────────────────────────────────

export interface ReviewRatingBar {
  score: number
  count: number
}

export interface ReviewPriorKnowledgeItem {
  value: string
  level: string
  count: number
  color: string
}

export interface ReviewQualityMetric {
  label: string
  value: number
}

export interface VerifiedReviewStatisticsDTO {
  reviewCount: number
  averageRating: number
  ratingBars: ReviewRatingBar[]
  priorKnowledgeDistribution: ReviewPriorKnowledgeItem[]
  qualityMetrics: ReviewQualityMetric[]
}

/** UI 소비용 — mockCourseReviews.VerifiedReviewStats 와 동일 구조 */
export interface VerifiedReviewStatistics {
  reviewCount: number
  averageRating: number
  ratingBars: ReviewRatingBar[]
  priorKnowledgeDistribution: {
    level: '비전공' | '전공' | '현직'
    count: number
    color: string
  }[]
  qualityMetrics: ReviewQualityMetric[]
}

const PRIOR_KNOWLEDGE_LEVELS = ['비전공', '전공', '현직'] as const

export function createEmptyVerifiedReviewStatistics(): VerifiedReviewStatistics {
  return {
    reviewCount: 0,
    averageRating: 0,
    ratingBars: [5, 4, 3, 2, 1].map((score) => ({ score, count: 0 })),
    priorKnowledgeDistribution: [
      { level: '비전공', count: 0, color: '#5C6AC4' },
      { level: '전공', count: 0, color: '#E88EB0' },
      { level: '현직', count: 0, color: '#8BB4D2' },
    ],
    qualityMetrics: [
      { label: '강사 전달력', value: 0 },
      { label: '커리큘럼', value: 0 },
      { label: '취업 지원', value: 0 },
      { label: '프로젝트 성취도', value: 0 },
      { label: '툴 지원', value: 0 },
      { label: '멘토링', value: 0 },
    ],
  }
}

function toVerifiedReviewStatistics(dto: VerifiedReviewStatisticsDTO): VerifiedReviewStatistics {
  const levelSet = new Set<string>(PRIOR_KNOWLEDGE_LEVELS)
  const priorKnowledgeDistribution = dto.priorKnowledgeDistribution
    .filter((item) => levelSet.has(item.level))
    .map((item) => ({
      level: item.level as VerifiedReviewStatistics['priorKnowledgeDistribution'][number]['level'],
      count: item.count,
      color: item.color,
    }))

  const filledLevels = new Set(priorKnowledgeDistribution.map((item) => item.level))
  for (const level of PRIOR_KNOWLEDGE_LEVELS) {
    if (!filledLevels.has(level)) {
      priorKnowledgeDistribution.push({
        level,
        count: 0,
        color: level === '비전공' ? '#5C6AC4' : level === '전공' ? '#E88EB0' : '#8BB4D2',
      })
    }
  }

  return {
    reviewCount: dto.reviewCount,
    averageRating: Number(dto.averageRating) || 0,
    ratingBars: dto.ratingBars,
    priorKnowledgeDistribution,
    qualityMetrics: dto.qualityMetrics.map((item) => ({
      label: item.label,
      value: Number(item.value) || 0,
    })),
  }
}

/** 과정별 인증 리뷰 통계 */
export async function getVerifiedReviewStatistics(courseId: number): Promise<VerifiedReviewStatistics> {
  const data = await http.get<VerifiedReviewStatisticsDTO>(
    `/api/courses/${courseId}/reviews/statistics`,
    { auth: false },
  )
  return toVerifiedReviewStatistics(data)
}

// ──────────────────────────────────────────────
// 과정 리뷰 작성 POST /api/courses/{courseId}/reviews
// ──────────────────────────────────────────────

export interface CreateVerifiedReviewDetailPayload {
  priorKnowledgeLevel: string
  age: number
  learningGoal: string
  attendanceType: string
  cohort: number
  courseDifficulty: string
  progressSpeed: string
  teamProjectDifficulty: string
  avgSelfStudyHours: number
  instructorDeliveryRating: number
  curriculumRating: number
  employmentSupportRating: number
  projectCount: number
  projectAchievementRating: number
  toolSupportRating: number
  mentoringSatisfactionRating: number
  completionStatus: string
  employmentStatus?: string
  dropoutMajorReason?: string
  dropoutSubReason?: string
  collaborationComment?: string
}

export interface CreateGeneralReviewPayload {
  courseSessionId: number
  reviewType: 'GENERAL'
  overallRating: number
  content: string
}

export interface CreateVerifiedReviewPayload {
  courseSessionId: number
  reviewType: 'VERIFIED'
  verifiedDetail: CreateVerifiedReviewDetailPayload
  content?: string
  rating?: number
}

export type CreateCourseReviewPayload = CreateGeneralReviewPayload | CreateVerifiedReviewPayload

/** 과정 리뷰 작성 */
export async function createCourseReview(
  courseId: number,
  payload: CreateCourseReviewPayload,
): Promise<CourseReview> {
  const data = await http.post<CourseReviewDTO>(`/api/courses/${courseId}/reviews`, payload, { auth: true })
  return toCourseReview(data)
}

/** 최신 리뷰 조회 (글로벌) — GET /api/reviews/latest */
export async function getLatestReviews(limit = 5): Promise<CourseReview[]> {
  const data = await http.get<CourseReviewDTO[]>('/api/reviews/latest', {
    query: { limit },
    auth: false,
  })
  return (data ?? []).map(toCourseReview)
}

// ──────────────────────────────────────────────
// 리뷰 상세·수정·삭제 /api/reviews/{reviewId}
// ──────────────────────────────────────────────

export interface ReviewDetail extends CourseReview {
  courseId: number
  courseSessionId: number
}

export interface UpdateGeneralReviewPayload {
  overallRating?: number
  content?: string
}

export interface UpdateVerifiedReviewPayload {
  content?: string
  verifiedDetail?: CreateVerifiedReviewDetailPayload
}

export type UpdateReviewPayload = UpdateGeneralReviewPayload | UpdateVerifiedReviewPayload

export type VerifiedReviewFormDraft = {
  step1?: {
    priorKnowledgeLevel: string
    age: string
    learningGoal: string
    attendanceType: string
    cohort: string
  }
  step2?: {
    courseDifficulty: string
    progressSpeed: string
    teamProjectDifficulty: string
    avgSelfStudyHours: string
  }
  step3?: {
    instructorDeliveryRating: number
    curriculumRating: number
    employmentSupportRating: number
  }
  step4?: {
    projectCount: string
    projectAchievementRating: number
    toolSupportRating: number
    mentoringSatisfactionRating: number
  }
  step5?: {
    completionStatus: string
    dropoutMajorReason: string
    dropoutSubReason: string
    collaborationComment: string
    employmentStatus: string
  }
}

function toReviewDetail(raw: CourseReviewDTO): ReviewDetail {
  return {
    ...toCourseReview(raw),
    courseId: Number(raw.courseId) || 0,
    courseSessionId: Number(raw.courseSessionId) || 0,
  }
}

function mapLabelToCode(value: string, table: Record<string, string>, fallback: string): string {
  return table[value] ?? (table[value.trim()] ?? fallback)
}

const PRIOR_KNOWLEDGE_TO_CODE: Record<string, string> = {
  비전공: 'non_major',
  non_major: 'non_major',
  전공: 'major',
  major: 'major',
  현직: 'working',
  working: 'working',
}

const LEARNING_GOAL_TO_CODE: Record<string, string> = {
  취업: 'employment',
  employment: 'employment',
  이직: 'career_change',
  career_change: 'career_change',
  포트폴리오: 'portfolio',
  portfolio: 'portfolio',
  창업: 'startup',
  startup: 'startup',
  기타: 'etc',
  etc: 'etc',
}

const ATTENDANCE_TYPE_TO_CODE: Record<string, string> = {
  온라인: 'online',
  online: 'online',
  오프라인: 'offline',
  offline: 'offline',
  혼합: 'hybrid',
  hybrid: 'hybrid',
}

const DIFFICULTY_TO_CODE: Record<string, string> = {
  상: 'high',
  high: 'high',
  중: 'medium',
  medium: 'medium',
  하: 'low',
  low: 'low',
}

const PROGRESS_SPEED_TO_CODE: Record<string, string> = {
  느림: 'slow',
  slow: 'slow',
  적당: 'moderate',
  moderate: 'moderate',
  빠름: 'fast',
  fast: 'fast',
}

const COMPLETION_STATUS_TO_CODE: Record<string, string> = {
  수료: 'completed',
  completed: 'completed',
  '수강 중': 'ongoing',
  ongoing: 'ongoing',
  '중도 포기': 'dropout',
  dropout: 'dropout',
}

const EMPLOYMENT_STATUS_TO_CODE: Record<string, string> = {
  취업: 'employed',
  employed: 'employed',
  준비중: 'preparing',
  preparing: 'preparing',
}

/** API 응답(한글 라벨) → 인증 후기 작성 폼 초기값 */
export function verifiedDetailToFormDraft(
  detail: CourseReviewVerifiedDetail,
  content: string,
): VerifiedReviewFormDraft {
  return {
    step1: {
      priorKnowledgeLevel: mapLabelToCode(detail.priorKnowledgeLevel, PRIOR_KNOWLEDGE_TO_CODE, 'non_major'),
      age: String(detail.age || ''),
      learningGoal: mapLabelToCode(detail.learningGoal, LEARNING_GOAL_TO_CODE, 'etc'),
      attendanceType: mapLabelToCode(detail.attendanceType, ATTENDANCE_TYPE_TO_CODE, 'online'),
      cohort: String(detail.cohort || ''),
    },
    step2: {
      courseDifficulty: mapLabelToCode(detail.courseDifficulty, DIFFICULTY_TO_CODE, 'medium'),
      progressSpeed: mapLabelToCode(detail.progressSpeed, PROGRESS_SPEED_TO_CODE, 'moderate'),
      teamProjectDifficulty: mapLabelToCode(detail.teamProjectDifficulty, DIFFICULTY_TO_CODE, 'medium'),
      avgSelfStudyHours: String(detail.avgSelfStudyHours || ''),
    },
    step3: {
      instructorDeliveryRating: detail.instructorDeliveryRating,
      curriculumRating: detail.curriculumRating,
      employmentSupportRating: detail.employmentSupportSatisfactionRating,
    },
    step4: {
      projectCount: String(detail.projectCount || ''),
      projectAchievementRating: detail.projectAchievementRating,
      toolSupportRating: detail.toolSupportRating,
      mentoringSatisfactionRating: detail.mentoringSatisfactionRating,
    },
    step5: {
      completionStatus: mapLabelToCode(detail.completionStatus, COMPLETION_STATUS_TO_CODE, 'ongoing'),
      dropoutMajorReason: detail.dropoutMajorReason ?? '',
      dropoutSubReason: detail.dropoutSubReason ?? '',
      collaborationComment: detail.freeReview || content,
      employmentStatus: detail.employmentStatusIn6Months
        ? mapLabelToCode(detail.employmentStatusIn6Months, EMPLOYMENT_STATUS_TO_CODE, 'preparing')
        : 'preparing',
    },
  }
}

/** 과정 리뷰 목록에서 reviewId로 검색 */
export async function findCourseReviewById(courseId: number, reviewId: number): Promise<CourseReview | null> {
  let page = 0
  let totalPages = 1

  while (page < totalPages) {
    const data = await getCourseReviews(courseId, { page, size: 50 })
    totalPages = data.totalPages
    const found = data.content.find((review) => review.reviewId === reviewId)
    if (found) return found
    page += 1
  }

  return null
}

/** 리뷰 상세 조회 */
export async function getReview(reviewId: number): Promise<ReviewDetail> {
  const data = await http.get<CourseReviewDTO>(`/api/reviews/${reviewId}`, { auth: true })
  return toReviewDetail(data)
}

/** 수정용 리뷰 조회 — 단건 API 우선, 없으면 과정 리뷰 목록에서 검색 */
export async function loadReviewForEdit(
  courseId: number,
  reviewId: number,
  courseSessionId = 0,
): Promise<ReviewDetail> {
  try {
    return await getReview(reviewId)
  } catch (error) {
    const isNotFound =
      error instanceof ApiError && (error.code === 'REVIEW_NOT_FOUND' || error.status === 404)

    if (!isNotFound) throw error

    const found = await findCourseReviewById(courseId, reviewId)
    if (!found) {
      throw new ApiError('REVIEW_NOT_FOUND', '리뷰를 찾을 수 없습니다.', 404)
    }

    return {
      ...found,
      courseId,
      courseSessionId,
    }
  }
}

/** 리뷰 수정 */
export async function updateReview(reviewId: number, payload: UpdateReviewPayload): Promise<ReviewDetail> {
  const data = await http.patch<CourseReviewDTO>(`/api/reviews/${reviewId}`, payload, { auth: true })
  return toReviewDetail(data)
}

/** 리뷰 삭제 */
export async function deleteReview(reviewId: number): Promise<void> {
  await http.delete<void>(`/api/reviews/${reviewId}`, { auth: true })
}

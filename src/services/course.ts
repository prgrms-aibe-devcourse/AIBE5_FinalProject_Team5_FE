import { http } from './http'
import type { PageResponse } from './apiTypes'
import { toAbsoluteUrl } from '../utils/toAbsoluteUrl'

// ──────────────────────────────────────────────
// FE 뷰모델 — 컴포넌트가 소비하는 타입
// ──────────────────────────────────────────────

/** 필터 UI 설정 (BE와 무관한 화면 전용) */
export interface CourseFilterOption {
  value: string
  label: string
}

export interface CourseFilterConfig {
  id: string
  label: string
  options: CourseFilterOption[]
  /** true면 목록 전체 표시, false/미설정이면 maxListHeightClass 높이까지 보이고 스크롤 */
  expandList?: boolean
  maxListHeightClass?: string
}

/** 정렬 키 (FE 전용 — BE 파라미터 없음) */
export type CourseSortKey = 'latest' | 'mostReviews' | 'rating' | 'satisfaction'

/** 과정 카드 뷰모델 */
export interface Course {
  id: string
  courseSessionId?: number
  title: string
  company: string
  location: string
  price: string
  dateRange: string
  satisfaction: string
  employmentRate: string
  rating: string
  logoUrl?: string
}

export interface CourseRecruitment {
  capacity: number
  applicants: number
  confirmed: number
}

export interface CourseContact {
  phone: string
  email: string
}

/** 과정 상세 뷰모델 */
export interface CourseDetail extends Course {
  batch: string
  recruitment: CourseRecruitment
  eligibility: string
  goals: string
  otherInfo: string
  institutionInfo: string
  contact: CourseContact
  titleLink: string | null
  homepageUrl: string | null
  /** stdgScor → 5점 만점 환산 (비교 요약 별점용) */
  satisfactionOutOf5?: number | null
}

// ──────────────────────────────────────────────
// BE DTO — 실제 API 응답 형태
// ──────────────────────────────────────────────

export interface CourseListItem {
  id: number
  courseId?: number
  courseSessionId?: number
  trprId: string
  title: string
  institutionName: string
  trngAreaCd: string
  courseMan: number | null
  selfPaymentAmount: number | null
  stdgScor: number | null
  totalTrainingDays: number | null
  totalTrainingHours: number | null
  ncsName: string | null
  profileImageUrl: string | null
  traStartDate?: string | null
  traEndDate?: string | null
  eiEmplRate3?: string | null
  eiEmplRate6?: string | null
  reviewRating?: number | null
  employmentRate?: number | null
}

export interface InstitutionDetail {
  id: number
  instCd: string
  institutionName: string
  address: string | null
  homepageUrl: string | null
  managerName: string | null
  managerTel: string | null
  managerEmail: string | null
  profileImageUrl: string | null
  introduction: string | null
  createdAt: string
  updatedAt: string
}

export interface BECourseDetail {
  id: number
  trprId: string
  title: string
  ncsCd: string | null
  ncsName: string | null
  ncsYn: string | null
  courseMan: number | null
  selfPaymentAmount: number | null
  stdgScor: number | null
  totalTrainingDays: number | null
  totalTrainingHours: number | null
  trngAreaCd: string | null
  trainingTargetRequirements: string | null
  trainingGoal: string | null
  titleLink: string | null
  createdAt: string
  updatedAt: string
  institution: InstitutionDetail | null
}

export interface CourseSession {
  id: number
  trprDegr: number
  traStartDate: string
  traEndDate: string
  yardMan: number | null
  regCourseMan: number | null
  totParMks: number | null
  finiCnt: number | null
  eiEmplRate3: string | null
  eiEmplRate6: string | null
  wkendSe: string | null
  selectedTraineeCount: number | null
  recruitmentCount: number | null
  confirmedTraineeCount: number | null
  employmentRate: number | null
  titleLink: string | null
  courseMan: number | null
  selfPaymentAmount: number | null
  totalTrainingDays: number | null
  totalTrainingHours: number | null
}

/** GET /api/course-sessions/{courseSessionId} 응답 — 회차 + 과정 + 기관 통합 */
export interface BECourseSessionDetail {
  id: number
  trprDegr: number
  traStartDate: string
  traEndDate: string
  yardMan: number | null
  regCourseMan: number | null
  totParMks: number | null
  finiCnt: number | null
  eiEmplRate3: string | null
  eiEmplRate6: string | null
  wkendSe: string | null
  selectedTraineeCount: number | null
  recruitmentCount: number | null
  confirmedTraineeCount: number | null
  employmentRate: number | null
  titleLink: string | null
  courseId: number
  trprId: string
  title: string
  subTitle: string | null
  subTitleLink: string | null
  ncsCd: string | null
  ncsName: string | null
  ncsYn: string | null
  courseMan: number | null
  selfPaymentAmount: number | null
  stdgScor: number | null
  totalTrainingDays: number | null
  totalTrainingHours: number | null
  trngAreaCd: string | null
  trainingTargetRequirements: string | null
  trainingGoal: string | null
  createdAt: string
  updatedAt: string
  institution: InstitutionDetail | null
}

// ──────────────────────────────────────────────
// API 파라미터 (BE GET /api/courses 쿼리 규격)
// ──────────────────────────────────────────────

export type FieldCategory =
  | 'AI'
  | 'SECURITY'
  | 'BIG_DATA'
  | 'CLOUD'
  | 'UI_UX'
  | 'VR'
  | 'APP_SW'
  | 'OTHERS'

export type PriceRange = 'BELOW_30' | 'BELOW_45' | 'BELOW_60'

export type DurationFilter = 'WITHIN_3_MONTHS' | 'WITHIN_6_MONTHS' | 'OVER_6_MONTHS'

export interface CourseListParams {
  keyword?: string
  trngAreaCd?: string
  fieldCategory?: FieldCategory
  priceRange?: PriceRange
  durationFilter?: DurationFilter
  page?: number // 0-based (BE 규격)
  size?: number
}

/** BE 분야 카테고리 목록 (fieldCategory 필터 옵션) */
export const FIELD_CATEGORIES: { category: FieldCategory; label: string }[] = [
  { category: 'AI', label: '인공지능' },
  { category: 'SECURITY', label: '보안' },
  { category: 'BIG_DATA', label: '빅데이터' },
  { category: 'CLOUD', label: '클라우드' },
  { category: 'UI_UX', label: 'UI/UX' },
  { category: 'VR', label: 'VR/AR' },
  { category: 'APP_SW', label: '응용SW' },
]

/** BE 지역 코드 목록 (trngAreaCd 필터 옵션) */
export const TRAINING_AREAS: { code: string; name: string }[] = [
  { code: '11', name: '서울' },
  { code: '26', name: '부산' },
  { code: '27', name: '대구' },
  { code: '28', name: '인천' },
  { code: '29', name: '광주' },
  { code: '30', name: '대전' },
  { code: '31', name: '울산' },
  { code: '36', name: '세종' },
  { code: '41', name: '경기' },
  { code: '43', name: '충북' },
  { code: '44', name: '충남' },
  { code: '46', name: '전남' },
  { code: '47', name: '경북' },
  { code: '48', name: '경남' },
  { code: '50', name: '제주' },
  { code: '51', name: '강원' },
  { code: '52', name: '전북' },
]

export const PRICE_RANGE_OPTIONS: { value: PriceRange; label: string }[] = [
  { value: 'BELOW_30', label: '30만원 이하' },
  { value: 'BELOW_45', label: '45만원 이하' },
  { value: 'BELOW_60', label: '60만원 이하' },
]

export const DURATION_FILTER_OPTIONS: { value: DurationFilter; label: string }[] = [
  { value: 'WITHIN_3_MONTHS', label: '3개월 이내' },
  { value: 'WITHIN_6_MONTHS', label: '6개월 이내' },
  { value: 'OVER_6_MONTHS', label: '6개월 이상' },
]

const FILTER_ALL = 'all'

/** BE 지역 코드 → 지역명 (카드 location 표시용) */
export function buildAreaCodeMap(): Record<string, string> {
  return Object.fromEntries(TRAINING_AREAS.map(({ code, name }) => [code, name]))
}

/** 필터 UI 설정 — BE enum·목록 기준 */
export function buildCourseFilters(): CourseFilterConfig[] {
  return [
    {
      id: 'category',
      label: '분야',
      expandList: true,
      options: [
        { value: FILTER_ALL, label: '전체 분야' },
        ...FIELD_CATEGORIES.map(({ category, label }) => ({ value: category, label })),
      ],
    },
    {
      id: 'price',
      label: '가격',
      options: [
        { value: FILTER_ALL, label: '전체 가격' },
        ...PRICE_RANGE_OPTIONS.map(({ value, label }) => ({ value, label })),
      ],
    },
    {
      id: 'region',
      label: '지역',
      maxListHeightClass: 'max-h-52',
      options: [
        { value: FILTER_ALL, label: '전체 지역' },
        ...TRAINING_AREAS.map(({ code, name }) => ({ value: code, label: name })),
      ],
    },
    {
      id: 'duration',
      label: '기간',
      options: [
        { value: FILTER_ALL, label: '전체 기간' },
        ...DURATION_FILTER_OPTIONS.map(({ value, label }) => ({ value, label })),
      ],
    },
  ]
}

/** 필터 UI 상태 → GET /api/courses 쿼리 파라미터 */
export function toCourseListParams(
  filterValues: Record<string, string>,
  keyword: string,
  currentPage: number,
  size = 9,
): CourseListParams {
  const category = filterValues.category
  const price = filterValues.price
  const region = filterValues.region
  const duration = filterValues.duration

  return {
    keyword: keyword.trim() || undefined,
    fieldCategory: category && category !== FILTER_ALL ? (category as FieldCategory) : undefined,
    priceRange: price && price !== FILTER_ALL ? (price as PriceRange) : undefined,
    trngAreaCd: region && region !== FILTER_ALL ? region : undefined,
    durationFilter: duration && duration !== FILTER_ALL ? (duration as DurationFilter) : undefined,
    page: currentPage - 1,
    size,
  }
}

// ──────────────────────────────────────────────
// 매퍼 (BE DTO → FE 뷰모델)
// ──────────────────────────────────────────────

const AREA_CODE_MAP = buildAreaCodeMap()

function formatAreaCode(code: string | null | undefined): string {
  if (!code) return '-'
  const prefix = code.slice(0, 2)
  return AREA_CODE_MAP[prefix] ?? code
}

export function formatCoursePrice(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '-'
  if (amount === 0) return '무료'
  return amount.toLocaleString('ko-KR') + '원'
}

function formatDateRange(
  start: string | null | undefined,
  end: string | null | undefined,
): string {
  if (start && end) return `${start} ~ ${end}`
  if (start || end) return start ?? end ?? '-'
  return '-'
}

/** 카드 통계 등 짧은 영역용 — 데이터 없음 표시 */
export const COURSE_STAT_PLACEHOLDER = '—'

export function isCourseStatPlaceholder(value: string): boolean {
  return value === COURSE_STAT_PLACEHOLDER
}

/** 화면 표시용 결측값 여부 (정보 없음, -, —, 0%) */
export function isMissingDisplayValue(value: string | null | undefined): boolean {
  if (!value) return true
  const trimmed = value.trim()
  if (trimmed === '-' || trimmed === '—' || trimmed === '정보 없음' || trimmed === COURSE_STAT_PLACEHOLDER) {
    return true
  }
  if (trimmed.endsWith('%')) {
    const numeric = parseFloat(trimmed.replace(/[^\d.]/g, ''))
    if (Number.isNaN(numeric) || numeric === 0) return true
  }
  return false
}

/** 고용24 stdgScor(100점/%) → 5점 만점 환산. 5 이하 값은 이미 5점 척도로 간주 */
export function stdgScorToFivePoint(score: number | null | undefined): number | null {
  if (score == null || score === 0) return null
  const outOf5 = score > 5 ? (score / 100) * 5 : score
  return Math.min(5, Math.round(outOf5 * 10) / 10)
}

function isStatMissing(value: number | null | undefined): boolean {
  return value === null || value === undefined || value === 0
}

function formatScore(score: number | null | undefined): string {
  if (isStatMissing(score)) return COURSE_STAT_PLACEHOLDER
  return String(score)
}

function formatEmploymentRate(rate: number | null | undefined): string {
  if (isStatMissing(rate)) return COURSE_STAT_PLACEHOLDER
  return `${rate}%`
}

function formatRating(rating: number | null | undefined): string {
  if (isStatMissing(rating)) return COURSE_STAT_PLACEHOLDER
  return String(rating)
}

function formatSessionEmploymentRate(
  employmentRate: number | null | undefined,
  eiEmplRate6: string | null | undefined,
): string {
  if (!isStatMissing(employmentRate)) {
    return `${employmentRate}%`
  }
  const fallback = eiEmplRate6?.trim()
  if (fallback) {
    const parsed = parseFloat(fallback.replace(/[^\d.]/g, ''))
    if (!Number.isNaN(parsed) && parsed !== 0) {
      return fallback.endsWith('%') ? fallback : `${fallback}%`
    }
  }
  return '-'
}

export function toCourseCardVM(item: CourseListItem): Course {
  return {
    id: String(item.courseId ?? item.id),
    courseSessionId: item.courseSessionId ?? (item.courseId != null ? item.id : undefined),
    title: item.title,
    company: item.institutionName,
    location: formatAreaCode(item.trngAreaCd),
    price: formatCoursePrice(item.selfPaymentAmount),
    dateRange: formatDateRange(item.traStartDate, item.traEndDate),
    satisfaction: formatScore(item.stdgScor),
    employmentRate: formatEmploymentRate(item.employmentRate),
    rating: formatRating(item.reviewRating),
    logoUrl: item.profileImageUrl ?? undefined,
  }
}

/** 고용24 WKEND_SE: 1=주말, 2=주중·주말 혼합, 3=주중, 9=해당없음 */
function formatWeekendLabel(wkendSe: string | null | undefined): string {
  if (!wkendSe) return '평일 훈련'

  const normalized = wkendSe.trim()
  switch (normalized) {
    case '1':
      return '주말 훈련'
    case '2':
      return '주중·주말 혼합 훈련'
    case '3':
      return '평일 훈련'
    case '9':
      return ''
    case 'Y':
      return '주말 훈련 포함'
    case 'N':
      return '평일 훈련'
    default:
      if (/weekend/i.test(normalized)) return '주말 훈련 포함'
      if (/weekday/i.test(normalized)) return '평일 훈련'
      return normalized
  }
}

export function toCourseDetailVMFromSession(detail: BECourseSessionDetail): CourseDetail {
  const inst = detail.institution
  const dateRange = `${detail.traStartDate} ~ ${detail.traEndDate}`
  const batch = `${detail.trprDegr}기`

  const recruitment: CourseRecruitment = {
    capacity: detail.recruitmentCount ?? 0,
    applicants: detail.selectedTraineeCount ?? 0,
    confirmed: detail.confirmedTraineeCount ?? 0,
  }

  const employmentRate = formatSessionEmploymentRate(detail.employmentRate, detail.eiEmplRate6)

  const otherInfo =
    [
      detail.totalTrainingDays ? `총 훈련 일수: ${detail.totalTrainingDays}일` : '',
      detail.totalTrainingHours ? `총 훈련 시간: ${detail.totalTrainingHours}시간` : '',
      formatWeekendLabel(detail.wkendSe),
    ]
      .filter(Boolean)
      .join('\n') || '-'

  return {
    id: String(detail.courseId),
    courseSessionId: detail.id,
    title: detail.title,
    company: inst?.institutionName ?? '-',
    location: formatAreaCode(detail.trngAreaCd),
    price: formatCoursePrice(detail.selfPaymentAmount),
    dateRange,
    satisfaction: formatScore(detail.stdgScor),
    satisfactionOutOf5: stdgScorToFivePoint(detail.stdgScor),
    employmentRate,
    rating: '-',
    logoUrl: inst?.profileImageUrl ?? undefined,
    batch,
    recruitment,
    eligibility: detail.trainingTargetRequirements?.trim() || '-',
    goals: detail.trainingGoal?.trim() || '-',
    otherInfo,
    institutionInfo: inst?.introduction?.trim() || '-',
    contact: {
      phone: inst?.managerTel ?? '-',
      email: inst?.managerEmail ?? '-',
    },
    titleLink: detail.titleLink ? toAbsoluteUrl(detail.titleLink) : null,
    homepageUrl: inst?.homepageUrl ? toAbsoluteUrl(inst.homepageUrl) : null,
  }
}

// ──────────────────────────────────────────────
// API 함수
// ──────────────────────────────────────────────

/** 과정 목록 (뷰모델로 변환해 반환) */
export async function getCourses(params: CourseListParams): Promise<PageResponse<Course>> {
  const page = await http.get<PageResponse<CourseListItem>>('/api/courses', {
    query: params as Record<string, unknown>,
    auth: false,
  })
  return { ...page, content: page.content.map(toCourseCardVM) }
}

/** 과정 회차 상세 (회차 + 과정 + 기관 통합 조회) */
export async function getCourseSessionDetail(courseSessionId: number): Promise<CourseDetail> {
  const detail = await http.get<BECourseSessionDetail>(`/api/course-sessions/${courseSessionId}`, {
    auth: false,
  })
  return toCourseDetailVMFromSession(detail)
}

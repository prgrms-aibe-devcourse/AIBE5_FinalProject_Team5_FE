import { http } from './http'
import type { PageResponse } from './apiTypes'

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
  expandList?: boolean
}

/** 정렬 키 (FE 전용 — BE 파라미터 없음) */
export type CourseSortKey = 'latest' | 'mostReviews' | 'rating' | 'satisfaction'

/** 과정 카드 뷰모델 */
export interface Course {
  id: string
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
  homepage: string
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
  websiteUrl: string
}

// ──────────────────────────────────────────────
// BE DTO — 실제 API 응답 형태
// ──────────────────────────────────────────────

export interface CourseListItem {
  id: number
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

// ──────────────────────────────────────────────
// API 파라미터
// ──────────────────────────────────────────────

export interface CourseListParams {
  keyword?: string
  trngAreaCd?: string
  ncsCd?: string
  page?: number  // 0-based (BE 규격)
  size?: number
}

// ──────────────────────────────────────────────
// 매퍼 (BE DTO → FE 뷰모델)
// ──────────────────────────────────────────────

const AREA_CODE_MAP: Record<string, string> = {
  '11': '서울', '26': '부산', '27': '대구', '28': '인천',
  '29': '광주', '30': '대전', '31': '울산', '36': '세종',
  '41': '경기', '42': '강원', '43': '충북', '44': '충남',
  '45': '전북', '46': '전남', '47': '경북', '48': '경남', '50': '제주',
}

function formatAreaCode(code: string | null | undefined): string {
  if (!code) return '-'
  return AREA_CODE_MAP[code] ?? code
}

function formatPrice(courseMan: number | null): string {
  if (courseMan === null) return '-'
  if (courseMan === 0) return '무료'
  return courseMan.toLocaleString('ko-KR') + '원'
}

function formatScore(score: number | null | undefined): string {
  if (score === null || score === undefined) return '-'
  return `${score}/5`
}

export function toCourseCardVM(item: CourseListItem): Course {
  return {
    id: String(item.id),
    title: item.title,
    company: item.institutionName,
    location: formatAreaCode(item.trngAreaCd),
    price: formatPrice(item.courseMan),
    dateRange: '-',
    satisfaction: formatScore(item.stdgScor),
    employmentRate: '-',
    rating: '-',
    logoUrl: item.profileImageUrl ?? undefined,
  }
}

export function toCourseDetailVM(detail: BECourseDetail, sessions: CourseSession[]): CourseDetail {
  // 세션은 traStartDate 기준 오름차순 — 가장 최근(마지막) 회차 사용
  const latestSession = sessions.length > 0 ? sessions[sessions.length - 1] : null

  const dateRange = latestSession
    ? `${latestSession.traStartDate} ~ ${latestSession.traEndDate}`
    : '-'

  const batch = latestSession ? `${latestSession.trprDegr}기` : '-'

  const recruitment: CourseRecruitment = {
    capacity: latestSession?.recruitmentCount ?? 0,
    applicants: latestSession?.selectedTraineeCount ?? 0,
    confirmed: latestSession?.confirmedTraineeCount ?? 0,
  }

  const employmentRate =
    latestSession?.eiEmplRate6
      ? `${latestSession.eiEmplRate6}%`
      : latestSession?.employmentRate !== null && latestSession?.employmentRate !== undefined
        ? `${latestSession.employmentRate}%`
        : '-'

  const inst = detail.institution

  const otherInfo = latestSession
    ? [
        detail.totalTrainingDays ? `총 훈련 일수: ${detail.totalTrainingDays}일` : '',
        detail.totalTrainingHours ? `총 훈련 시간: ${detail.totalTrainingHours}시간` : '',
        latestSession.wkendSe === 'Y' ? '주말 훈련 포함' : '평일 훈련',
      ]
        .filter(Boolean)
        .join('\n') || '정보 없음'
    : '정보 없음'

  return {
    id: String(detail.id),
    title: detail.title,
    company: inst?.institutionName ?? '-',
    location: formatAreaCode(detail.trngAreaCd),
    price: formatPrice(detail.selfPaymentAmount),
    dateRange,
    satisfaction: formatScore(detail.stdgScor),
    employmentRate,
    rating: '-',
    logoUrl: inst?.profileImageUrl ?? undefined,
    batch,
    recruitment,
    eligibility: detail.trainingTargetRequirements ?? '정보 없음',
    goals: detail.trainingGoal ?? '정보 없음',
    otherInfo,
    institutionInfo: inst?.introduction ?? '정보 없음',
    contact: {
      phone: inst?.managerTel ?? '-',
      email: inst?.managerEmail ?? '-',
      homepage: inst?.homepageUrl ?? '-',
    },
    websiteUrl: detail.titleLink ?? inst?.homepageUrl ?? '#',
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

/** 과정 상세 + 세션을 병렬 조회해 뷰모델로 반환 */
export async function getCourseDetail(id: number): Promise<CourseDetail> {
  const [detail, sessions] = await Promise.all([
    http.get<BECourseDetail>(`/api/courses/${id}`, { auth: false }),
    http.get<CourseSession[]>(`/api/courses/${id}/sessions`, { auth: false }),
  ])
  return toCourseDetailVM(detail, sessions)
}

/** 과정 회차 목록 (raw BE DTO) */
export async function getCourseSessions(id: number): Promise<CourseSession[]> {
  return http.get<CourseSession[]>(`/api/courses/${id}/sessions`, { auth: false })
}

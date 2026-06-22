import { http } from './http'
import { formatCoursePrice } from './course'

export type BookmarkSort = 'latest' | 'rating'

export interface BookmarkCreateResult {
  bookmarkId: number
  courseSessionId: number
  createdAt: string
}

export interface BookmarkRemoveResult {
  courseSessionId: number
}

export interface BookmarkCourseSession {
  trprDegr: number
  recruitmentCount: number
  selectedTraineeCount: number
  confirmedTraineeCount: number
  selfPaymentAmount: number
}

export interface BookmarkCourseInfo {
  id: number
  title: string
  stdgScor: number | null
}

export interface BookmarkInstitution {
  id: number
  institutionName: string
  profileImageUrl: string | null
  address: string | null
}

export interface BookmarkListItem {
  bookmarkId: number
  courseSessionId: number
  createdAt: string
  startDate: string
  endDate: string
  courseSession: BookmarkCourseSession
  course: BookmarkCourseInfo
  institution: BookmarkInstitution
}

export interface BookmarkPageResponse {
  content: BookmarkListItem[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

/** 북마크 목록 페이지 카드 뷰모델 */
export interface BookmarkCourseVM {
  id: number
  bookmarkId: number
  courseSessionId: number
  title: string
  academy: string
  region: string
  subsidy: string
  period: string
  rating: string
  enrollment: string
  logoUrl?: string
}

export interface GetBookmarksParams {
  page?: number
  size?: number
  sort?: BookmarkSort
}

function formatEnrollment(session: BookmarkCourseSession): string {
  const selected = session.selectedTraineeCount ?? 0
  const capacity = session.recruitmentCount ?? 0
  return `${selected}/${capacity}`
}

function formatRegion(address: string | null): string {
  if (!address) return '-'
  const match = address.match(/^([가-힣]+(?:특별시|광역시|특별자치시|특별자치도|도|시))/)
  if (!match) return address
  return match[1].replace(/(특별시|광역시|특별자치시|특별자치도)$/, '')
}

function formatSatisfactionScore(score: number | null | undefined): string {
  if (score === null || score === undefined || score === 0) return '-'
  return `${score}%`
}

export function toBookmarkCourseVM(item: BookmarkListItem): BookmarkCourseVM {
  return {
    id: item.course.id,
    bookmarkId: item.bookmarkId,
    courseSessionId: item.courseSessionId,
    title: item.course.title,
    academy: item.institution.institutionName,
    region: formatRegion(item.institution.address),
    subsidy: formatCoursePrice(item.courseSession.selfPaymentAmount),
    period: `${item.startDate} ~ ${item.endDate}`,
    rating: formatSatisfactionScore(item.course.stdgScor),
    enrollment: formatEnrollment(item.courseSession),
    logoUrl: item.institution.profileImageUrl ?? undefined,
  }
}

/** 과정 회차 스크랩 — 과정 조회·상세 등에서 사용 */
export async function createBookmark(courseSessionId: number): Promise<BookmarkCreateResult> {
  return http.post<BookmarkCreateResult>(`/api/bookmarks/courses/${courseSessionId}`, {}, { auth: true })
}

/** 과정 회차 스크랩 해제 */
export async function removeBookmark(courseSessionId: number): Promise<BookmarkRemoveResult> {
  return http.delete<BookmarkRemoveResult>(`/api/bookmarks/courses/${courseSessionId}`, { auth: true })
}

/** 내 북마크(스크랩) 목록 조회 */
export async function getBookmarks(params: GetBookmarksParams = {}): Promise<BookmarkPageResponse> {
  return http.get<BookmarkPageResponse>('/api/bookmarks', {
    auth: true,
    query: params as Record<string, unknown>,
  })
}

function parseBookmarkStartDate(startDate: string): number {
  const parsed = new Date(startDate).getTime()
  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed
}

/** 시작일 기준 임박순 정렬 (가까운 개강일 우선) */
export function sortBookmarksByImminent(items: BookmarkListItem[]): BookmarkListItem[] {
  return [...items].sort(
    (left, right) => parseBookmarkStartDate(left.startDate) - parseBookmarkStartDate(right.startDate),
  )
}

/** 대시보드 미리보기용 — 임박순 상위 N건 */
export async function getBookmarkPreview(limit = 5): Promise<BookmarkCourseVM[]> {
  const data = await getBookmarks({ page: 0, size: 100, sort: 'latest' })
  return sortBookmarksByImminent(data.content)
    .slice(0, limit)
    .map(toBookmarkCourseVM)
}

/** 로그인 사용자의 스크랩된 회차 ID 전체 조회 */
export async function fetchBookmarkedSessionIds(): Promise<Set<number>> {
  const ids = new Set<number>()
  let page = 0
  let last = false

  while (!last) {
    const data = await getBookmarks({ page, size: 100, sort: 'latest' })
    data.content.forEach((item) => ids.add(item.courseSessionId))
    last = data.last
    page += 1
  }

  return ids
}

/**
 * services/courseCompare.ts
 * 선택 과정 비교 — localStorage (courseSessionId·과정명·기관명 저장)
 */

import { getCourseSessionDetail, type Course, type CourseDetail } from './course.ts'
import {
  createEmptyVerifiedReviewStatistics,
  getVerifiedReviewStatistics,
  type VerifiedReviewStatistics,
} from './review.ts'
const COMPARE_STORAGE_KEY = 'bootsignal:course-compare'

export const COMPARE_STORAGE_KEY_EXPORT = COMPARE_STORAGE_KEY

const MAX_ITEMS = 3

export const MAX_COMPARE_COURSES = MAX_ITEMS

/** localStorage·사이드바·비교 페이지에 쓰는 최소 필드 */
export interface CompareCourseItem {
  id: string
  courseSessionId: number
  title: string
  company: string
  logoUrl?: string
}

function isCompareCourseItem(value: unknown): value is CompareCourseItem {
  if (!value || typeof value !== 'object') return false
  const item = value as CompareCourseItem
  return (
    typeof item.id === 'string' &&
    typeof item.courseSessionId === 'number' &&
    !Number.isNaN(item.courseSessionId) &&
    typeof item.title === 'string' &&
    typeof item.company === 'string'
  )
}

export function toCompareCourseItem(course: Course): CompareCourseItem | null {
  if (course.courseSessionId == null) return null
  return {
    id: course.id,
    courseSessionId: course.courseSessionId,
    title: course.title,
    company: course.company,
    logoUrl: course.logoUrl,
  }
}

export function toCompareCourseItemFromBookmark(course: {
  id: number
  courseSessionId: number
  title: string
  academy: string
  logoUrl?: string
}): CompareCourseItem {
  return {
    id: String(course.id),
    courseSessionId: course.courseSessionId,
    title: course.title,
    company: course.academy,
    logoUrl: course.logoUrl,
  }
}

/** 조회 페이지 — 저장된 비교 목록 복원 */
export function loadCompareCourses(): CompareCourseItem[] {
  try {
    const raw = localStorage.getItem(COMPARE_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isCompareCourseItem).slice(0, MAX_ITEMS)
  } catch {
    return []
  }
}

/** 조회 페이지 — 비교 목록 저장 */
export function saveCompareCourses(items: CompareCourseItem[]): void {
  try {
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)))
  } catch {
    // storage quota / private mode
  }
}

/** 비교 목록 비우기 (사용자가 명시적으로 초기화할 때) */
export function clearCompareCourses(): void {
  localStorage.removeItem(COMPARE_STORAGE_KEY)
}

/** 비교 페이지 — 선택 회차별 상세 API 병렬 조회 */
export async function fetchCompareCourseDetails(
  items: CompareCourseItem[],
): Promise<CourseDetail[]> {
  return Promise.all(items.map((item) => getCourseSessionDetail(item.courseSessionId)))
}

/** 비교 페이지 — 과정별 인증 리뷰 통계 병렬 조회 */
export async function fetchCompareReviewStatistics(
  courses: CourseDetail[],
): Promise<VerifiedReviewStatistics[]> {
  return Promise.all(
    courses.map((course) =>
      getVerifiedReviewStatistics(course.courseId).catch(() => createEmptyVerifiedReviewStatistics()),
    ),
  )
}

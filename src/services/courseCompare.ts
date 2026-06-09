/**
 * services/courseCompare.ts
 * 선택 과정 비교 — localStorage (id·과정명·기관명만 저장)
 */

import type { Course } from './course.ts'

const COMPARE_STORAGE_KEY = 'bootsignal:course-compare'

const MAX_ITEMS = 3

export const MAX_COMPARE_COURSES = MAX_ITEMS

/** localStorage·사이드바·비교 페이지에 쓰는 최소 필드 */
export interface CompareCourseItem {
  id: string
  title: string
  company: string
}

function isCompareCourseItem(value: unknown): value is CompareCourseItem {
  if (!value || typeof value !== 'object') return false
  const item = value as CompareCourseItem
  return (
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.company === 'string'
  )
}

export function toCompareCourseItem(course: Course): CompareCourseItem {
  return {
    id: course.id,
    title: course.title,
    company: course.company,
  }
}

export function toCompareCourseItemFromFavorite(course: {
  id: number
  title: string
  academy: string
}): CompareCourseItem {
  return {
    id: String(course.id),
    title: course.title,
    company: course.academy,
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

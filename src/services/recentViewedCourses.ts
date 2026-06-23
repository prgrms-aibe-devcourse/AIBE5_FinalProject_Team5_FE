import type { Course, CourseDetail } from './course'
import { isCourseStatPlaceholder } from './course'

export const RECENT_VIEWED_COURSES_STORAGE_KEY = 'bootsignal:recent-viewed-courses'
export const MAX_RECENT_VIEWED_COURSES = 5

function formatSatisfactionForStorage(value: string): string {
  if (isCourseStatPlaceholder(value) || value.trim() === '-') return value
  if (value.endsWith('%')) return value
  return `${value}%`
}

export interface RecentViewedCourse {
  courseSessionId: number
  courseId: string
  title: string
  company: string
  location: string
  price: string
  dateRange: string
  satisfaction: string
  employmentRate: string
  rating: string
  logoUrl?: string
  viewedAt: string
}

function isRecentViewedCourse(value: unknown): value is RecentViewedCourse {
  if (!value || typeof value !== 'object') return false

  const item = value as RecentViewedCourse
  return (
    typeof item.courseSessionId === 'number' &&
    !Number.isNaN(item.courseSessionId) &&
    typeof item.courseId === 'string' &&
    typeof item.title === 'string' &&
    typeof item.company === 'string' &&
    typeof item.location === 'string' &&
    typeof item.price === 'string' &&
    typeof item.dateRange === 'string' &&
    typeof item.satisfaction === 'string' &&
    typeof item.employmentRate === 'string' &&
    typeof item.rating === 'string' &&
    typeof item.viewedAt === 'string'
  )
}

export function toRecentViewedCourse(course: Course | CourseDetail): RecentViewedCourse | null {
  if (course.courseSessionId == null) return null

  return {
    courseSessionId: course.courseSessionId,
    courseId: course.id,
    title: course.title,
    company: course.company,
    location: course.location,
    price: course.price,
    dateRange: course.dateRange,
    satisfaction: formatSatisfactionForStorage(course.satisfaction),
    employmentRate: course.employmentRate,
    rating: course.rating,
    logoUrl: course.logoUrl,
    viewedAt: new Date().toISOString(),
  }
}

export function loadRecentViewedCourses(): RecentViewedCourse[] {
  try {
    const raw = localStorage.getItem(RECENT_VIEWED_COURSES_STORAGE_KEY)
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.filter(isRecentViewedCourse).slice(0, MAX_RECENT_VIEWED_COURSES)
  } catch {
    return []
  }
}

export function saveRecentViewedCourses(items: RecentViewedCourse[]): void {
  try {
    localStorage.setItem(
      RECENT_VIEWED_COURSES_STORAGE_KEY,
      JSON.stringify(items.slice(0, MAX_RECENT_VIEWED_COURSES)),
    )
  } catch {
    // storage quota / private mode
  }
}

export function clearRecentViewedCourses(): void {
  localStorage.removeItem(RECENT_VIEWED_COURSES_STORAGE_KEY)
}

export function addRecentViewedCourse(course: Course | CourseDetail): void {
  const item = toRecentViewedCourse(course)
  if (!item) return

  const next = [
    item,
    ...loadRecentViewedCourses().filter((existing) => existing.courseSessionId !== item.courseSessionId),
  ].slice(0, MAX_RECENT_VIEWED_COURSES)

  saveRecentViewedCourses(next)
}

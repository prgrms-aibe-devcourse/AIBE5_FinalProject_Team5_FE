/**
 * 과정 조회 페이지 필터 UI 설정 (BE enum·목록 기준)
 * 사용처: CourseSearchPage, CourseSearchHero
 */

import { buildCourseFilters, type CourseFilterConfig } from '../../../services/course.ts'

/** CourseSearchHero 필터 4종 — option.value는 BE 쿼리 파라미터와 동일 */
export const COURSE_FILTERS: CourseFilterConfig[] = buildCourseFilters()

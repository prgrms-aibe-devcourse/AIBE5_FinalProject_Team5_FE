import type { CourseSortKey, FieldCategory } from '../../services/course.ts'
import { COURSE_FILTERS } from './data/courseFilters.ts'

const FILTER_ALL = 'all'
const DEFAULT_SORT: CourseSortKey = 'latest'

const SORT_KEYS = new Set<CourseSortKey>(['latest', 'satisfaction', 'employmentRate', 'deadline'])

const CATEGORY_ALIASES: Record<string, FieldCategory> = {
  ai: 'AI',
  security: 'SECURITY',
  data: 'BIG_DATA',
  cloud: 'CLOUD',
  uiux: 'UI_UX',
  vr: 'VR',
  sw: 'APP_SW',
}

const VALID_CATEGORIES = new Set<FieldCategory>([
  'AI',
  'SECURITY',
  'BIG_DATA',
  'CLOUD',
  'UI_UX',
  'VR',
  'APP_SW',
  'OTHERS',
])

export type CourseSearchListState = {
  q: string
  filterValues: Record<string, string>
  sortKey: CourseSortKey
  page: number
}

function buildDefaultFilterValues(): Record<string, string> {
  return COURSE_FILTERS.reduce<Record<string, string>>((acc, filter) => {
    acc[filter.id] = filter.options[0]?.value ?? FILTER_ALL
    return acc
  }, {})
}

function getAllowedFilterValues(filterId: string): Set<string> {
  const filter = COURSE_FILTERS.find((item) => item.id === filterId)
  return new Set(filter?.options.map((option) => option.value) ?? [FILTER_ALL])
}

function parseCategoryParam(value: string | null): string {
  if (!value || value === FILTER_ALL) return FILTER_ALL

  const alias = CATEGORY_ALIASES[value.toLowerCase()]
  if (alias) return alias

  const upper = value.toUpperCase()
  if (VALID_CATEGORIES.has(upper as FieldCategory)) return upper

  return FILTER_ALL
}

function parseFilterValue(filterId: string, value: string | null): string {
  if (!value || value === FILTER_ALL) return FILTER_ALL
  const allowed = getAllowedFilterValues(filterId)
  return allowed.has(value) ? value : FILTER_ALL
}

function parsePage(value: string | null): number {
  if (!value) return 1
  const page = Number.parseInt(value, 10)
  return Number.isFinite(page) && page >= 1 ? page : 1
}

function parseSortKey(value: string | null): CourseSortKey {
  if (value && SORT_KEYS.has(value as CourseSortKey)) {
    return value as CourseSortKey
  }
  return DEFAULT_SORT
}

/** URLSearchParams → 목록 조회 상태 */
export function parseCourseSearchParams(searchParams: URLSearchParams): CourseSearchListState {
  const defaults = buildDefaultFilterValues()

  return {
    q: (searchParams.get('q') ?? searchParams.get('keyword') ?? '').trim(),
    filterValues: {
      ...defaults,
      category: parseCategoryParam(searchParams.get('category')),
      price: parseFilterValue('price', searchParams.get('price')),
      region: parseFilterValue('region', searchParams.get('region')),
      duration: parseFilterValue('duration', searchParams.get('duration')),
    },
    sortKey: parseSortKey(searchParams.get('sort')),
    page: parsePage(searchParams.get('page')),
  }
}

/** 목록 조회 상태 → URLSearchParams (기본값은 생략) */
export function buildCourseSearchParams(state: CourseSearchListState): URLSearchParams {
  const params = new URLSearchParams()

  if (state.q) params.set('q', state.q)

  if (state.filterValues.category !== FILTER_ALL) {
    params.set('category', state.filterValues.category)
  }
  if (state.filterValues.price !== FILTER_ALL) {
    params.set('price', state.filterValues.price)
  }
  if (state.filterValues.region !== FILTER_ALL) {
    params.set('region', state.filterValues.region)
  }
  if (state.filterValues.duration !== FILTER_ALL) {
    params.set('duration', state.filterValues.duration)
  }

  if (state.sortKey !== DEFAULT_SORT) {
    params.set('sort', state.sortKey)
  }

  if (state.page > 1) {
    params.set('page', String(state.page))
  }

  return params
}

/** 현재 URL 쿼리에 변경분을 반영한 새 쿼리 생성 */
export function mergeCourseSearchParams(
  searchParams: URLSearchParams,
  patch: {
    q?: string
    page?: number
    sortKey?: CourseSortKey
    filterValues?: Partial<Record<string, string>>
  },
): URLSearchParams {
  const current = parseCourseSearchParams(searchParams)

  return buildCourseSearchParams({
    q: patch.q ?? current.q,
    page: patch.page ?? current.page,
    sortKey: patch.sortKey ?? current.sortKey,
    filterValues: {
      ...current.filterValues,
      ...patch.filterValues,
    },
  })
}

export type Course = {
  id: number
  title: string
  academy: string
  region: string
  subsidy: string
  period: string
  rating: string
  enrollment?: string
  logoUrl?: string
}

export const COURSE_SORT_MODES = ['만족도순', '임박순'] as const
export type CourseSortMode = (typeof COURSE_SORT_MODES)[number]

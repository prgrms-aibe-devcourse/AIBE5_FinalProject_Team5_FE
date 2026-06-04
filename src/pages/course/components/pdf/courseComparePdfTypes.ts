export interface CourseComparePdfCourse {
  index: number
  title: string
  company: string
  dateRange: string
}

export interface CourseComparePdfRow {
  label: string
  values: string[]
}

export interface CourseComparePdfStatsCell {
  reviewCount: number
  averageRating: number
  metrics: { label: string; value: number }[]
}

export interface CourseComparePdfSection {
  label: string
  rows: CourseComparePdfRow[]
  stats?: CourseComparePdfStatsCell[]
}

export interface CourseComparePdfPayload {
  generatedAt: string
  courses: CourseComparePdfCourse[]
  sections: CourseComparePdfSection[]
}

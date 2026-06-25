import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Course } from '../services/course'
import {
  COMPARE_STORAGE_KEY_EXPORT,
  loadCompareCourses,
  MAX_COMPARE_COURSES,
  saveCompareCourses,
  toCompareCourseItem,
  toCompareCourseItemFromBookmark,
  type CompareCourseItem,
} from '../services/courseCompare'

type CompareCoursesContextValue = {
  selectedCourses: CompareCourseItem[]
  selectedSessionIds: Set<number>
  canAddMore: boolean
  toggleCompareCourse: (course: Course) => void
  toggleCompareBookmark: (course: {
    id: number
    courseSessionId: number
    title: string
    academy: string
    logoUrl?: string
  }) => void
  removeFromCompare: (courseSessionId: number) => void
}

const CompareCoursesContext = createContext<CompareCoursesContextValue | null>(null)

export function CompareCoursesProvider({ children }: { children: ReactNode }) {
  const [selectedCourses, setSelectedCourses] = useState<CompareCourseItem[]>(() => loadCompareCourses())

  useEffect(() => {
    saveCompareCourses(selectedCourses)
  }, [selectedCourses])

  useEffect(() => {
    const syncFromStorage = () => {
      setSelectedCourses(loadCompareCourses())
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key === COMPARE_STORAGE_KEY_EXPORT) syncFromStorage()
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const selectedSessionIds = useMemo(
    () => new Set(selectedCourses.map((course) => course.courseSessionId)),
    [selectedCourses],
  )

  const toggleItem = useCallback((item: CompareCourseItem) => {
    setSelectedCourses((prev) => {
      const exists = prev.some((entry) => entry.courseSessionId === item.courseSessionId)
      if (exists) return prev.filter((entry) => entry.courseSessionId !== item.courseSessionId)
      if (prev.length >= MAX_COMPARE_COURSES) return prev
      return [...prev, item]
    })
  }, [])

  const toggleCompareCourse = useCallback(
    (course: Course) => {
      const item = toCompareCourseItem(course)
      if (!item) return
      toggleItem(item)
    },
    [toggleItem],
  )

  const toggleCompareBookmark = useCallback(
    (course: {
      id: number
      courseSessionId: number
      title: string
      academy: string
      logoUrl?: string
    }) => {
      toggleItem(toCompareCourseItemFromBookmark(course))
    },
    [toggleItem],
  )

  const removeFromCompare = useCallback((courseSessionId: number) => {
    setSelectedCourses((prev) => prev.filter((entry) => entry.courseSessionId !== courseSessionId))
  }, [])

  const value = useMemo(
    () => ({
      selectedCourses,
      selectedSessionIds,
      canAddMore: selectedCourses.length < MAX_COMPARE_COURSES,
      toggleCompareCourse,
      toggleCompareBookmark,
      removeFromCompare,
    }),
    [selectedCourses, selectedSessionIds, toggleCompareCourse, toggleCompareBookmark, removeFromCompare],
  )

  return <CompareCoursesContext.Provider value={value}>{children}</CompareCoursesContext.Provider>
}

export function useCompareCourses(): CompareCoursesContextValue {
  const context = useContext(CompareCoursesContext)
  if (!context) {
    throw new Error('useCompareCourses must be used within CompareCoursesProvider')
  }
  return context
}

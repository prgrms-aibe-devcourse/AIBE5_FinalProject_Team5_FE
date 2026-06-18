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
  selectedIds: Set<string>
  canAddMore: boolean
  toggleCompareCourse: (course: Course) => void
  toggleCompareBookmark: (course: {
    id: number
    title: string
    academy: string
    logoUrl?: string
  }) => void
  removeFromCompare: (courseId: string) => void
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

  const selectedIds = useMemo(
    () => new Set(selectedCourses.map((course) => course.id)),
    [selectedCourses],
  )

  const toggleItem = useCallback((item: CompareCourseItem) => {
    setSelectedCourses((prev) => {
      const exists = prev.some((entry) => entry.id === item.id)
      if (exists) return prev.filter((entry) => entry.id !== item.id)
      if (prev.length >= MAX_COMPARE_COURSES) return prev
      return [...prev, item]
    })
  }, [])

  const toggleCompareCourse = useCallback(
    (course: Course) => {
      toggleItem(toCompareCourseItem(course))
    },
    [toggleItem],
  )

  const toggleCompareBookmark = useCallback(
    (course: { id: number; title: string; academy: string; logoUrl?: string }) => {
      toggleItem(toCompareCourseItemFromBookmark(course))
    },
    [toggleItem],
  )

  const removeFromCompare = useCallback((courseId: string) => {
    setSelectedCourses((prev) => prev.filter((entry) => entry.id !== courseId))
  }, [])

  const value = useMemo(
    () => ({
      selectedCourses,
      selectedIds,
      canAddMore: selectedCourses.length < MAX_COMPARE_COURSES,
      toggleCompareCourse,
      toggleCompareBookmark,
      removeFromCompare,
    }),
    [selectedCourses, selectedIds, toggleCompareCourse, toggleCompareBookmark, removeFromCompare],
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

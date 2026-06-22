import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '../services/ApiError'
import { createBookmark, fetchBookmarkedSessionIds, removeBookmark } from '../services/bookmark'
import { isAuthenticated } from '../services/auth'

type BookmarkContextValue = {
  isLoaded: boolean
  bookmarkError: string | null
  clearBookmarkError: () => void
  refreshBookmarks: () => Promise<void>
  toggleBookmark: (courseSessionId: number | undefined) => Promise<boolean>
  isBookmarked: (courseSessionId: number | undefined) => boolean
  isPending: (courseSessionId: number | undefined) => boolean
}

const BookmarkContext = createContext<BookmarkContextValue | null>(null)

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()

  const [bookmarkedSessionIds, setBookmarkedSessionIds] = useState<Set<number>>(new Set())
  const [pendingSessionIds, setPendingSessionIds] = useState<Set<number>>(new Set())
  const [bookmarkError, setBookmarkError] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const refreshBookmarks = useCallback(async () => {
    if (!isAuthenticated()) {
      setBookmarkedSessionIds(new Set())
      setIsLoaded(true)
      return
    }

    const ids = await fetchBookmarkedSessionIds()
    setBookmarkedSessionIds(ids)
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    setIsLoaded(false)
    refreshBookmarks().catch(() => {
      setBookmarkedSessionIds(new Set())
      setIsLoaded(true)
    })
  }, [refreshBookmarks])

  const redirectToLogin = useCallback(() => {
    const redirect = `${location.pathname}${location.search}`
    navigate(`/login?redirect=${encodeURIComponent(redirect)}`)
  }, [location.pathname, location.search, navigate])

  const isBookmarked = useCallback(
    (courseSessionId: number | undefined) =>
      courseSessionId != null && bookmarkedSessionIds.has(courseSessionId),
    [bookmarkedSessionIds],
  )

  const isPending = useCallback(
    (courseSessionId: number | undefined) =>
      courseSessionId != null && pendingSessionIds.has(courseSessionId),
    [pendingSessionIds],
  )

  const toggleBookmark = useCallback(
    async (courseSessionId: number | undefined): Promise<boolean> => {
      if (!courseSessionId) {
        setBookmarkError('스크랩할 회차 정보를 찾을 수 없습니다.')
        return false
      }

      if (!isAuthenticated()) {
        redirectToLogin()
        return false
      }

      if (pendingSessionIds.has(courseSessionId)) return false

      const wasBookmarked = bookmarkedSessionIds.has(courseSessionId)

      setPendingSessionIds((prev) => new Set(prev).add(courseSessionId))
      setBookmarkError(null)

      try {
        if (wasBookmarked) {
          await removeBookmark(courseSessionId)
          setBookmarkedSessionIds((prev) => {
            const next = new Set(prev)
            next.delete(courseSessionId)
            return next
          })
        } else {
          await createBookmark(courseSessionId)
          setBookmarkedSessionIds((prev) => new Set(prev).add(courseSessionId))
        }
        return true
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.code === 'UNAUTHORIZED' || err.status === 401) {
            redirectToLogin()
            return false
          }
          if (err.code === 'BOOKMARK_ALREADY_EXISTS') {
            setBookmarkedSessionIds((prev) => new Set(prev).add(courseSessionId))
            return true
          }
          if (err.code === 'BOOKMARK_NOT_FOUND') {
            setBookmarkedSessionIds((prev) => {
              const next = new Set(prev)
              next.delete(courseSessionId)
              return next
            })
            return true
          }
          setBookmarkError(err.message)
        } else {
          setBookmarkError('스크랩 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.')
        }
        return false
      } finally {
        setPendingSessionIds((prev) => {
          const next = new Set(prev)
          next.delete(courseSessionId)
          return next
        })
      }
    },
    [bookmarkedSessionIds, pendingSessionIds, redirectToLogin],
  )

  const value = useMemo(
    () => ({
      isLoaded,
      bookmarkError,
      clearBookmarkError: () => setBookmarkError(null),
      refreshBookmarks,
      toggleBookmark,
      isBookmarked,
      isPending,
    }),
    [isLoaded, bookmarkError, refreshBookmarks, toggleBookmark, isBookmarked, isPending],
  )

  return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>
}

export function useBookmarkSessions(): BookmarkContextValue {
  const context = useContext(BookmarkContext)
  if (!context) {
    throw new Error('useBookmarkSessions must be used within BookmarkProvider')
  }
  return context
}

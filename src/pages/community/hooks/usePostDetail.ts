import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Post } from '../../../services/post'
import { getPost } from '../../../services/post'
import { ApiError } from '../../../services/ApiError'
import { getErrorPagePath } from '../../../utils/apiErrorNavigation'

/** 게시판 · Q&A · 모집 공통 상세 조회 (postType은 API 응답에서 제공) */
export function usePostDetail(idParam: string | undefined) {
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    if (!idParam) {
      navigate('/404', { replace: true })
      return
    }

    const id = Number(idParam)
    if (Number.isNaN(id)) {
      navigate('/404', { replace: true })
      return
    }

    setIsLoading(true)
    setFetchError(null)

    getPost(id)
      .then((item) => setPost(item))
      .catch((err: unknown) => {
        setPost(null)
        if (err instanceof ApiError && getErrorPagePath(err)) return
        setFetchError(err instanceof Error ? err.message : '게시글을 불러올 수 없습니다.')
      })
      .finally(() => setIsLoading(false))
  }, [idParam, navigate])

  return { post, isLoading, fetchError }
}

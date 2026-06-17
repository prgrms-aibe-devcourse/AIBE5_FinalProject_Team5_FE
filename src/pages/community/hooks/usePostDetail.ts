import { useEffect, useState } from 'react'
import type { Post } from '../../../services/post'
import { getPost } from '../../../services/post'

/** 게시판 · Q&A · 모집 공통 상세 조회 */
export function usePostDetail(idParam: string | undefined) {
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    if (!idParam) {
      setPost(null)
      setFetchError('게시글 ID가 없습니다.')
      setIsLoading(false)
      return
    }

    const id = Number(idParam)
    if (Number.isNaN(id)) {
      setPost(null)
      setFetchError('잘못된 게시글 ID입니다.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setFetchError(null)

    getPost(id)
      .then(setPost)
      .catch((err: unknown) => {
        setPost(null)
        setFetchError(err instanceof Error ? err.message : '게시글을 불러올 수 없습니다.')
      })
      .finally(() => setIsLoading(false))
  }, [idParam])

  return { post, isLoading, fetchError }
}

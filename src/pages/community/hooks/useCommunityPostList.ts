import { useEffect, useState } from 'react'
import { COMMUNITY_LIST_MAX_ITEMS } from '../communitySections'
import type { Post, PostType } from '../../../services/post'
import { getPosts } from '../../../services/post'

/** 게시판 · Q&A · 모집 공통 목록 조회 (서버 페이지네이션) */
export function useCommunityPostList(postType: PostType) {
  const [posts, setPosts] = useState<Post[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setFetchError(null)

    getPosts({
      postType,
      page: currentPage - 1, // FE 1-based → BE 0-based
      size: COMMUNITY_LIST_MAX_ITEMS,
    })
      .then((data) => {
        setPosts(data.content)
        setTotalPages(data.totalPages || 1)
      })
      .catch((err: unknown) => {
        setFetchError(err instanceof Error ? err.message : '게시글 목록을 불러오는 중 오류가 발생했습니다.')
      })
      .finally(() => setIsLoading(false))
  }, [postType, currentPage])

  return {
    posts,
    currentPage,
    setCurrentPage,
    totalPages,
    isLoading,
    fetchError,
  }
}

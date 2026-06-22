import { http } from './http'

export type MyPagePostType = 'BOARD' | 'QNA' | 'PROJECT_RECRUIT'

export type MyPageItemType = MyPagePostType | 'REVIEW' | 'COMMENT'

type MyPageListItemBase = {
  id: number
  titleOrContent: string
  createdAt: string
  updatedAt: string
}

/** GET /api/mypage/comments 응답 항목 */
export type MyPageCommentItem = MyPageListItemBase & {
  type: 'COMMENT'
  postId: number
  courseId: null
  courseSessionId: null
}

/** GET /api/mypage/reviews 응답 항목 */
export type MyPageReviewItem = MyPageListItemBase & {
  type: 'REVIEW'
  postId: null
  courseId: number
  courseSessionId: number
}

/** GET /api/mypage/posts 응답 항목 */
export type MyPagePostItem = MyPageListItemBase & {
  type: MyPagePostType
  postId?: number | null
  courseId?: number | null
  courseSessionId?: number | null
}

export type MyPageItem = MyPagePostItem | MyPageCommentItem | MyPageReviewItem

export type MyPageListResponse = {
  items: MyPageItem[]
  totalElements: number
  totalPages: number
  pageNumber: number
}

export type MyPageCommentListResponse = {
  items: MyPageCommentItem[]
  totalElements: number
  totalPages: number
  pageNumber: number
}

export type MyPageReviewListResponse = {
  items: MyPageReviewItem[]
  totalElements: number
  totalPages: number
  pageNumber: number
}

type ListQuery = {
  page?: number
  size?: number
  sort?: string
}

export async function getMyPagePosts(
  query: ListQuery & { type?: MyPagePostType } = {},
): Promise<MyPageListResponse> {
  return http.get<MyPageListResponse>('/api/mypage/posts', { auth: true, query })
}

export async function getMyPageReviews(query: ListQuery = {}): Promise<MyPageReviewListResponse> {
  return http.get<MyPageReviewListResponse>('/api/mypage/reviews', { auth: true, query })
}

/** 로그인 사용자가 해당 과정·회차에 이미 작성한 리뷰가 있는지 확인 */
export async function hasMyReviewForCourseSession(
  courseId: number,
  courseSessionId: number,
): Promise<boolean> {
  let page = 0
  let totalPages = 1

  while (page < totalPages) {
    const data = await getMyPageReviews({ page, size: 100 })
    totalPages = data.totalPages

    const found = data.items.some(
      (item) => item.courseId === courseId && item.courseSessionId === courseSessionId,
    )
    if (found) return true

    page += 1
  }

  return false
}

export async function getMyPageComments(query: ListQuery = {}): Promise<MyPageCommentListResponse> {
  return http.get<MyPageCommentListResponse>('/api/mypage/comments', { auth: true, query })
}


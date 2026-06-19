import { http } from './http'

export type MyPagePostType = 'BOARD' | 'QNA' | 'PROJECT_RECRUIT'

export type MyPageItemType = MyPagePostType | 'REVIEW' | 'COMMENT'

export type MyPageItem = {
  id: number
  type: MyPageItemType
  titleOrContent: string
  createdAt: string
  updatedAt: string
  postId?: number | null
  courseId?: number
  courseSessionId?: number
}

export type MyPageListResponse = {
  items: MyPageItem[]
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

export async function getMyPageReviews(query: ListQuery = {}): Promise<MyPageListResponse> {
  return http.get<MyPageListResponse>('/api/mypage/reviews', { auth: true, query })
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

export async function getMyPageComments(query: ListQuery = {}): Promise<MyPageListResponse> {
  return http.get<MyPageListResponse>('/api/mypage/comments', { auth: true, query })
}


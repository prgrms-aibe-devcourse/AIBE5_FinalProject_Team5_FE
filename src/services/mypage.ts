import { http } from './http'

export type MyPagePostType = 'BOARD' | 'QNA' | 'PROJECT_RECRUIT'

export type MyPageItemType = MyPagePostType | 'REVIEW' | 'COMMENT'

export type MyPageItem = {
  id: number
  type: MyPageItemType
  titleOrContent: string
  createdAt: string
  updatedAt: string
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

export async function getMyPageComments(query: ListQuery = {}): Promise<MyPageListResponse> {
  return http.get<MyPageListResponse>('/api/mypage/comments', { auth: true, query })
}


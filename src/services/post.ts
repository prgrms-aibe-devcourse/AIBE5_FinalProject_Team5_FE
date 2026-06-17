/**
 * 커뮤니티 게시글 API 연동 (게시판 · Q&A · 모집)
 *
 * GET  /api/posts       — 목록
 * GET  /api/posts/{id}  — 상세
 * POST /api/posts       — 작성 (로그인 필요)
 * 흐름: http.get → PostListItem(BE DTO) → toPostVM → Post(FE 뷰모델) → 커뮤니티 페이지
 */
import { http } from './http'
import type { PageResponse } from './apiTypes'
import { toDateOnly } from '../utils/formatRequestedDate'

// ──────────────────────────────────────────────
// FE 뷰모델 — 컴포넌트가 소비하는 타입
// ──────────────────────────────────────────────

export type PostType = 'BOARD' | 'QNA' | 'PROJECT_RECRUIT'

export interface Post {
  id: number
  title: string
  author: string
  createdAt: string
  updatedAt: string
  postType: PostType
  courseId: number | null
  content: string
}

// ──────────────────────────────────────────────
// BE DTO — 실제 API 응답 형태
// ──────────────────────────────────────────────

export interface PostListItem {
  postId: number
  userId: number
  userNickname: string
  courseId: number | null
  postType: PostType
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface PostListParams {
  postType?: PostType
  courseId?: number
  keyword?: string
  page?: number // 0-based (BE 규격)
  size?: number
  sort?: string
}

export interface CreatePostRequest {
  courseId?: number
  postType: PostType
  title: string
  content: string
}

// ──────────────────────────────────────────────
// 매퍼 (BE DTO → FE 뷰모델)
// ──────────────────────────────────────────────

export function toPostVM(item: PostListItem): Post {
  return {
    id: item.postId,
    title: item.title,
    author: item.userNickname,
    createdAt: toDateOnly(item.createdAt),
    updatedAt: toDateOnly(item.updatedAt),
    postType: item.postType,
    courseId: item.courseId,
    content: item.content,
  }
}

// ──────────────────────────────────────────────
// API 함수
// ──────────────────────────────────────────────

/** 게시글 목록 (뷰모델로 변환해 반환) */
export async function getPosts(params: PostListParams = {}): Promise<PageResponse<Post>> {
  const page = await http.get<PageResponse<PostListItem>>('/api/posts', {
    query: params as Record<string, unknown>,
    auth: false,
  })
  return { ...page, content: page.content.map(toPostVM) }
}

/** 게시글 상세 (뷰모델로 변환해 반환) */
export async function getPost(postId: number): Promise<Post> {
  const item = await http.get<PostListItem>(`/api/posts/${postId}`, { auth: false })
  return toPostVM(item)
}

/** 게시글 작성 (뷰모델로 변환해 반환) */
export async function createPost(body: CreatePostRequest): Promise<Post> {
  const item = await http.post<PostListItem>('/api/posts', body, { auth: true })
  return toPostVM(item)
}

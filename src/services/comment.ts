import { http } from './http'

export interface PostComment {
  id: number
  postId: number
  userId: number
  author: string
  content: string
  createdAt: string
  updatedAt: string
}

interface PostCommentItemDto {
  commentId: number
  postId: number
  userId: number
  userNickname: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface PostCommentListParams {
  page?: number
  size?: number
  sort?: string
}

export interface PostCommentPage {
  content: PostComment[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
}

interface PostCommentPageDto {
  content: PostCommentItemDto[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
}

function toCommentVM(item: PostCommentItemDto): PostComment {
  return {
    id: item.commentId,
    postId: item.postId,
    userId: item.userId,
    author: item.userNickname,
    content: item.content,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}

export async function getPostComments(
  postId: number,
  params: PostCommentListParams = {},
): Promise<PostCommentPage> {
  const page = await http.get<PostCommentPageDto>(`/api/posts/${postId}/comments`, {
    query: params as Record<string, unknown>,
    auth: false,
  })

  return {
    ...page,
    content: page.content.map(toCommentVM),
  }
}

export interface CreatePostCommentRequest {
  content: string
}

interface CreatePostCommentResponseDto {
  commentId: number
  postId: number
  userId: number
  userNickname: string
  content: string
  createdAt: string
  updatedAt: string
}

export async function createPostComment(
  postId: number,
  body: CreatePostCommentRequest,
): Promise<PostComment> {
  const item = await http.post<CreatePostCommentResponseDto>(`/api/posts/${postId}/comments`, body, {
    auth: true,
  })
  return toCommentVM(item)
}

export interface UpdatePostCommentRequest {
  content: string
}

export async function updatePostComment(
  commentId: number,
  body: UpdatePostCommentRequest,
): Promise<PostComment> {
  const item = await http.patch<CreatePostCommentResponseDto>(`/api/comments/${commentId}`, body, {
    auth: true,
  })
  return toCommentVM(item)
}

export async function deletePostComment(commentId: number): Promise<void> {
  await http.delete<void>(`/api/comments/${commentId}`, { auth: true })
}

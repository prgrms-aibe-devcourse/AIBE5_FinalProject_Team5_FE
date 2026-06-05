import type { CommunityPostDetailData } from './types'

export function getMockPostDetail(postId?: string): CommunityPostDetailData {
  return {
    author: '사용자1',
    createdAt: '2024-01-15',
    views: 234,
    body: `게시글 본문 영역입니다. (ID: ${postId ?? 'unknown'})`,
  }
}

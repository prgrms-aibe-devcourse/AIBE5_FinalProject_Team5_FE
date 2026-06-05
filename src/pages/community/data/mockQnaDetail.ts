import type { CommunityQnaDetailData } from './types'

export function getMockQnaDetail(qnaId?: string): CommunityQnaDetailData {
  return {
    author: '사용자4',
    createdAt: '2024-01-15',
    views: 152,
    body: `질문 본문 영역입니다. (ID: ${qnaId ?? 'unknown'})`,
  }
}

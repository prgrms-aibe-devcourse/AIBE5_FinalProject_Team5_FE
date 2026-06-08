import type { CommunityComment } from './types'

const commentTemplates = [
  '좋은 글 감사합니다!',
  '이 부분 조금 더 자세히 설명해주실 수 있나요?',
  '저도 비슷한 상황이 있었는데 도움됐어요.',
]

export function getMockComments(resourceKey: string): CommunityComment[] {
  const seedBase = Math.max(1, resourceKey.length % 3)

  return Array.from({ length: seedBase }, (_, index) => ({
    id: `${resourceKey}-${index}`,
    author: `사용자${(index % 8) + 1}`,
    content: commentTemplates[index] ?? commentTemplates[0],
    createdAt: new Date(Date.now() - (index + 1) * 1000 * 60 * 24).toISOString(),
  }))
}

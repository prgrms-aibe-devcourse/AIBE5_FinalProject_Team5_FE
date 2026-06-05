import type { CommunityQnaListItemData } from './types'

const titles = ['이 에러는 왜 발생하나요?', '최적화 방법을 알려주세요', '라이브러리 추천 부탁합니다']

export const mockQnaItems: CommunityQnaListItemData[] = Array.from({ length: 23 }, (_, index) => {
  const id = 23 - index

  return {
    id,
    title: titles[index] ?? `Q&A 질문 예시 ${id}`,
    author: `사용자${(index % 12) + 1}`,
    createdAt: `2024-01-${String(Math.max(1, 23 - index)).padStart(2, '0')}`,
    views: 30 + index * 13,
    comments: (index % 10) + 2,
    solved: index % 3 !== 1,
  }
})

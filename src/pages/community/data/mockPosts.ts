import type { CommunityListItemData } from './types'

export const mockPosts: CommunityListItemData[] = Array.from({ length: 23 }, (_, index) => {
  const id = 23 - index

  return {
    id,
    title:
      index === 0
        ? '개발 팁 공유합니다'
        : index === 1
          ? '이 방법을 시도해보세요'
          : index === 2
            ? '좋은 라이브러리를 찾았어요'
            : `게시글 제목 예시 ${id}`,
    author: `사용자${(index % 10) + 1}`,
    createdAt: `2024-01-${String(Math.max(1, 23 - index)).padStart(2, '0')}`,
    views: 50 + index * 17,
    comments: (index % 12) + 1,
  }
})

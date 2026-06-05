import type { CommunityRecruitListItemData } from './types'

const positions = ['Frontend', 'Backend', 'Design', 'Fullstack', 'DevOps']

export const mockRecruitItems: CommunityRecruitListItemData[] = Array.from({ length: 23 }, (_, index) => {
  const id = 23 - index

  return {
    id,
    title:
      index === 0
        ? 'React 개발자 모집합니다'
        : index === 1
          ? 'Node.js 백엔드 팀원 찾습니다'
          : `모집 공고 예시 ${id}`,
    company: `회사${String.fromCharCode(65 + (index % 5))}`,
    position: positions[index % positions.length],
    createdAt: `2024-01-${String(Math.max(1, 23 - index)).padStart(2, '0')}`,
    views: 80 + index * 11,
    comments: (index % 8) + 1,
  }
})

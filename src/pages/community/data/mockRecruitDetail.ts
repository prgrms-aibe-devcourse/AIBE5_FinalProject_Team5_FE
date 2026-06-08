import type { CommunityRecruitDetailData } from './types'

export function getMockRecruitDetail(recruitId?: string): CommunityRecruitDetailData {
  return {
    company: '스타트업A',
    createdAt: '2024-01-15',
    views: 421,
    body: `모집 상세 내용 영역입니다. (ID: ${recruitId ?? 'unknown'})`,
  }
}

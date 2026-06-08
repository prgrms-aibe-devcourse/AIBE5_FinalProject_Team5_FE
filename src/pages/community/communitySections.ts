// 커뮤니티 목록 최대 항목 수 (페이지네이션)
export const COMMUNITY_LIST_MAX_ITEMS = 10

// 커뮤니티 목록 경로 설정
export const communitySections = {
  posts: {
    label: '게시판',
    listPath: '/community/posts',
    writePath: '/community/posts/new',
    writeLabel: '글쓰기',
  },
  qna: {
    label: 'Q&A',
    listPath: '/community/qna',
    writePath: '/community/qna/new',
    writeLabel: '질문하기',
  },
  recruit: {
    label: '모집',
    listPath: '/community/recruit',
    writePath: '/community/recruit/new',
    writeLabel: '모집 등록',
  },
  article: { label: '아티클', listPath: '/community/article' },
} as const

export type CommunitySectionKey = keyof typeof communitySections

// 커뮤니티 경로에서 섹션 조회
export function getCommunitySectionFromPath(pathname: string): CommunitySectionKey | null {
  if (pathname.startsWith('/community/posts')) return 'posts'
  if (pathname.startsWith('/community/qna')) return 'qna'
  if (pathname.startsWith('/community/recruit')) return 'recruit'
  if (pathname.startsWith('/community/article')) return 'article'
  return null
}

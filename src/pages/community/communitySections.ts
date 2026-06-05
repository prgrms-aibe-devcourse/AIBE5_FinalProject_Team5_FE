export const communitySections = {
  posts: { label: '게시판', listPath: '/community/posts' },
  qna: { label: 'Q&A', listPath: '/community/qna' },
  recruit: { label: '모집', listPath: '/community/recruit' },
  article: { label: '아티클', listPath: '/community/article' },
} as const

export type CommunitySectionKey = keyof typeof communitySections

export function getCommunitySectionFromPath(pathname: string): CommunitySectionKey | null {
  if (pathname.startsWith('/community/posts')) return 'posts'
  if (pathname.startsWith('/community/qna')) return 'qna'
  if (pathname.startsWith('/community/recruit')) return 'recruit'
  if (pathname.startsWith('/community/article')) return 'article'
  return null
}

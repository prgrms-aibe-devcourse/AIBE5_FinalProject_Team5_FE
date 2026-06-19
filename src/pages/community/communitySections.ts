import type { PostType } from '../../services/post'

// 커뮤니티 목록 최대 항목 수 (페이지네이션)
export const COMMUNITY_LIST_MAX_ITEMS = 10

// 아티클 목록 페이지당 항목 수 (getArticles size 파라미터)
export const ARTICLE_LIST_PAGE_SIZE = 5

// 커뮤니티 목록 경로 설정
export const communitySections = {
  posts: {
    label: '게시글',
    listPath: '/community/posts',
    writePath: '/community/posts/new',
    writeLabel: '작성하기',
  },
  qna: {
    label: 'Q&A',
    listPath: '/community/qna',
    writePath: '/community/qna/new',
    writeLabel: '질문하기',
  },
  recruit: {
    label: '모집글',
    listPath: '/community/recruit',
    writePath: '/community/recruit/new',
    writeLabel: '모집등록',
  },
  article: { label: '아티클', listPath: '/community/article' },
} as const

export type CommunitySectionKey = keyof typeof communitySections

/** 커뮤니티 섹션 → BE postType 매핑 */
export const COMMUNITY_POST_TYPE_BY_SECTION = {
  posts: 'BOARD',
  qna: 'QNA',
  recruit: 'PROJECT_RECRUIT',
} as const satisfies Record<Exclude<CommunitySectionKey, 'article'>, PostType>

/** BE postType → 커뮤니티 섹션 */
export const POST_TYPE_TO_SECTION: Record<PostType, WritableCommunitySectionKey> = {
  BOARD: 'posts',
  QNA: 'qna',
  PROJECT_RECRUIT: 'recruit',
}

/** BE postType → 상세 카드 variant */
export const POST_TYPE_TO_CARD_TYPE: Record<PostType, 'board' | 'qna' | 'recruit'> = {
  BOARD: 'board',
  QNA: 'qna',
  PROJECT_RECRUIT: 'recruit',
}

/** 게시글 상세·수정 공통 경로 (타입은 API 응답 postType으로 구분) */
export function getCommunityPostPath(postId: number): string {
  return `/community/posts/${postId}`
}

export function getCommunityEditPath(postId: number): string {
  return `/community/posts/edit/${postId}`
}

// 커뮤니티 경로에서 섹션 조회 (목록·작성 페이지용)
export function getCommunitySectionFromPath(pathname: string): CommunitySectionKey | null {
  if (pathname.startsWith('/community/qna')) return 'qna'
  if (pathname.startsWith('/community/recruit')) return 'recruit'
  if (pathname.startsWith('/community/article')) return 'article'
  if (pathname.startsWith('/community/posts')) return 'posts'
  return null
}

export type WritableCommunitySectionKey = Exclude<CommunitySectionKey, 'article'>

/** 작성 완료 후 이동할 상세 경로 */
export function getCommunityDetailPath(_sectionKey: WritableCommunitySectionKey, postId: number): string {
  return getCommunityPostPath(postId)
}

import type { TabItem } from '../../../components/common/Tabs'

export type UserPost = {
  id: number
  title: string
  board: string
  createdAt: string
  viewCount: number
  commentCount: number
}

export type UserComment = {
  id: number
  content: string
  parentTitle: string
  parentPostId: number
  board: string
  createdAt: string
}

export type MyPostTab = 'ALL' | 'POST' | 'QNA' | 'RECRUIT' | 'COMMENT'

export const MY_POST_TABS: TabItem<MyPostTab>[] = [
  { key: 'ALL', label: '전체' },
  { key: 'POST', label: '게시글' },
  { key: 'QNA', label: 'Q&A' },
  { key: 'RECRUIT', label: '모집' },
  { key: 'COMMENT', label: '댓글' },
]

export type UserActivityItem = {
  id: number
  kind: 'post' | 'comment'
  title: string
  board: string
  createdAt: string
  viewCount?: number
  commentCount?: number
  parentTitle?: string
  parentPostId?: number
}

export function getUserPostPath(post: Pick<UserPost, 'id' | 'board'>) {
  if (post.board === 'Q&A') return `/community/qna/${post.id}`
  if (post.board === '모집') return `/community/recruit/${post.id}`
  return `/community/posts/${post.id}`
}

export function getUserActivityPath(item: UserActivityItem) {
  if (item.kind === 'comment' && item.parentPostId != null) {
    return getUserPostPath({ id: item.parentPostId, board: item.board })
  }
  return getUserPostPath({ id: item.id, board: item.board })
}

export function getUserActivityEditPath(item: UserActivityItem) {
  if (item.kind === 'comment') return getUserActivityPath(item)
  if (item.board === 'Q&A') return '/community/qna/new'
  if (item.board === '모집') return '/community/recruit/new'
  return '/community/posts/new'
}

function postToActivity(post: UserPost): UserActivityItem {
  return {
    id: post.id,
    kind: 'post',
    title: post.title,
    board: post.board,
    createdAt: post.createdAt,
    viewCount: post.viewCount,
    commentCount: post.commentCount,
  }
}

function commentToActivity(comment: UserComment): UserActivityItem {
  return {
    id: comment.id,
    kind: 'comment',
    title: comment.content,
    board: comment.board,
    createdAt: comment.createdAt,
    parentTitle: comment.parentTitle,
    parentPostId: comment.parentPostId,
  }
}

export function buildMyActivities(posts: UserPost[], comments: UserComment[]) {
  return [...posts.map(postToActivity), ...comments.map(commentToActivity)].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  )
}

export function filterMyActivities(items: UserActivityItem[], tab: MyPostTab) {
  if (tab === 'ALL') return items
  if (tab === 'COMMENT') return items.filter((item) => item.kind === 'comment')
  if (tab === 'POST') return items.filter((item) => item.kind === 'post' && item.board === '게시판')
  if (tab === 'QNA') return items.filter((item) => item.kind === 'post' && item.board === 'Q&A')
  if (tab === 'RECRUIT') return items.filter((item) => item.kind === 'post' && item.board === '모집')
  return items
}

export function countMyActivitiesByTab(items: UserActivityItem[]) {
  return MY_POST_TABS.reduce(
    (acc, tab) => {
      acc[tab.key] = filterMyActivities(items, tab.key).length
      return acc
    },
    {} as Record<MyPostTab, number>,
  )
}

export type RecentPost = {
  id: number
  title: string
  board: '게시판' | 'Q&A' | '모집'
  createdAt: string
  viewCount: number
  commentCount: number
}

/** API 연동 후 제거 예정 — 대시보드 홈 최근 글 더미 데이터 */
export const recentPosts: RecentPost[] = [
  {
    id: 1,
    title: '[프로그래머스] 국비지원 프론트엔드 데브코스 리뷰',
    board: '게시판',
    createdAt: '2026-06-08',
    viewCount: 128,
    commentCount: 14,
  },
  {
    id: 2,
    title: '네이버 부트캠프 수료 후 취업 성공기',
    board: '게시판',
    createdAt: '2026-06-05',
    viewCount: 342,
    commentCount: 28,
  },
  {
    id: 3,
    title: '카카오뱅크 면접 후기',
    board: 'Q&A',
    createdAt: '2026-06-02',
    viewCount: 89,
    commentCount: 6,
  },
  {
    id: 4,
    title: '카카오 모빌리티 대비 스터디 구인',
    board: '모집',
    createdAt: '2026-05-30',
    viewCount: 56,
    commentCount: 9,
  },
]

/** API 연동 후 제거 예정 — 내가 쓴 글 페이지 더미 데이터 */
export const myPosts: UserPost[] = [
  {
    id: 1,
    title: '[프로그래머스] 국비지원 프론트엔드 데브코스 리뷰',
    board: '게시판',
    createdAt: '2026.06.08',
    viewCount: 128,
    commentCount: 14,
  },
  {
    id: 2,
    title: '네이버 부트캠프 수료 후 취업 성공기',
    board: '게시판',
    createdAt: '2026.06.05',
    viewCount: 342,
    commentCount: 28,
  },
  {
    id: 3,
    title: '카카오뱅크 면접 후기',
    board: 'Q&A',
    createdAt: '2026.06.02',
    viewCount: 89,
    commentCount: 6,
  },
  {
    id: 4,
    title: '카카오 모빌리티 대비 스터디 구인',
    board: '모집',
    createdAt: '2026.05.30',
    viewCount: 56,
    commentCount: 9,
  },
  {
    id: 5,
    title: '국비 과정 선택할 때 꼭 봐야 할 체크리스트',
    board: '게시판',
    createdAt: '2026.05.28',
    viewCount: 201,
    commentCount: 17,
  },
  {
    id: 6,
    title: '포트폴리오 피드백 부탁드립니다',
    board: 'Q&A',
    createdAt: '2026.05.25',
    viewCount: 73,
    commentCount: 11,
  },
  {
    id: 7,
    title: '주말 알고리즘 스터디 멤버 모집',
    board: '모집',
    createdAt: '2026.05.22',
    viewCount: 44,
    commentCount: 5,
  },
  {
    id: 8,
    title: '백엔드 과정 3개월 차 회고',
    board: '게시판',
    createdAt: '2026.05.18',
    viewCount: 167,
    commentCount: 22,
  },
]

/** API 연동 후 제거 예정 — 내가 쓴 댓글 더미 데이터 */
export const myComments: UserComment[] = [
  {
    id: 101,
    content: '저도 같은 과정 수강 중인데 정보 공유 감사합니다!',
    parentTitle: '네이버 부트캠프 수료 후 취업 성공기',
    parentPostId: 2,
    board: '게시판',
    createdAt: '2026.06.06',
  },
  {
    id: 102,
    content: '면접 질문 리스트 정리해 주셔서 많은 도움이 됐어요.',
    parentTitle: '카카오뱅크 면접 후기',
    parentPostId: 3,
    board: 'Q&A',
    createdAt: '2026.06.03',
  },
  {
    id: 103,
    content: '스터디 일정 공유 부탁드립니다!',
    parentTitle: '카카오 모빌리티 대비 스터디 구인',
    parentPostId: 4,
    board: '모집',
    createdAt: '2026.05.31',
  },
  {
    id: 104,
    content: '체크리스트 항목 중 포트폴리오 파트가 특히 유용했습니다.',
    parentTitle: '국비 과정 선택할 때 꼭 봐야 할 체크리스트',
    parentPostId: 5,
    board: '게시판',
    createdAt: '2026.05.29',
  },
]

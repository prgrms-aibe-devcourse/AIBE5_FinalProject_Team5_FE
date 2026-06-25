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

export type MyPostTab = 'POST' | 'QNA' | 'RECRUIT' | 'COMMENT' | 'REVIEW'

export const MY_POST_TABS: TabItem<MyPostTab>[] = [
  { key: 'POST', label: '게시글' },
  { key: 'QNA', label: 'Q&A' },
  { key: 'RECRUIT', label: '모집' },
  { key: 'COMMENT', label: '댓글' },
  { key: 'REVIEW', label: '리뷰' },
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
  courseId?: number
  courseSessionId?: number
}

export function getUserPostPath(postId: number) {
  return `/community/posts/${postId}`
}

export function getUserActivityPath(item: UserActivityItem): string | null {
  if (item.kind === 'comment') {
    return item.parentPostId != null ? getUserPostPath(item.parentPostId) : null
  }
  if (item.board === '리뷰' && item.courseSessionId != null) {
    return `/courses/${item.courseSessionId}`
  }
  return getUserPostPath(item.id)
}

export function getUserActivityEditPath(item: UserActivityItem): string | null {
  if (item.kind === 'comment') {
    return item.parentPostId != null ? getUserPostPath(item.parentPostId) : null
  }
  if (item.board === '리뷰' && item.courseSessionId != null) {
    return `/courses/${item.courseSessionId}`
  }
  return `/community/posts/edit/${item.id}`
}

export function getCommentEditNavigationState(item: UserActivityItem) {
  if (item.kind !== 'comment') return undefined
  return { editCommentId: item.id }
}

export function getReviewEditNavigationState(item: UserActivityItem) {
  if (item.board !== '리뷰') return undefined
  return { editReviewId: item.id, openReviewsTab: true as const }
}

export function getUserActivityDetailNavigationState(item: UserActivityItem) {
  if (item.board === '리뷰') {
    return { openReviewsTab: true as const, title: item.title }
  }
  return { title: item.title }
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
  if (tab === 'COMMENT') return items.filter((item) => item.kind === 'comment')
  if (tab === 'POST') return items.filter((item) => item.kind === 'post' && item.board === '게시판')
  if (tab === 'REVIEW') return items.filter((item) => item.kind === 'post' && item.board === '리뷰')
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

export type CommunityListItemData = {
  id: number
  title: string
  author: string
  createdAt: string
  views: number
  comments: number
}

export type CommunityQnaListItemData = CommunityListItemData & {
  solved: boolean
}

export type CommunityRecruitListItemData = {
  id: number
  title: string
  company: string
  position: string
  createdAt: string
  views: number
  comments: number
}

export type ArticleItem = {
  id: number
  title: string
  summary: string
  category: string
  author: string
  createdAt: string
  readTimeMinutes: number
  externalUrl: string
  thumbnailUrl?: string | null
  coverVariant: number
}

export type CommunityComment = {
  id: string
  author: string
  content: string
  createdAt: string
}

export type CommunityPostDetailData = {
  author: string
  createdAt: string
  views: number
  body: string
}

export type CommunityQnaDetailData = CommunityPostDetailData

export type CommunityRecruitDetailData = {
  company: string
  createdAt: string
  views: number
  body: string
}

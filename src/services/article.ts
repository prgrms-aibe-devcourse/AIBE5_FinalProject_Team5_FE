/**
 * 아티클 API 연동
 *
 * GET /api/articles
 * 흐름: http.get → ArticleListItem(BE DTO) → toArticleVM → Article(FE 뷰모델) → CommunityArticlePage
 */
import { http } from './http'
import type { PageResponse } from './apiTypes'
import { toDateOnly } from '../utils/formatRequestedDate'

// ──────────────────────────────────────────────
// FE 뷰모델 — 컴포넌트가 소비하는 타입
// ──────────────────────────────────────────────

export interface Article {
  id: number
  title: string
  summary: string
  category: string
  author: string
  publishedAt: string
  collectedAt: string
  readTimeMinutes: number
  externalUrl: string
  thumbnailUrl?: string | null
  coverVariant: number
  /** @deprecated ArticleItem 호환용 — publishedAt과 동일 */
  createdAt: string
}

// ──────────────────────────────────────────────
// BE DTO — 실제 API 응답 형태
// ──────────────────────────────────────────────

export type ArticleSource = 'KAKAO_TECH' | 'TOSS_TECH' | 'WOOWAHAN' | 'D2_NAVER' | 'YOZM'

export interface ArticleListItem {
  id: number
  source: ArticleSource
  title: string
  summary: string
  thumbnailUrl: string | null
  author: string | null
  articleUrl: string
  publishedAt: string
  updatedAt: string
}

export interface ArticleListParams {
  page?: number // 0-based (BE 규격)
  size?: number
}

// ──────────────────────────────────────────────
// 매퍼 (BE DTO → FE 뷰모델)
// ──────────────────────────────────────────────

const SOURCE_LABEL_MAP: Record<ArticleSource, string> = {
  KAKAO_TECH: '카카오 테크',
  TOSS_TECH: '토스 테크',
  WOOWAHAN: '우아한형제들',
  D2_NAVER: 'D2 NAVER',
  YOZM: '요즘IT',
}

function formatPublishedDate(iso: string): string {
  return toDateOnly(iso)
}

function estimateReadTime(summary: string): number {
  return Math.max(3, Math.ceil(summary.length / 400))
}

export function toArticleVM(item: ArticleListItem): Article {
  const sourceLabel = SOURCE_LABEL_MAP[item.source] ?? item.source
  const publishedAt = formatPublishedDate(item.publishedAt)

  return {
    id: item.id,
    title: item.title,
    summary: item.summary,
    category: sourceLabel, // source → 한글 라벨
    author: item.author ?? sourceLabel,
    publishedAt, // 원문 블로그 게재일
    collectedAt: toDateOnly(item.updatedAt), // 수집·반영일 (BE 전용 필드 없음 → updatedAt 사용)
    createdAt: publishedAt,
    readTimeMinutes: estimateReadTime(item.summary),
    externalUrl: item.articleUrl,
    thumbnailUrl: item.thumbnailUrl,
    coverVariant: item.id % 5,
  }
}

// ──────────────────────────────────────────────
// API 함수
// ──────────────────────────────────────────────

/** 아티클 목록 (뷰모델로 변환해 반환) */
export async function getArticles(params: ArticleListParams = {}): Promise<PageResponse<Article>> {
  const page = await http.get<PageResponse<ArticleListItem>>('/api/articles', {
    query: params as Record<string, unknown>,
    auth: false,
  })
  return { ...page, content: page.content.map(toArticleVM) }
}

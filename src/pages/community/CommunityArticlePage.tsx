import { useEffect, useState } from 'react'
import Pagination from '../../components/common/Pagination'
import { formatCommunityDate } from '../../utils/formatRequestedDate'
import { ARTICLE_LIST_PAGE_SIZE } from './communitySections'
import ArticleCover from './components/article/ArticleCover'
import type { Article } from '../../services/article'
import { getArticles } from '../../services/article'

// 아티클 목록 페이지
// API: services/article.getArticles — GET /api/articles (서버 페이지네이션)
export default function CommunityArticlePage() {
  // 목록·페이지네이션·로딩 상태
  const [articles, setArticles] = useState<Article[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // currentPage 변경 시 목록 재조회 (FE 1-based → BE page 0-based)
  useEffect(() => {
    setIsLoading(true)
    setFetchError(null)

    getArticles({
      page: currentPage - 1, // FE 1-based → BE 0-based
      size: ARTICLE_LIST_PAGE_SIZE,
    })
      .then((data) => {
        setArticles(data.content)
        setTotalPages(data.totalPages || 1)
      })
      .catch((err: unknown) => {
        setFetchError(err instanceof Error ? err.message : '아티클 목록을 불러오는 중 오류가 발생했습니다.')
      })
      .finally(() => setIsLoading(false))
  }, [currentPage])

  return (
    <div>
      {isLoading ? (
        <p className="py-10 text-center text-sm text-secondary">불러오는 중...</p>
      ) : fetchError ? (
        <p className="py-10 text-center text-sm text-red-500">{fetchError}</p>
      ) : articles.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {articles.map((article) => (
            <ArticleNewsletterRow key={article.id} article={article} />
          ))}
        </ul>
      ) : (
        <p className="py-10 text-center text-sm text-secondary">아티클이 없습니다.</p>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        className="mt-8"
      />
    </div>
  )
}

// 아티클 목록 단일 항목 컴포넌트
function ArticleNewsletterRow({ article }: { article: Article }) {
  return (
    <li>
      <a
        href={article.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex min-h-[148px] overflow-hidden rounded-2xl border border-mistSkyBlue/45 bg-white shadow-[0_2px_12px_rgba(52,74,100,0.05)] transition-all duration-300 hover:border-waterlineBlue/35 hover:bg-foamWhite/60 hover:shadow-[0_10px_30px_rgba(0,94,184,0.08)] sm:min-h-[160px]"
      >
        <ArticleCover
          article={article}
          className="relative w-32 shrink-0 self-stretch sm:w-40 md:w-48 lg:w-52"
        />

        <div className="flex min-w-0 flex-1 flex-col justify-center px-4 py-4 sm:px-5 sm:py-5 md:px-6">
          <span className="inline-flex w-fit rounded-full bg-foamWhite px-2.5 py-0.5 text-[11px] font-semibold text-waterlineBlue ring-1 ring-mistSkyBlue/40">
            {article.category}
          </span>

          <h3 className="mt-2 text-base font-semibold leading-snug text-deepOceanNavy transition-colors group-hover:text-[#005EB8] md:text-[17px]">
            {article.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-secondary">{article.summary}</p>

          <div className="mt-3 text-xs text-secondary">
            <span className="text-deepOceanNavy/55">게재</span>{' '}
            <time dateTime={article.publishedAt} className="tabular-nums">
              {formatCommunityDate(article.publishedAt)}
            </time>
          </div>
        </div>
      </a>
    </li>
  )
}

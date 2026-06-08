import Pagination, { usePaginatedList } from '../../components/common/Pagination'
import { formatCommunityDate } from '../../utils/formatRequestedDate'
import { mockArticles } from './data/mockArticles'
import { COMMUNITY_LIST_MAX_ITEMS } from './communitySections'
import type { ArticleItem } from './data/types'
import ArticleCover from './components/article/ArticleCover'

// 아티클 목록 페이지 (RSS 백엔드 연동)
export default function CommunityArticlePage() {
  // 아티클 목록 데이터 + 페이지네이션 처리
  const { currentPage, totalPages, displayedItems, onPageChange } = usePaginatedList(
    mockArticles,
    COMMUNITY_LIST_MAX_ITEMS,
  )

  return (
    <section aria-label="아티클 목록">
      {displayedItems.length > 0 ? (
        // 아티클 목록 리스트
        <ul className="mt-5 flex flex-col gap-4">
          {displayedItems.map((article) => (
            // 아티클 목록 단일 항목
            <ArticleNewsletterRow key={article.id} article={article} />
          ))}
        </ul>
      ) : (
        // 아티클 목록 부재 시
        <p className="py-10 text-center text-sm text-secondary">아티클이 없습니다.</p>
      )}

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="mt-8"
      />
    </section>
  )
}

// 아티클 목록 단일 항목 컴포넌트
function ArticleNewsletterRow({ article }: { article: ArticleItem }) {
  return (
    <li>
      <a
        href={article.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex min-h-[148px] overflow-hidden rounded-2xl border border-mistSkyBlue/45 bg-white shadow-[0_2px_12px_rgba(52,74,100,0.05)] transition-all duration-300 hover:border-waterlineBlue/35 hover:bg-foamWhite/60 hover:shadow-[0_10px_30px_rgba(0,94,184,0.08)] sm:min-h-[160px]"
      >
        {/* 아티클 썸네일 */}
        <ArticleCover
          article={article}
          className="relative w-32 shrink-0 self-stretch sm:w-40 md:w-48 lg:w-52"
        />

        {/* 아티클 정보 (카테고리 + 제목 + 요약 + 작성자 + 작성일) */}
        <div className="flex min-w-0 flex-1 flex-col justify-center px-4 py-4 sm:px-5 sm:py-5 md:px-6">
          <span className="inline-flex w-fit rounded-full bg-foamWhite px-2.5 py-0.5 text-[11px] font-semibold text-waterlineBlue ring-1 ring-mistSkyBlue/40">
            {article.category}
          </span>

          <h3 className="mt-2 text-base font-semibold leading-snug text-deepOceanNavy transition-colors group-hover:text-[#005EB8] md:text-[17px]">
            {article.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-secondary">{article.summary}</p>

          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-secondary">
            <span className="font-medium text-deepOceanNavy/75">{article.author}</span>
            <span className="text-mistSkyBlue" aria-hidden="true">
              ·
            </span>
            <time dateTime={article.createdAt}>{formatCommunityDate(article.createdAt)}</time>
          </div>
        </div>
      </a>
    </li>
  )
}

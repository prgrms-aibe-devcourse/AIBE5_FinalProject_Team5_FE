import { articleCategories } from '../../data/mockArticles'
import type { ArticleItem } from '../../data/types'
import ArticleNewsletterSubscribe from './ArticleNewsletterSubscribe'

type ArticleNewsletterSidebarProps = {
  popularArticles: ArticleItem[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export default function ArticleNewsletterSidebar({
  popularArticles,
  selectedCategory,
  onCategoryChange,
}: ArticleNewsletterSidebarProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-5 lg:w-64" aria-label="아티클 사이드바">
      <ArticleNewsletterSubscribe compact />

      <div className="rounded-2xl border border-mistSkyBlue/50 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-deepOceanNavy">카테고리</h2>
        <ul className="mt-3 flex flex-col gap-1">
          {articleCategories.map((category) => {
            const isActive = selectedCategory === category

            return (
              <li key={category}>
                <button
                  type="button"
                  onClick={() => onCategoryChange(category)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? 'bg-waterlineBlue/10 font-semibold text-waterlineBlue'
                      : 'text-secondary hover:bg-foamWhite/80 hover:text-deepOceanNavy'
                  }`}
                >
                  {category}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="rounded-2xl border border-mistSkyBlue/50 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-deepOceanNavy">인기 아티클</h2>
        <ol className="mt-3 space-y-3">
          {popularArticles.map((article, index) => (
            <li key={article.id}>
              <a
                href={article.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-3"
              >
                <span className="w-5 shrink-0 text-sm font-bold tabular-nums text-waterlineBlue">{index + 1}</span>
                <span className="line-clamp-2 text-sm leading-snug text-deepOceanNavy transition-colors group-hover:text-[#005EB8]">
                  {article.title}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  )
}

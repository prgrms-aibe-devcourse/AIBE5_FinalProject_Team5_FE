import { formatCommunityDate } from '../../../../utils/formatRequestedDate'
import ArticleCover from './ArticleCover'
import type { ArticleItem } from '../../data/types'

type ArticleNewsletterHeroProps = {
  article: ArticleItem
}

export default function ArticleNewsletterHero({ article }: ArticleNewsletterHeroProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-mistSkyBlue/45 bg-white shadow-[0_4px_24px_rgba(52,74,100,0.07)]">
      <ArticleCover
        article={article}
        showCategory
        className="aspect-[21/9] w-full md:aspect-[2.4/1]"
      />

      <div className="border-t border-mistSkyBlue/30 px-5 py-6 md:px-8 md:py-8">
        <p className="text-xs font-semibold tracking-wide text-waterlineBlue">EDITOR&apos;S PICK</p>

        <h2 className="mt-2 text-2xl font-bold leading-snug text-deepOceanNavy transition-colors group-hover:text-[#005EB8] md:text-3xl">
          <a
            href={article.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-waterlineBlue/40"
          >
            {article.title}
          </a>
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-secondary md:text-[15px]">
          {article.summary}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-secondary">
          <span className="font-medium text-deepOceanNavy/80">{article.author}</span>
          <span className="text-mistSkyBlue" aria-hidden="true">
            ·
          </span>
          <time dateTime={article.createdAt}>{formatCommunityDate(article.createdAt)}</time>
          <span className="text-mistSkyBlue" aria-hidden="true">
            ·
          </span>
          <span>{article.readTimeMinutes}분 읽기</span>
        </div>

        <a
          href={article.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-waterlineBlue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#005EB8]"
        >
          아티클 읽기
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  )
}

import { formatCommunityDate } from '../../../../utils/formatRequestedDate'

type ArticleNewsletterMastheadProps = {
  volume: number
  publishedAt: string
}

export default function ArticleNewsletterMasthead({ volume, publishedAt }: ArticleNewsletterMastheadProps) {
  return (
    <header className="overflow-hidden rounded-2xl border border-mistSkyBlue/45 bg-gradient-to-br from-foamWhite via-white to-mistSkyBlue/15 px-6 py-8 text-center shadow-[0_4px_20px_rgba(52,74,100,0.06)] md:px-10 md:py-10">
      <p className="text-xs font-semibold tracking-[0.2em] text-waterlineBlue">COMMUNITY INSIGHT LETTER</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-deepOceanNavy md:text-4xl">Insight Letter</h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-secondary">
        개발·취업·커리어 인사이트를 주 1회, 읽기 쉬운 뉴스레터로 전해드립니다.
      </p>

      <div className="mx-auto mt-5 flex max-w-sm flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-secondary">
        <span>
          Vol. <span className="font-semibold text-deepOceanNavy">{volume}</span>
        </span>
        <span className="text-mistSkyBlue" aria-hidden="true">
          ·
        </span>
        <time dateTime={publishedAt} className="font-medium text-deepOceanNavy/80">
          {formatCommunityDate(publishedAt)} 발행
        </time>
      </div>
    </header>
  )
}

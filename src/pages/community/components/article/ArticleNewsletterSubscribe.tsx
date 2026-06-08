import { type FormEvent, useState } from 'react'

type ArticleNewsletterSubscribeProps = {
  compact?: boolean
}

export default function ArticleNewsletterSubscribe({ compact = false }: ArticleNewsletterSubscribeProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div
        className={
          compact
            ? 'rounded-xl border border-mistSkyBlue/40 bg-foamWhite/60 p-4 text-sm text-deepOceanNavy'
            : 'rounded-2xl border border-waterlineBlue/25 bg-waterlineBlue/5 px-5 py-4 text-center text-sm text-deepOceanNavy md:px-6'
        }
      >
        구독 신청이 접수되었습니다. 다음 호를 기대해 주세요!
      </div>
    )
  }

  if (compact) {
    return (
      <div className="rounded-2xl border border-mistSkyBlue/50 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-deepOceanNavy">뉴스레터 구독</h2>
        <p className="mt-1.5 text-xs leading-relaxed text-secondary">새 아티클이 올라오면 메일로 받아보세요.</p>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="이메일 주소"
            required
            className="w-full rounded-lg border border-mistSkyBlue/50 bg-white px-3 py-2 text-sm text-deepOceanNavy outline-none transition-colors placeholder:text-softAquaBlue focus:border-waterlineBlue"
          />
          <button
            type="submit"
            className="rounded-lg bg-waterlineBlue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#005EB8]"
          >
            구독하기
          </button>
        </form>
      </div>
    )
  }

  return (
    <section
      aria-label="뉴스레터 구독"
      className="rounded-2xl border border-mistSkyBlue/40 bg-white px-5 py-5 shadow-[0_2px_12px_rgba(52,74,100,0.04)] md:flex md:items-center md:justify-between md:gap-6 md:px-6"
    >
      <div className="md:min-w-0 md:flex-1">
        <h2 className="text-sm font-semibold text-deepOceanNavy">매주 인사이트를 메일로 받아보세요</h2>
        <p className="mt-1 text-xs text-secondary">이번 주 놓친 아티클을 다음 호에서 다시 만날 수 있습니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex w-full flex-col gap-2 sm:flex-row md:mt-0 md:max-w-md">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="이메일을 입력하세요"
          required
          className="min-w-0 flex-1 rounded-lg border border-mistSkyBlue/50 bg-white px-3 py-2.5 text-sm text-deepOceanNavy outline-none transition-colors placeholder:text-softAquaBlue focus:border-waterlineBlue"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-waterlineBlue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#005EB8]"
        >
          무료 구독
        </button>
      </form>
    </section>
  )
}

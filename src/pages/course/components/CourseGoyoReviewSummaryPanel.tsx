import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../../../services/ApiError.ts'
import { createReviewSummary, type ReviewSummary } from '../../../services/ai.ts'
import { isAuthenticated } from '../../../services/authToken.ts'
import { getCrawledReviews } from '../../../services/review.ts'

const MIN_GOYO_REVIEWS_FOR_SUMMARY = 6

interface CourseGoyoReviewSummaryPanelProps {
  courseId: number
  refreshKey?: number
}

type SummaryViewState =
  | 'checking'
  | 'insufficient'
  | 'ready'
  | 'fetching'
  | 'login_required'
  | 'success'
  | 'error'

type TagTone = 'strength' | 'weakness' | 'recommend' | 'keyword'

const TAG_TONE_CLASS: Record<TagTone, string> = {
  strength:
    'border-waterlineBlue/35 bg-gradient-to-r from-waterlineBlue/14 to-softAquaBlue/10 text-deepOceanNavy shadow-[0_1px_0_rgba(84,132,183,0.08)]',
  weakness:
    'border-mistSkyBlue/55 bg-white/75 text-deepOceanNavy/80 shadow-[0_1px_0_rgba(187,211,224,0.35)]',
  recommend:
    'border-softAquaBlue/45 bg-gradient-to-r from-foamWhite/90 to-mistSkyBlue/25 text-deepOceanNavy shadow-[0_1px_0_rgba(139,180,210,0.12)]',
  keyword:
    'border-mistSkyBlue/50 bg-foamWhite/55 text-waterlineBlue shadow-[0_1px_0_rgba(187,211,224,0.25)]',
}

function SummaryIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9.5 3.5A2.5 2.5 0 0112 1a2.5 2.5 0 012.5 2.5V4h2A2.5 2.5 0 0119 6.5v13A2.5 2.5 0 0116.5 22h-9A2.5 2.5 0 015 19.5v-13A2.5 2.5 0 017.5 4h2v-.5zM8 8h8M8 12h5M8 16h8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="group/info relative inline-flex">
      <button
        type="button"
        className="inline-flex items-center justify-center text-waterlineBlue/80 transition-colors hover:text-waterlineBlue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-waterlineBlue/30 rounded-sm"
        aria-label="안내 보기"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-max max-w-[15rem] -translate-x-1/2 rounded-lg border border-mistSkyBlue/45 bg-white px-3 py-2 text-left text-xs leading-relaxed text-deepOceanNavy/85 opacity-0 shadow-[0_8px_24px_rgba(52,74,100,0.12)] transition-opacity duration-150 group-hover/info:opacity-100 group-focus-within/info:opacity-100"
      >
        {text}
      </span>
    </span>
  )
}

function TagList({
  label,
  items,
  tone,
}: {
  label: string
  items: string[]
  tone: TagTone
}) {
  if (items.length === 0) return null

  return (
    <section className="rounded-xl border border-mistSkyBlue/35 bg-white/45 p-4 backdrop-blur-[2px]">
      <p className="text-xs font-bold uppercase tracking-wide text-waterlineBlue/90">{label}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium leading-snug md:text-[0.82rem] ${TAG_TONE_CLASS[tone]}`}
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

function InfoNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-mistSkyBlue/40 bg-gradient-to-br from-white/80 via-foamWhite/35 to-mistSkyBlue/15 px-4 py-4 text-sm text-deepOceanNavy/85 backdrop-blur-sm md:px-5">
      {children}
    </div>
  )
}

function getSummaryErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.code) {
      case 'AI_INPUT_INVALID':
        return '요약할 고용 24 수강후기가 없습니다.'
      case 'UNAUTHORIZED':
        return '로그인이 필요합니다.'
      case 'COURSE_NOT_FOUND':
        return '과정을 찾을 수 없습니다.'
      case 'AI_EXECUTION_FAILED':
      case 'AI_OUTPUT_INVALID':
      case 'AI_RETRY_EXHAUSTED':
        return 'AI 요약 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.'
      default:
        return error.message
    }
  }

  return error instanceof Error ? error.message : '고용 24 리뷰 요약을 불러올 수 없습니다.'
}

export default function CourseGoyoReviewSummaryPanel({
  courseId,
  refreshKey = 0,
}: CourseGoyoReviewSummaryPanelProps) {
  const [viewState, setViewState] = useState<SummaryViewState>('checking')
  const [summary, setSummary] = useState<ReviewSummary | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function checkEligibility() {
      setViewState('checking')
      setErrorMessage(null)
      setSummary(null)

      try {
        const crawled = await getCrawledReviews(courseId, 0, 1)
        if (cancelled) return

        const count = crawled.totalElements ?? 0
        if (count < MIN_GOYO_REVIEWS_FOR_SUMMARY) {
          setViewState('insufficient')
          return
        }

        setViewState('ready')
      } catch (error) {
        if (cancelled) return
        setErrorMessage(getSummaryErrorMessage(error))
        setViewState('error')
      }
    }

    void checkEligibility()

    return () => {
      cancelled = true
    }
  }, [courseId, refreshKey])

  const handleFetchSummary = async () => {
    if (!isAuthenticated()) {
      setViewState('login_required')
      return
    }

    setViewState('fetching')
    setErrorMessage(null)

    try {
      const data = await createReviewSummary(courseId)
      setSummary(data)
      setViewState('success')
    } catch (error) {
      setErrorMessage(getSummaryErrorMessage(error))
      setViewState('error')
    }
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-2 px-1">
        <div className="inline-flex items-center gap-2 rounded-full border border-mistSkyBlue/40 bg-white/30 px-4 py-1.5 shadow-[0_4px_16px_rgba(52,74,100,0.10)] backdrop-blur-md">
          <span className="flex h-6 w-6 items-center justify-center text-waterlineBlue">
            <SummaryIcon />
          </span>
          <h3 className="text-sm font-bold tracking-tight text-deepOceanNavy">고용 24 리뷰 요약</h3>
        </div>
        <InfoTooltip text="고용 24에서 수집한 수강후기를 AI가 분석·요약한 결과입니다." />
      </div>

      <div className="overflow-hidden rounded-2xl glass-panel shadow-[0_2px_12px_rgba(52,74,100,0.06)]">
        <div className="p-4 md:p-5">
          {viewState === 'checking' ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <div
                className="h-8 w-8 animate-spin rounded-full border-[3px] border-mistSkyBlue/35 border-t-waterlineBlue"
                aria-hidden="true"
              />
              <p className="text-sm text-secondary">고용 24 후기 수를 확인하는 중...</p>
            </div>
          ) : null}

          {viewState === 'ready' || viewState === 'login_required' || viewState === 'error' ? (
            <div className="flex flex-col items-center gap-3 py-10">
              {viewState === 'login_required' ? (
                <InfoNotice>
                  <p>고용 24 리뷰 요약은 로그인 후 확인할 수 있습니다.</p>
                  <Link
                    to="/login"
                    className="mt-2 inline-flex items-center gap-1 font-semibold text-waterlineBlue transition-colors hover:text-deepOceanNavy"
                  >
                    로그인하러 가기
                    <span aria-hidden="true">→</span>
                  </Link>
                </InfoNotice>
              ) : null}

              {viewState === 'error' ? (
                <div className="w-full rounded-lg border border-red-200/80 bg-red-50/80 px-4 py-3 text-sm text-red-800">
                  {errorMessage}
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => void handleFetchSummary()}
                className="inline-flex items-center justify-center rounded-lg border border-dashed border-waterlineBlue/50 bg-waterlineBlue/8 px-4 py-2.5 text-sm font-semibold text-deepOceanNavy transition-colors hover:border-waterlineBlue hover:bg-waterlineBlue/12"
              >
                AI 요약 불러오기 (배포 전 테스트)
              </button>
              <p className="text-center text-xs text-secondary">
                버튼을 눌렀을 때만 AI 요약 API가 호출됩니다.
              </p>
            </div>
          ) : null}

          {viewState === 'fetching' ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <div
                className="h-8 w-8 animate-spin rounded-full border-[3px] border-mistSkyBlue/35 border-t-waterlineBlue"
                aria-hidden="true"
              />
              <p className="text-sm text-secondary">고용 24 리뷰 요약을 생성하는 중...</p>
            </div>
          ) : null}

          {viewState === 'insufficient' ? (
            <InfoNotice>
              <p className="text-secondary">
                신뢰도 있는 AI 요약은 고용 24 후기가 6건 이상일 때 제공됩니다.
              </p>
            </InfoNotice>
          ) : null}

          {viewState === 'success' && summary ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
                <div className="flex shrink-0 flex-col items-center justify-center rounded-xl border border-mistSkyBlue/35 bg-foamWhite/35 px-5 py-4 md:min-w-[120px]">
                  <div className="flex items-center gap-1.5">
                    <p className="text-2xl font-bold tabular-nums text-deepOceanNavy md:text-[1.7rem]">
                      {summary.averageRating.toFixed(1)}
                    </p>
                    <span className="text-[1.7rem] leading-none text-waterlineBlue" aria-hidden="true">
                      ★
                    </span>
                  </div>
                  <p className="mt-1.5 text-center text-[0.72rem] font-semibold text-deepOceanNavy md:text-xs">
                    <span className="text-waterlineBlue">고용 24</span>
                    <span className="mx-1 text-mistSkyBlue">·</span>
                    <span>{summary.reviewCount}건 기준</span>
                  </p>
                </div>

                <blockquote className="relative min-w-0 flex-1 overflow-hidden rounded-xl border border-mistSkyBlue/35 bg-white/55 px-4 py-4 pl-5 shadow-[0_1px_0_rgba(187,211,224,0.35)] md:px-5 md:py-5">
                  <span
                    className="absolute bottom-3 left-0 top-3 w-[3px] rounded-full bg-gradient-to-b from-waterlineBlue via-softAquaBlue to-mistSkyBlue/40"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-relaxed text-deepOceanNavy/90 md:text-[0.95rem]">
                    {summary.summary}
                  </p>
                </blockquote>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <TagList label="장점" items={summary.strengths} tone="strength" />
                <TagList label="단점" items={summary.weaknesses} tone="weakness" />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <TagList label="추천 대상" items={summary.recommendedFor} tone="recommend" />
                <TagList label="키워드" items={summary.keywords} tone="keyword" />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

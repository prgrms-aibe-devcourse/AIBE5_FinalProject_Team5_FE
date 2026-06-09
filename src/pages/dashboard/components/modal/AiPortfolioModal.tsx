import { useEffect, useState } from 'react'
import DashboardActionButton from '../DashboardActionButton'

type Step = 1 | 2 | 3 | 4
type Method = 'upload' | 'manual' | null

type CareerEntry = { company: string; period: string; location: string; description: string }
type AwardEntry = { startDate: string; endDate: string }
type CertEntry = { name: string; date: string; score: string }

type Props = { onClose: () => void }

function ProgressBar({ current }: { current: number }) {
  return (
    <div className="flex gap-1.5 px-6 pt-5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
            i <= current ? 'bg-deepOceanNavy' : 'bg-mistSkyBlue/40'
          }`}
        />
      ))}
    </div>
  )
}

function Step1({ onSelect }: { onSelect: (m: Method) => void }) {
  return (
    <div className="space-y-3 py-2">
      <button
        onClick={() => onSelect('upload')}
        className="flex w-full items-center justify-between rounded-xl border border-mistSkyBlue/45 px-5 py-4 text-left transition-colors hover:border-waterlineBlue hover:bg-foamWhite/60"
      >
        <div>
          <p className="font-pretendard text-sm font-semibold text-deepOceanNavy">기존 이력서/자기소개서 기재오기</p>
          <p className="mt-0.5 font-pretendard text-xs text-secondary">파일을 올려주세요 (.pdf, .docx, .hwp 등)</p>
        </div>
        <span className="shrink-0 rounded-md border border-mistSkyBlue/45 px-4 py-1.5 font-pretendard text-xs font-medium text-secondary hover:bg-foamWhite">
          업로드
        </span>
      </button>

      <button
        onClick={() => onSelect('manual')}
        className="flex w-full items-center justify-between rounded-xl border border-mistSkyBlue/45 px-5 py-4 text-left transition-colors hover:border-waterlineBlue hover:bg-foamWhite/60"
      >
        <div>
          <p className="font-pretendard text-sm font-semibold text-deepOceanNavy">직접 작성하기</p>
          <p className="mt-0.5 font-pretendard text-xs text-secondary">사용자가 직접 이력 사항을 작성하여 이용합니다.</p>
        </div>
        <span className="shrink-0 rounded-md border border-mistSkyBlue/45 px-4 py-1.5 font-pretendard text-xs font-medium text-secondary hover:bg-foamWhite">
          선택
        </span>
      </button>
    </div>
  )
}

function Step2({
  careers,
  intro,
  onCareersChange,
  onIntroChange,
}: {
  careers: CareerEntry[]
  intro: string
  onCareersChange: (v: CareerEntry[]) => void
  onIntroChange: (v: string) => void
}) {
  function updateCareer(index: number, field: keyof CareerEntry, value: string) {
    const next = careers.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    onCareersChange(next)
  }

  function addCareer() {
    onCareersChange([...careers, { company: '', period: '', location: '', description: '' }])
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-pretendard text-sm font-semibold text-deepOceanNavy">이력 사항</p>
        <p className="mt-0.5 font-pretendard text-xs text-secondary">본인이 일했던 경력을 알려주세요</p>
        <div className="mt-3 space-y-3">
          {careers.map((c, i) => (
            <div key={i} className="space-y-2">
              <div className="flex gap-2">
                <input
                  value={c.company}
                  onChange={(e) => updateCareer(i, 'company', e.target.value)}
                  placeholder="포사련"
                  className="flex-1 rounded-lg border border-mistSkyBlue/60 px-3 py-2 font-pretendard text-xs text-deepOceanNavy placeholder:text-secondary/60 focus:border-waterlineBlue focus:outline-none focus:ring-2 focus:ring-waterlineBlue/20"
                />
                <input
                  value={c.period}
                  onChange={(e) => updateCareer(i, 'period', e.target.value)}
                  placeholder="기간"
                  className="flex-1 rounded-lg border border-mistSkyBlue/60 px-3 py-2 font-pretendard text-xs text-deepOceanNavy placeholder:text-secondary/60 focus:border-waterlineBlue focus:outline-none focus:ring-2 focus:ring-waterlineBlue/20"
                />
                <input
                  value={c.location}
                  onChange={(e) => updateCareer(i, 'location', e.target.value)}
                  placeholder="지역"
                  className="flex-1 rounded-lg border border-mistSkyBlue/60 px-3 py-2 font-pretendard text-xs text-deepOceanNavy placeholder:text-secondary/60 focus:border-waterlineBlue focus:outline-none focus:ring-2 focus:ring-waterlineBlue/20"
                />
              </div>
              <textarea
                value={c.description}
                onChange={(e) => updateCareer(i, 'description', e.target.value)}
                placeholder="업무/내용을 이력에 서술해 주세요..."
                rows={3}
                className="w-full resize-none rounded-lg border border-mistSkyBlue/60 px-3 py-2 font-pretendard text-xs text-deepOceanNavy placeholder:text-secondary/60 focus:border-waterlineBlue focus:outline-none focus:ring-2 focus:ring-waterlineBlue/20"
              />
            </div>
          ))}
        </div>
        <button
          onClick={addCareer}
          className="mt-2 flex w-full items-center justify-center rounded-lg border border-dashed border-mistSkyBlue/60 py-2 text-secondary hover:border-waterlineBlue hover:text-deepOceanNavy"
        >
          <span className="text-lg leading-none">+</span>
        </button>
      </div>

      <div>
        <p className="font-pretendard text-sm font-semibold text-deepOceanNavy">자기소개</p>
        <textarea
          value={intro}
          onChange={(e) => onIntroChange(e.target.value)}
          placeholder="자신을 어필할만한 한 문장을 서술해 주세요."
          rows={4}
          className="mt-2 w-full resize-none rounded-lg border border-mistSkyBlue/60 px-3 py-2 font-pretendard text-xs text-deepOceanNavy placeholder:text-secondary/60 focus:border-waterlineBlue focus:outline-none focus:ring-2 focus:ring-waterlineBlue/20"
        />
      </div>
    </div>
  )
}

function Step3({
  awards,
  certs,
  onAwardsChange,
  onCertsChange,
}: {
  awards: AwardEntry[]
  certs: CertEntry[]
  onAwardsChange: (v: AwardEntry[]) => void
  onCertsChange: (v: CertEntry[]) => void
}) {
  function updateAward(index: number, field: keyof AwardEntry, value: string) {
    onAwardsChange(awards.map((a, i) => (i === index ? { ...a, [field]: value } : a)))
  }

  function updateCert(index: number, field: keyof CertEntry, value: string) {
    onCertsChange(certs.map((c, i) => (i === index ? { ...c, [field]: value } : c)))
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-pretendard text-sm font-semibold text-deepOceanNavy">수상 경력</p>
        <p className="mt-0.5 font-pretendard text-xs text-secondary">문서 분석이 없다면 사용해 주세요</p>
        <div className="mt-3 space-y-2">
          {awards.map((a, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={a.startDate}
                onChange={(e) => updateAward(i, 'startDate', e.target.value)}
                placeholder="수상 날짜"
                className="flex-1 rounded-lg border border-mistSkyBlue/60 px-3 py-2 font-pretendard text-xs text-deepOceanNavy placeholder:text-secondary/60 focus:border-waterlineBlue focus:outline-none focus:ring-2 focus:ring-waterlineBlue/20"
              />
              <input
                value={a.endDate}
                onChange={(e) => updateAward(i, 'endDate', e.target.value)}
                placeholder="수상 날짜"
                className="flex-1 rounded-lg border border-mistSkyBlue/60 px-3 py-2 font-pretendard text-xs text-deepOceanNavy placeholder:text-secondary/60 focus:border-waterlineBlue focus:outline-none focus:ring-2 focus:ring-waterlineBlue/20"
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => onAwardsChange([...awards, { startDate: '', endDate: '' }])}
          className="mt-2 flex w-full items-center justify-center rounded-lg border border-dashed border-mistSkyBlue/60 py-2 text-secondary hover:border-waterlineBlue hover:text-deepOceanNavy"
        >
          <span className="text-lg leading-none">+</span>
        </button>
      </div>

      <div>
        <p className="font-pretendard text-sm font-semibold text-deepOceanNavy">자격증 목록</p>
        <p className="mt-0.5 font-pretendard text-xs text-secondary">취득한 자격증을 기입해주세요</p>
        <div className="mt-3 space-y-2">
          {certs.map((c, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={c.name}
                onChange={(e) => updateCert(i, 'name', e.target.value)}
                placeholder="자격증 이름"
                className="flex-1 rounded-lg border border-mistSkyBlue/60 px-3 py-2 font-pretendard text-xs text-deepOceanNavy placeholder:text-secondary/60 focus:border-waterlineBlue focus:outline-none focus:ring-2 focus:ring-waterlineBlue/20"
              />
              <input
                value={c.date}
                onChange={(e) => updateCert(i, 'date', e.target.value)}
                placeholder="취득 년월"
                className="w-24 rounded-lg border border-mistSkyBlue/60 px-3 py-2 font-pretendard text-xs text-deepOceanNavy placeholder:text-secondary/60 focus:border-waterlineBlue focus:outline-none focus:ring-2 focus:ring-waterlineBlue/20"
              />
              <input
                value={c.score}
                onChange={(e) => updateCert(i, 'score', e.target.value)}
                placeholder="점수"
                className="w-16 rounded-lg border border-mistSkyBlue/60 px-3 py-2 font-pretendard text-xs text-deepOceanNavy placeholder:text-secondary/60 focus:border-waterlineBlue focus:outline-none focus:ring-2 focus:ring-waterlineBlue/20"
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => onCertsChange([...certs, { name: '', date: '', score: '' }])}
          className="mt-2 flex w-full items-center justify-center rounded-lg border border-dashed border-mistSkyBlue/60 py-2 text-secondary hover:border-waterlineBlue hover:text-deepOceanNavy"
        >
          <span className="text-lg leading-none">+</span>
        </button>
      </div>
    </div>
  )
}

function Step4() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <p className="mb-8 font-pretendard text-sm text-secondary">문서를 생성합니다.</p>
      <div className="h-20 w-20 animate-spin rounded-full border-4 border-mistSkyBlue/40 border-t-deepOceanNavy" />
    </div>
  )
}

export default function AiPortfolioModal({ onClose }: Props) {
  const [step, setStep] = useState<Step>(1)
  const [careers, setCareers] = useState<CareerEntry[]>([
    { company: '', period: '', location: '', description: '' },
  ])
  const [intro, setIntro] = useState('')
  const [awards, setAwards] = useState<AwardEntry[]>([{ startDate: '', endDate: '' }])
  const [certs, setCerts] = useState<CertEntry[]>([{ name: '', date: '', score: '' }])

  const progressStep = step - 1

  function handleNext() {
    if (step < 4) setStep((s) => (s + 1) as Step)
    else onClose()
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-deepOceanNavy/45 px-4 py-6"
      role="presentation"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-mistSkyBlue/50 glass-modal shadow-[0_18px_50px_rgba(36,57,84,0.28)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-portfolio-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 border-b border-mistSkyBlue/45 bg-gradient-to-r from-mistSkyBlue/55 via-softAquaBlue/40 to-waterlineBlue/20 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <h2 id="ai-portfolio-modal-title" className="font-pretendard text-xl font-bold text-deepOceanNavy">
              포트폴리오 생성
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-secondary transition-colors hover:bg-white/80 hover:text-deepOceanNavy"
              aria-label="닫기"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {step >= 2 ? <ProgressBar current={progressStep} /> : null}

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {step === 1 && <Step1 onSelect={() => setStep(2)} />}
          {step === 2 && (
            <Step2 careers={careers} intro={intro} onCareersChange={setCareers} onIntroChange={setIntro} />
          )}
          {step === 3 && (
            <Step3 awards={awards} certs={certs} onAwardsChange={setAwards} onCertsChange={setCerts} />
          )}
          {step === 4 && <Step4 />}
        </div>

        {step > 1 ? (
          <div className="shrink-0 flex justify-end border-t border-mistSkyBlue/45 bg-transparent px-6 py-4">
            <DashboardActionButton label="다음" onClick={handleNext} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

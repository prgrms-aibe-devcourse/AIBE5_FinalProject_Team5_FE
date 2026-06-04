import { useState } from 'react'

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
            i <= current ? 'bg-[#151b24]' : 'bg-[#e2e8f0]'
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
        className="flex w-full items-center justify-between rounded-xl border border-[#e2e8f0] px-5 py-4 text-left transition-colors hover:border-[#151b24] hover:bg-[#f8fafc]"
      >
        <div>
          <p className="text-sm font-semibold text-[#151b24]">기존 이력서/자기소개서 기재오기</p>
          <p className="mt-0.5 text-xs text-[#94a3b8]">파일을 올려주세요 (.pdf, .docx, .hwp 등)</p>
        </div>
        <span className="shrink-0 rounded-md border border-[#e2e8f0] px-4 py-1.5 text-xs font-medium text-[#536173] hover:bg-[#e2e8f0]">
          업로드
        </span>
      </button>

      <button
        onClick={() => onSelect('manual')}
        className="flex w-full items-center justify-between rounded-xl border border-[#e2e8f0] px-5 py-4 text-left transition-colors hover:border-[#151b24] hover:bg-[#f8fafc]"
      >
        <div>
          <p className="text-sm font-semibold text-[#151b24]">직접 작성하기</p>
          <p className="mt-0.5 text-xs text-[#94a3b8]">사용자가 직접 이력 사항을 작성하여 이용합니다.</p>
        </div>
        <span className="shrink-0 rounded-md border border-[#e2e8f0] px-4 py-1.5 text-xs font-medium text-[#536173] hover:bg-[#e2e8f0]">
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
        <p className="text-sm font-semibold text-[#151b24]">이력 사항</p>
        <p className="mt-0.5 text-xs text-[#94a3b8]">본인이 일했던 경력을 알려주세요</p>
        <div className="mt-3 space-y-3">
          {careers.map((c, i) => (
            <div key={i} className="space-y-2">
              <div className="flex gap-2">
                <input
                  value={c.company}
                  onChange={(e) => updateCareer(i, 'company', e.target.value)}
                  placeholder="포사련"
                  className="flex-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-xs placeholder-[#cbd5e1] focus:border-[#151b24] focus:outline-none"
                />
                <input
                  value={c.period}
                  onChange={(e) => updateCareer(i, 'period', e.target.value)}
                  placeholder="기간"
                  className="flex-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-xs placeholder-[#cbd5e1] focus:border-[#151b24] focus:outline-none"
                />
                <input
                  value={c.location}
                  onChange={(e) => updateCareer(i, 'location', e.target.value)}
                  placeholder="지역"
                  className="flex-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-xs placeholder-[#cbd5e1] focus:border-[#151b24] focus:outline-none"
                />
              </div>
              <textarea
                value={c.description}
                onChange={(e) => updateCareer(i, 'description', e.target.value)}
                placeholder="업무/내용을 이력에 서술해 주세요..."
                rows={3}
                className="w-full resize-none rounded-lg border border-[#e2e8f0] px-3 py-2 text-xs placeholder-[#cbd5e1] focus:border-[#151b24] focus:outline-none"
              />
            </div>
          ))}
        </div>
        <button
          onClick={addCareer}
          className="mt-2 flex w-full items-center justify-center rounded-lg border border-dashed border-[#cbd5e1] py-2 text-[#94a3b8] hover:border-[#151b24] hover:text-[#151b24]"
        >
          <span className="text-lg leading-none">+</span>
        </button>
      </div>

      <div>
        <p className="text-sm font-semibold text-[#151b24]">자기소개</p>
        <textarea
          value={intro}
          onChange={(e) => onIntroChange(e.target.value)}
          placeholder="자신을 어필할만한 한 문장을 서술해 주세요."
          rows={4}
          className="mt-2 w-full resize-none rounded-lg border border-[#e2e8f0] px-3 py-2 text-xs placeholder-[#cbd5e1] focus:border-[#151b24] focus:outline-none"
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
        <p className="text-sm font-semibold text-[#151b24]">수상 경력</p>
        <p className="mt-0.5 text-xs text-[#94a3b8]">문서 분석이 없다면 사용해 주세요</p>
        <div className="mt-3 space-y-2">
          {awards.map((a, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={a.startDate}
                onChange={(e) => updateAward(i, 'startDate', e.target.value)}
                placeholder="수상 날짜"
                className="flex-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-xs placeholder-[#cbd5e1] focus:border-[#151b24] focus:outline-none"
              />
              <input
                value={a.endDate}
                onChange={(e) => updateAward(i, 'endDate', e.target.value)}
                placeholder="수상 날짜"
                className="flex-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-xs placeholder-[#cbd5e1] focus:border-[#151b24] focus:outline-none"
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => onAwardsChange([...awards, { startDate: '', endDate: '' }])}
          className="mt-2 flex w-full items-center justify-center rounded-lg border border-dashed border-[#cbd5e1] py-2 text-[#94a3b8] hover:border-[#151b24] hover:text-[#151b24]"
        >
          <span className="text-lg leading-none">+</span>
        </button>
      </div>

      <div>
        <p className="text-sm font-semibold text-[#151b24]">자격증 목록</p>
        <p className="mt-0.5 text-xs text-[#94a3b8]">취득한 자격증을 기입해주세요</p>
        <div className="mt-3 space-y-2">
          {certs.map((c, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={c.name}
                onChange={(e) => updateCert(i, 'name', e.target.value)}
                placeholder="자격증 이름"
                className="flex-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-xs placeholder-[#cbd5e1] focus:border-[#151b24] focus:outline-none"
              />
              <input
                value={c.date}
                onChange={(e) => updateCert(i, 'date', e.target.value)}
                placeholder="취득 년월"
                className="w-24 rounded-lg border border-[#e2e8f0] px-3 py-2 text-xs placeholder-[#cbd5e1] focus:border-[#151b24] focus:outline-none"
              />
              <input
                value={c.score}
                onChange={(e) => updateCert(i, 'score', e.target.value)}
                placeholder="점수"
                className="w-16 rounded-lg border border-[#e2e8f0] px-3 py-2 text-xs placeholder-[#cbd5e1] focus:border-[#151b24] focus:outline-none"
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => onCertsChange([...certs, { name: '', date: '', score: '' }])}
          className="mt-2 flex w-full items-center justify-center rounded-lg border border-dashed border-[#cbd5e1] py-2 text-[#94a3b8] hover:border-[#151b24] hover:text-[#151b24]"
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
      <p className="mb-8 text-sm text-[#64748b]">문서를 생성합니다.</p>
      <div className="h-20 w-20 animate-spin rounded-full border-4 border-[#e2e8f0] border-t-[#151b24]" />
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-[520px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eef2f6] bg-white px-6 py-4">
          <h2 className="text-sm font-bold text-[#151b24]">포트폴리오 생성</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#151b24]"
          >
            ✕
          </button>
        </div>

        {step >= 2 && <ProgressBar current={progressStep} />}

        {/* Body */}
        <div className="px-6 py-5">
          {step === 1 && <Step1 onSelect={() => setStep(2)} />}
          {step === 2 && (
            <Step2
              careers={careers}
              intro={intro}
              onCareersChange={setCareers}
              onIntroChange={setIntro}
            />
          )}
          {step === 3 && (
            <Step3
              awards={awards}
              certs={certs}
              onAwardsChange={setAwards}
              onCertsChange={setCerts}
            />
          )}
          {step === 4 && <Step4 />}
        </div>

        {/* Footer */}
        {step > 1 && (
          <div className="sticky bottom-0 flex justify-end border-t border-[#eef2f6] bg-white px-6 py-4">
            <button
              onClick={handleNext}
              className="rounded-md bg-[#151b24] px-5 py-2 text-sm font-medium text-white hover:bg-[#2d3748]"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

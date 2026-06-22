// AI 포트폴리오 초안 생성 모달: 사용자 입력을 수집하고 백엔드 결과를 복사 가능한 텍스트로 보여준다.
import { Copy, LoaderCircle, Plus, Sparkles, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  createPortfolioDraft,
  PORTFOLIO_DRAFT_TONE_LABELS,
  type PortfolioDraftCreateRequest,
  type PortfolioDraftResponse,
  type PortfolioDraftTone,
} from '../../../../services/aiPortfolio'

type Props = { onClose: () => void }

type ProjectForm = {
  name: string
  role: string
  description: string
  techStack: string
  achievement: string
  link: string
}

const toneOptions = Object.entries(PORTFOLIO_DRAFT_TONE_LABELS) as [
  PortfolioDraftTone,
  string,
][]

const inputClassName =
  'w-full rounded-lg border border-mistSkyBlue/60 bg-white/80 px-3 py-2.5 font-pretendard text-sm text-deepOceanNavy placeholder:text-secondary/55 focus:border-waterlineBlue focus:outline-none focus:ring-2 focus:ring-waterlineBlue/20 disabled:cursor-not-allowed disabled:opacity-60'

const textareaClassName =
  'w-full resize-y rounded-lg border border-mistSkyBlue/60 bg-white/80 px-3 py-2.5 font-pretendard text-sm leading-relaxed text-deepOceanNavy placeholder:text-secondary/55 focus:border-waterlineBlue focus:outline-none focus:ring-2 focus:ring-waterlineBlue/20 disabled:cursor-not-allowed disabled:opacity-60'

const labelClassName = 'font-pretendard text-sm font-semibold text-deepOceanNavy'

function hasTooLongItem(items: string[], maxLength: number): boolean {
  return items.some((item) => item.length > maxLength)
}

function createEmptyProject(): ProjectForm {
  return {
    name: '',
    role: '',
    description: '',
    techStack: '',
    achievement: '',
    link: '',
  }
}

function splitTextList(value: string): string[] {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function nullableText(value: string): string | undefined {
  const trimmed = value.trim()
  return trimmed || undefined
}

function isProjectStarted(project: ProjectForm): boolean {
  return Object.values(project).some((value) => value.trim())
}

function formatPortfolioDraftText(draft: PortfolioDraftResponse): string {
  const lines: string[] = []

  if (draft.introduction?.trim()) {
    lines.push('[자기소개]', draft.introduction.trim(), '')
  }

  if (draft.coreCompetencies.length > 0) {
    lines.push('[핵심 역량]')
    draft.coreCompetencies.forEach((competency) => lines.push(`- ${competency}`))
    lines.push('')
  }

  if (draft.projectDescriptions.length > 0) {
    lines.push('[프로젝트 경험]')
    draft.projectDescriptions.forEach((project, index) => {
      lines.push(`${index + 1}. ${project.name}`)
      if (project.summary) lines.push(`요약: ${project.summary}`)
      if (project.role) lines.push(`역할: ${project.role}`)
      if (project.techStack.length > 0) lines.push(`기술 스택: ${project.techStack.join(', ')}`)
      if (project.highlights.length > 0) {
        lines.push('주요 성과:')
        project.highlights.forEach((highlight) => lines.push(`- ${highlight}`))
      }
      lines.push('')
    })
  }

  if (draft.techStackSummary?.trim()) {
    lines.push('[기술 스택 요약]', draft.techStackSummary.trim(), '')
  }

  if (draft.improvementSuggestions.length > 0) {
    lines.push('[보완 제안]')
    draft.improvementSuggestions.forEach((suggestion) => lines.push(`- ${suggestion}`))
  }

  return lines.join('\n').trim()
}

function validatePortfolioForm(targetJob: string, skills: string, projects: ProjectForm[]): string | null {
  if (!targetJob.trim()) return '목표 직무를 입력해 주세요.'

  const skillList = splitTextList(skills)
  if (skillList.length === 0) return '기술 스택을 1개 이상 입력해 주세요.'
  if (skillList.length > 20) return '기술 스택은 최대 20개까지 입력할 수 있습니다.'
  if (hasTooLongItem(skillList, 50)) return '기술 스택은 항목당 50자 이하로 입력해 주세요.'

  const activeProjects = projects.filter(isProjectStarted)
  if (activeProjects.length === 0) return '프로젝트 경험을 1개 이상 입력해 주세요.'

  const incompleteProjectIndex = activeProjects.findIndex(
    (project) => !project.name.trim() || !project.role.trim() || !project.description.trim(),
  )
  if (incompleteProjectIndex >= 0) {
    return `프로젝트 ${incompleteProjectIndex + 1}의 이름, 역할, 설명을 모두 입력해 주세요.`
  }

  const tooManyProjectSkillsIndex = activeProjects.findIndex((project) => splitTextList(project.techStack).length > 20)
  if (tooManyProjectSkillsIndex >= 0) {
    return `프로젝트 ${tooManyProjectSkillsIndex + 1}의 기술 스택은 최대 20개까지 입력할 수 있습니다.`
  }

  const tooLongProjectSkillIndex = activeProjects.findIndex((project) =>
    hasTooLongItem(splitTextList(project.techStack), 50),
  )
  if (tooLongProjectSkillIndex >= 0) {
    return `프로젝트 ${tooLongProjectSkillIndex + 1}의 기술 스택은 항목당 50자 이하로 입력해 주세요.`
  }

  return null
}

function buildRequestPayload(
  targetJob: string,
  skills: string,
  projects: ProjectForm[],
  education: string,
  careerSummary: string,
  tone: PortfolioDraftTone,
): PortfolioDraftCreateRequest {
  return {
    targetJob: targetJob.trim(),
    skills: splitTextList(skills),
    projects: projects.filter(isProjectStarted).map((project) => ({
      name: project.name.trim(),
      role: project.role.trim(),
      description: project.description.trim(),
      techStack: splitTextList(project.techStack),
      achievement: nullableText(project.achievement),
      link: nullableText(project.link),
    })),
    education: nullableText(education),
    careerSummary: nullableText(careerSummary),
    tone,
  }
}

export default function AiPortfolioModal({ onClose }: Props) {
  const [targetJob, setTargetJob] = useState('')
  const [skills, setSkills] = useState('')
  const [projects, setProjects] = useState<ProjectForm[]>([createEmptyProject()])
  const [education, setEducation] = useState('')
  const [careerSummary, setCareerSummary] = useState('')
  const [tone, setTone] = useState<PortfolioDraftTone>('PROFESSIONAL')
  const [draft, setDraft] = useState<PortfolioDraftResponse | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  const draftText = useMemo(() => (draft ? formatPortfolioDraftText(draft) : ''), [draft])

  function updateProject(index: number, field: keyof ProjectForm, value: string) {
    setProjects((current) =>
      current.map((project, projectIndex) =>
        projectIndex === index ? { ...project, [field]: value } : project,
      ),
    )
  }

  function addProject() {
    setProjects((current) => (current.length >= 10 ? current : [...current, createEmptyProject()]))
  }

  function removeProject(index: number) {
    setProjects((current) => {
      if (current.length === 1) return [createEmptyProject()]
      return current.filter((_, projectIndex) => projectIndex !== index)
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCopied(false)
    setErrorMessage(null)

    const validationMessage = validatePortfolioForm(targetJob, skills, projects)
    if (validationMessage) {
      setErrorMessage(validationMessage)
      return
    }

    setIsSubmitting(true)

    try {
      const payload = buildRequestPayload(targetJob, skills, projects, education, careerSummary, tone)
      const response = await createPortfolioDraft(payload)
      setDraft(response)
    } catch (error) {
      setDraft(null)
      setErrorMessage(error instanceof Error ? error.message : '포트폴리오 초안 생성 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleCopy() {
    if (!draftText) return

    try {
      await navigator.clipboard.writeText(draftText)
      setCopied(true)
      setErrorMessage(null)
    } catch {
      setCopied(false)
      setErrorMessage('결과 복사에 실패했습니다. 텍스트를 직접 선택해 복사해 주세요.')
    }
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
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-mistSkyBlue/50 glass-modal shadow-[0_18px_50px_rgba(36,57,84,0.28)]"
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
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-white/80 hover:text-deepOceanNavy"
              aria-label="닫기"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <form id="ai-portfolio-form" onSubmit={handleSubmit} className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.82fr)]">
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClassName}>목표 직무 *</span>
                  <input
                    value={targetJob}
                    onChange={(event) => setTargetJob(event.target.value)}
                    placeholder="예: 프론트엔드 개발자"
                    maxLength={100}
                    disabled={isSubmitting}
                    className={`${inputClassName} mt-2`}
                  />
                </label>

                <label className="block">
                  <span className={labelClassName}>희망 문체</span>
                  <select
                    value={tone}
                    onChange={(event) => setTone(event.target.value as PortfolioDraftTone)}
                    disabled={isSubmitting}
                    className={`${inputClassName} mt-2`}
                  >
                    {toneOptions.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className={labelClassName}>기술 스택 *</span>
                <textarea
                  value={skills}
                  onChange={(event) => setSkills(event.target.value)}
                  placeholder="React, TypeScript, Spring Boot"
                  rows={3}
                  disabled={isSubmitting}
                  className={`${textareaClassName} mt-2 min-h-24`}
                />
              </label>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-pretendard text-base font-bold text-deepOceanNavy">프로젝트 경험 *</h3>
                  <button
                    type="button"
                    onClick={addProject}
                    disabled={isSubmitting || projects.length >= 10}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-mistSkyBlue/60 bg-white px-3 py-2 font-pretendard text-xs font-semibold text-secondary transition-colors hover:border-waterlineBlue hover:bg-foamWhite hover:text-deepOceanNavy disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    추가
                  </button>
                </div>

                {projects.map((project, index) => (
                  <div
                    key={index}
                    className="space-y-3 rounded-lg border border-mistSkyBlue/45 bg-white/50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-pretendard text-sm font-semibold text-deepOceanNavy">
                        프로젝트 {index + 1}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeProject(index)}
                        disabled={isSubmitting}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`프로젝트 ${index + 1} 삭제`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <span className="sr-only">프로젝트 이름</span>
                        <input
                          value={project.name}
                          onChange={(event) => updateProject(index, 'name', event.target.value)}
                          placeholder="프로젝트 이름"
                          maxLength={100}
                          disabled={isSubmitting}
                          className={inputClassName}
                        />
                      </label>
                      <label className="block">
                        <span className="sr-only">담당 역할</span>
                        <input
                          value={project.role}
                          onChange={(event) => updateProject(index, 'role', event.target.value)}
                          placeholder="담당 역할"
                          maxLength={100}
                          disabled={isSubmitting}
                          className={inputClassName}
                        />
                      </label>
                    </div>

                    <label className="block">
                      <span className="sr-only">프로젝트 설명</span>
                      <textarea
                        value={project.description}
                        onChange={(event) => updateProject(index, 'description', event.target.value)}
                        placeholder="프로젝트 목표, 맡은 업무, 구현 내용을 입력해 주세요."
                        rows={3}
                        maxLength={1000}
                        disabled={isSubmitting}
                        className={textareaClassName}
                      />
                    </label>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <span className="sr-only">프로젝트 기술 스택</span>
                        <input
                          value={project.techStack}
                          onChange={(event) => updateProject(index, 'techStack', event.target.value)}
                          placeholder="프로젝트 기술 스택"
                          disabled={isSubmitting}
                          className={inputClassName}
                        />
                      </label>
                      <label className="block">
                        <span className="sr-only">프로젝트 링크</span>
                        <input
                          value={project.link}
                          onChange={(event) => updateProject(index, 'link', event.target.value)}
                          placeholder="프로젝트 링크"
                          maxLength={500}
                          disabled={isSubmitting}
                          className={inputClassName}
                        />
                      </label>
                    </div>

                    <label className="block">
                      <span className="sr-only">성과 또는 배운 점</span>
                      <textarea
                        value={project.achievement}
                        onChange={(event) => updateProject(index, 'achievement', event.target.value)}
                        placeholder="성과 또는 배운 점"
                        rows={2}
                        maxLength={1000}
                        disabled={isSubmitting}
                        className={textareaClassName}
                      />
                    </label>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClassName}>교육 수료 정보</span>
                  <textarea
                    value={education}
                    onChange={(event) => setEducation(event.target.value)}
                    placeholder="수료 과정, 기간, 주요 학습 내용"
                    rows={4}
                    maxLength={500}
                    disabled={isSubmitting}
                    className={`${textareaClassName} mt-2`}
                  />
                </label>

                <label className="block">
                  <span className={labelClassName}>경력 요약</span>
                  <textarea
                    value={careerSummary}
                    onChange={(event) => setCareerSummary(event.target.value)}
                    placeholder="경력, 협업 경험, 강점"
                    rows={4}
                    maxLength={1000}
                    disabled={isSubmitting}
                    className={`${textareaClassName} mt-2`}
                  />
                </label>
              </div>
            </div>

            <aside className="flex min-h-80 flex-col rounded-lg border border-mistSkyBlue/45 bg-white/55 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-pretendard text-base font-bold text-deepOceanNavy">생성 결과</h3>
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!draftText || isSubmitting}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-mistSkyBlue/60 bg-white px-3 py-2 font-pretendard text-xs font-semibold text-secondary transition-colors hover:border-waterlineBlue hover:bg-foamWhite hover:text-deepOceanNavy disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  복사
                </button>
              </div>

              {draftText ? (
                <textarea
                  readOnly
                  value={draftText}
                  rows={18}
                  className="min-h-0 flex-1 resize-none rounded-lg border border-mistSkyBlue/50 bg-white/90 px-3 py-3 font-pretendard text-sm leading-6 text-deepOceanNavy focus:outline-none focus:ring-2 focus:ring-waterlineBlue/20"
                />
              ) : (
                <div className="flex min-h-72 flex-1 items-center justify-center rounded-lg border border-dashed border-mistSkyBlue/60 bg-foamWhite/35 px-4 text-center">
                  <p className="font-pretendard text-sm leading-relaxed text-secondary">
                    초안 생성 후 복사 가능한 텍스트가 표시됩니다.
                  </p>
                </div>
              )}

              {copied ? (
                <p className="mt-3 font-pretendard text-xs font-semibold text-waterlineBlue">
                  결과를 클립보드에 복사했습니다.
                </p>
              ) : null}
            </aside>
          </div>
        </form>

        <div className="shrink-0 border-t border-mistSkyBlue/45 bg-transparent px-6 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="min-h-5 font-pretendard text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
            <button
              type="submit"
              form="ai-portfolio-form"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-deepOceanNavy bg-deepOceanNavy px-5 py-2.5 font-pretendard text-sm font-semibold text-white shadow-[0_8px_24px_rgba(30,58,95,0.35),0_2px_6px_rgba(30,58,95,0.18)] transition-all hover:-translate-y-px hover:border-waterlineBlue hover:bg-waterlineBlue hover:shadow-[0_12px_32px_rgba(84,132,183,0.40),0_4px_10px_rgba(84,132,183,0.22)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isSubmitting ? (
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              )}
              {isSubmitting ? '생성 중' : '초안 생성'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

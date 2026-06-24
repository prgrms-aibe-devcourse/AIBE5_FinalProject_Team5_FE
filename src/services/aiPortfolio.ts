// AI 포트폴리오 초안 생성 API 계약과 호출 함수를 모아둔 서비스 파일이다.
import { http } from './http'
import type { PageResponse } from './apiTypes'

export type PortfolioDraftTone = 'PROFESSIONAL' | 'FRIENDLY' | 'CONCISE'

export const PORTFOLIO_DRAFT_TONE_LABELS: Record<PortfolioDraftTone, string> = {
  PROFESSIONAL: '전문적이고 간결하게',
  FRIENDLY: '친근하지만 실무적으로',
  CONCISE: '짧고 핵심 중심으로',
}

export interface PortfolioProjectExperienceRequest {
  name: string
  role: string
  description: string
  techStack?: string[]
  achievement?: string
  link?: string
}

export interface PortfolioDraftCreateRequest {
  targetJob: string
  skills: string[]
  projects: PortfolioProjectExperienceRequest[]
  education?: string
  careerSummary?: string
  tone?: PortfolioDraftTone
}

export interface PortfolioDraftProject {
  name: string
  summary: string
  role: string
  techStack: string[]
  highlights: string[]
}

export interface PortfolioDraftResponse {
  executionId: string
  introduction: string
  coreCompetencies: string[]
  projectDescriptions: PortfolioDraftProject[]
  techStackSummary: string
  improvementSuggestions: string[]
}

export async function createPortfolioDraft(
  payload: PortfolioDraftCreateRequest,
): Promise<PortfolioDraftResponse> {
  return http.post<PortfolioDraftResponse>('/api/ai/portfolio-drafts', payload, { auth: true })
}

export interface PortfolioDraftHistorySummary {
  historyId: number
  executionId: string
  targetJob: string
  tone: PortfolioDraftTone
  createdAt: string
}

export interface PortfolioDraftHistoryDetail extends PortfolioDraftResponse {
  historyId: number
  targetJob: string
  skills: string[]
  projects: PortfolioProjectExperienceRequest[]
  education?: string
  careerSummary?: string
  tone: PortfolioDraftTone
  createdAt: string
}

export function formatPortfolioProjectText(project: PortfolioDraftProject): string {
  const lines: string[] = [`프로젝트명: ${project.name}`]

  if (project.summary?.trim()) lines.push(`요약: ${project.summary.trim()}`)
  if (project.role?.trim()) lines.push(`역할: ${project.role.trim()}`)
  if (project.techStack.length > 0) lines.push(`기술 스택: ${project.techStack.join(', ')}`)
  if (project.highlights.length > 0) {
    lines.push('주요 성과:')
    project.highlights.forEach((highlight) => lines.push(`- ${highlight}`))
  }

  return lines.join('\n')
}

export type PortfolioDraftDisplaySection = {
  id: string
  title: string
  description?: string
  copyText: string
  kind: 'text' | 'list' | 'project'
  text?: string
  items?: string[]
  project?: PortfolioDraftProject
}

export function buildPortfolioDraftSections(
  draft: Pick<
    PortfolioDraftResponse,
    | 'introduction'
    | 'coreCompetencies'
    | 'projectDescriptions'
    | 'techStackSummary'
    | 'improvementSuggestions'
  >,
): PortfolioDraftDisplaySection[] {
  const sections: PortfolioDraftDisplaySection[] = []

  if (draft.introduction?.trim()) {
    sections.push({
      id: 'introduction',
      title: '자기소개',
      copyText: draft.introduction.trim(),
      kind: 'text',
      text: draft.introduction.trim(),
    })
  }

  if (draft.coreCompetencies.length > 0) {
    sections.push({
      id: 'coreCompetencies',
      title: '핵심 역량',
      copyText: draft.coreCompetencies.map((item) => `- ${item}`).join('\n'),
      kind: 'list',
      items: draft.coreCompetencies,
    })
  }

  draft.projectDescriptions.forEach((project, index) => {
    sections.push({
      id: `project-${index}`,
      title: `프로젝트${index + 1}`,
      copyText: formatPortfolioProjectText(project),
      kind: 'project',
      project,
    })
  })

  if (draft.techStackSummary?.trim()) {
    sections.push({
      id: 'techStackSummary',
      title: '기술 스택 요약',
      copyText: draft.techStackSummary.trim(),
      kind: 'text',
      text: draft.techStackSummary.trim(),
    })
  }

  if (draft.improvementSuggestions.length > 0) {
    sections.push({
      id: 'improvementSuggestions',
      title: '보완 제안',
      copyText: draft.improvementSuggestions.map((item) => `- ${item}`).join('\n'),
      kind: 'list',
      items: draft.improvementSuggestions,
    })
  }

  return sections
}

export function formatPortfolioDraftText(
  draft: Pick<
    PortfolioDraftResponse,
    | 'introduction'
    | 'coreCompetencies'
    | 'projectDescriptions'
    | 'techStackSummary'
    | 'improvementSuggestions'
  >,
): string {
  return buildPortfolioDraftSections(draft)
    .map((section) => `[${section.title}]\n${section.copyText}`)
    .join('\n\n')
    .trim()
}

export async function getPortfolioDraftHistory(
  page = 0,
  size = 10,
): Promise<PageResponse<PortfolioDraftHistorySummary>> {
  return http.get<PageResponse<PortfolioDraftHistorySummary>>('/api/ai/portfolio-drafts/history', {
    query: { page, size },
    auth: true,
  })
}

export async function getPortfolioDraftHistoryDetail(
  historyId: number,
): Promise<PortfolioDraftHistoryDetail> {
  return http.get<PortfolioDraftHistoryDetail>(`/api/ai/portfolio-drafts/history/${historyId}`, {
    auth: true,
  })
}

export async function deletePortfolioDraftHistory(historyId: number): Promise<void> {
  await http.delete<void>(`/api/ai/portfolio-drafts/history/${historyId}`, { auth: true })
}

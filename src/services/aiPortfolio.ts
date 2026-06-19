// AI 포트폴리오 초안 생성 API 계약과 호출 함수를 모아둔 서비스 파일이다.
import { http } from './http'

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

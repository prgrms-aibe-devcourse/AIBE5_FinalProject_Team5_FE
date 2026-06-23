import { http } from './http'
import type { PageResponse } from './apiTypes'

export type ReportTargetType = 'REVIEW' | 'POST' | 'COMMENT'
export type ReportStatus = 'PENDING' | 'COMPLETED'
export type ReportAction = 'HIDE' | 'INVALID_REASON'

/** POST /api/reports - Request */
export interface ReportCreateRequest {
  targetType: ReportTargetType
  targetId: number
  reason: string
  detail: string
}

/** POST /api/reports - Response */
export interface ReportResponse {
  reportId: number
  targetType: ReportTargetType
  targetId: number
  status: ReportStatus
  createdAt: string
}

export interface AdminReportResponse {
  id: number
  reportId: number
  reporterId: number
  reporterName: string
  reporterNickname: string
  profileImageUrl?: string
  reportedAt: string
  type: ReportTargetType
  targetType: ReportTargetType
  targetId: number
  targetLabel: string
  reasonCategory: string
  reasonDetail: string
  reason: string
  detail: string
  contentBody: string
  contentUrl: string
  status: ReportStatus
  contentAction?: ReportAction
  action?: ReportAction
  processReason?: string
  createdAt: string
  updatedAt: string
}

export const REPORT_REASON_OPTIONS = [
  '부적절한 표현',
  '비속어',
  '스팸',
  '허위정보',
  '개인정보 침해',
  '기타',
] as const

export type ReportReason = (typeof REPORT_REASON_OPTIONS)[number]

/** POST /api/reports */
export async function createReport(body: ReportCreateRequest): Promise<ReportResponse> {
  return http.post<ReportResponse>('/api/reports', body, { auth: true })
}

/** GET /api/admin/reports */
export async function getAdminReports(params: {
  status?: ReportStatus | 'ALL'
  targetType?: ReportTargetType
  page?: number
  size?: number
}): Promise<PageResponse<AdminReportResponse>> {
  const { status, targetType, page = 0, size = 10 } = params
  return http.get<PageResponse<AdminReportResponse>>('/api/admin/reports', {
    query: {
      ...(status && status !== 'ALL' ? { status } : {}),
      ...(targetType ? { targetType } : {}),
      page,
      size,
    },
    auth: true,
  })
}

/** GET /api/admin/reports/{reportId} */
export async function getAdminReport(reportId: number): Promise<AdminReportResponse> {
  return http.get<AdminReportResponse>(`/api/admin/reports/${reportId}`, {
    auth: true,
  })
}

/** PATCH /api/admin/reports/{reportId} */
export async function processReport(
  reportId: number,
  body: {
    status: ReportStatus
    action: ReportAction
    reason?: string
  },
): Promise<AdminReportResponse> {
  return http.patch<AdminReportResponse>(`/api/admin/reports/${reportId}`, body, {
    auth: true,
  })
}

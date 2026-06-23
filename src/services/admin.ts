import { http } from './http'

export interface AdminDashboardSummary {
  userCount: number
  courseCount: number
  pendingVerificationCount: number
  reviewCount: number
  reportCount: number
  lastHrdCollectedAt?: string | null
  lastHrdRefinedAt?: string | null
}

/** 관리자 대시보드 집계 요약 (GET /api/admin/dashboard/summary) */
export async function getAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  return http.get<AdminDashboardSummary>('/api/admin/dashboard/summary', { auth: true })
}

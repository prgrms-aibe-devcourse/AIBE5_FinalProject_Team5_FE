import { http } from './http'
import type { PageResponse } from './apiTypes'

export type InquiryStatus = 'PENDING' | 'COMPLETED'

// 사용자용 문의 응답 DTO
export interface InquiryResponse {
  id: number
  inquiryId: number
  title: string
  requestedAt: string // yyyy-MM-dd
  status: InquiryStatus
  content: string
  adminReply?: string
  answeredAt?: string | null
  createdAt: string
  updatedAt: string
}

// 관리자용 문의 응답 DTO
export interface AdminInquiryResponse {
  id: number
  inquiryId: number
  userId: number
  userName: string
  userNickname: string
  profileImageUrl?: string
  title: string
  requestedAt: string // yyyy-MM-dd
  content: string
  status: InquiryStatus
  adminReply?: string
  answeredById?: number | null
  answeredByNickname?: string | null
  answeredAt?: string | null
  createdAt: string
  updatedAt: string
}

/**
 * 일반 사용자 문의 API
 */
export async function createInquiry(payload: { title: string; content: string }): Promise<InquiryResponse> {
  return http.post<InquiryResponse>('/api/inquiries', payload, {
    auth: true,
  })
}

export async function getMyInquiries(page = 0, size = 10): Promise<PageResponse<InquiryResponse>> {
  return http.get<PageResponse<InquiryResponse>>('/api/inquiries', {
    query: { page, size },
    auth: true,
  })
}

export async function getMyInquiry(inquiryId: number): Promise<InquiryResponse> {
  return http.get<InquiryResponse>(`/api/inquiries/${inquiryId}`, {
    auth: true,
  })
}

/**
 * 관리자용 문의 API
 */
export async function getAdminInquiries(params: {
  status?: InquiryStatus | 'ALL'
  page?: number
  size?: number
}): Promise<PageResponse<AdminInquiryResponse>> {
  const { status, page = 0, size = 10 } = params
  return http.get<PageResponse<AdminInquiryResponse>>('/api/admin/inquiries', {
    query: {
      ...(status && status !== 'ALL' ? { status } : {}),
      page,
      size,
    },
    auth: true,
  })
}

export async function getAdminInquiry(inquiryId: number): Promise<AdminInquiryResponse> {
  return http.get<AdminInquiryResponse>(`/api/admin/inquiries/${inquiryId}`, {
    auth: true,
  })
}

export async function answerInquiry(
  inquiryId: number,
  payload: { adminReply: string },
): Promise<AdminInquiryResponse> {
  return http.patch<AdminInquiryResponse>(`/api/admin/inquiries/${inquiryId}/answer`, payload, {
    auth: true,
  })
}

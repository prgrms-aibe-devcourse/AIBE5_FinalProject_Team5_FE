import { http } from './http'
import type { PageResponse } from './apiTypes'
import type { SpringPage } from './review'

// 공용 사용자용 공지사항 응답 인터페이스
export interface NoticeResponse {
  id: number
  noticeId: number
  title: string
  content: string
  postedAt: string // yyyy.MM.dd
  createdAt: string
  updatedAt: string
}

// 관리자용 공지사항 응답 인터페이스
export interface AdminNoticeResponse {
  id: number
  noticeId: number
  sentBy: string
  senderNickname: string
  title: string
  content: string
  sentAt: string // yyyy-MM-dd
  createdAt: string
}

/**
 * 일반 이용자 공지사항 API 호출 함수 목록
 */
export async function getNotices(page = 0, size = 10): Promise<PageResponse<NoticeResponse>> {
  return http.get<PageResponse<NoticeResponse>>('/api/notices', {
    query: { page, size },
    auth: false,
  })
}

export async function getNoticeDetail(noticeId: number): Promise<NoticeResponse> {
  return http.get<NoticeResponse>(`/api/notices/${noticeId}`, {
    auth: false,
  })
}

/**
 * 관리자용 공지사항 API 호출 함수 목록 (auth: true 필요)
 */
export async function getAdminNotices(page = 0, size = 10): Promise<SpringPage<AdminNoticeResponse>> {
  return http.get<SpringPage<AdminNoticeResponse>>('/api/admin/notices', {
    query: { page, size },
    auth: true,
  })
}

export async function createAdminNotice(payload: { title: string; content: string }): Promise<AdminNoticeResponse> {
  return http.post<AdminNoticeResponse>('/api/admin/notices', payload, {
    auth: true,
  })
}

export async function deleteAdminNotice(noticeId: number): Promise<void> {
  return http.delete<void>(`/api/admin/notices/${noticeId}`, {
    auth: true,
  })
}

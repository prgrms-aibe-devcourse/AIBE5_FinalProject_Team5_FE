export type ReportTargetType = 'REVIEW' | 'POST' | 'COMMENT'

/** POST /api/reports - Request */
export interface ReportCreateRequest {
  targetType: ReportTargetType
  targetId: number
  reason: string
  detail: string
}

/** POST /api/reports - Response 201 */
export interface ReportCreateResponse {
  success: boolean
  data: {
    reportId: number
    targetType: ReportTargetType
    targetId: number
    status: 'PENDING'
    createdAt: string
  }
  error: null
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
export async function createReport(body: ReportCreateRequest): Promise<ReportCreateResponse> {
  // TODO: 실제 API 연동
  // const token = localStorage.getItem('accessToken')
  // const res = await fetch('/api/reports', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${token}`,
  //   },
  //   body: JSON.stringify(body),
  // })
  // if (!res.ok) throw new Error('신고 제출에 실패했습니다.')
  // return (await res.json()) as ReportCreateResponse

  void body
  return {
    success: true,
    data: {
      reportId: 1,
      targetType: body.targetType,
      targetId: body.targetId,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    },
    error: null,
  }
}

import { http } from './http'
import type { PageResponse } from './apiTypes'
import { toDateOnly } from '../utils/formatRequestedDate'
import type {
  CertificationDocument,
  CertificationDocumentType,
  UserCertificationRequest,
  UserCertificationStatus,
} from '../pages/dashboard/data/certifications'

export type VerificationStatus = UserCertificationStatus

export interface VerificationFile {
  fileName: string
  contentType: string
  fileSize: number
}

export interface VerificationListItem {
  verificationId: number
  userId: number
  userNickname: string
  courseId: number
  courseTitle: string
  courseSessionId: number
  courseSessionRound: number
  status: VerificationStatus
  jobTrainingHistoryFile: VerificationFile | null
  onlineCourseApplicationFile: VerificationFile | null
  rejectReason: string | null
  adminMemo: string | null
  processedById: number | null
  processedByNickname: string | null
  processedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface MyVerificationListParams {
  status?: VerificationStatus
  page?: number
  size?: number
}

function toCertificationDocument(
  verificationId: number,
  type: CertificationDocumentType,
  file: VerificationFile | null,
  createdAt: string,
  index: number,
): CertificationDocument | null {
  if (!file) return null

  return {
    id: verificationId * 10 + index,
    name: file.fileName,
    type,
    uploadedAt: toDateOnly(createdAt),
  }
}

export function toUserCertificationRequest(item: VerificationListItem): UserCertificationRequest {
  const documents = [
    toCertificationDocument(
      item.verificationId,
      'TRAINING_HISTORY',
      item.jobTrainingHistoryFile,
      item.createdAt,
      1,
    ),
    toCertificationDocument(
      item.verificationId,
      'ONLINE_APPLICATION',
      item.onlineCourseApplicationFile,
      item.createdAt,
      2,
    ),
  ].filter((document): document is CertificationDocument => document !== null)

  return {
    id: item.verificationId,
    courseName: item.courseTitle,
    requestedAt: toDateOnly(item.createdAt),
    status: item.status,
    rejectReason: item.rejectReason ?? undefined,
    documents,
  }
}

/** 내 인증 신청 목록 (GET /api/verifications/my) */
export async function getMyVerifications(
  params: MyVerificationListParams = {},
): Promise<PageResponse<UserCertificationRequest>> {
  const page = await http.get<PageResponse<VerificationListItem>>('/api/verifications/my', {
    query: params as Record<string, unknown>,
    auth: true,
  })

  return {
    ...page,
    content: page.content.map(toUserCertificationRequest),
  }
}

/** 내 인증 신청 상세 (GET /api/verifications/{verificationId}) */
export async function getMyVerificationDetail(verificationId: number): Promise<UserCertificationRequest> {
  const detail = await http.get<VerificationListItem>(`/api/verifications/${verificationId}`, {
    auth: true,
  })

  return toUserCertificationRequest(detail)
}

export interface SubmitVerificationParams {
  courseId: number
  courseSessionId: number
  jobTrainingHistoryFile: File
  onlineCourseApplicationFile: File
}

export type VerificationEvidenceType = 'job-training-history' | 'online-course-application'

export function toVerificationEvidenceType(type: CertificationDocumentType): VerificationEvidenceType {
  if (type === 'TRAINING_HISTORY') return 'job-training-history'
  return 'online-course-application'
}

/** 내 제출 자료 다운로드 (GET /api/verifications/{verificationId}/evidence/{evidenceType}) */
export async function getVerificationEvidence(
  verificationId: number,
  evidenceType: VerificationEvidenceType,
): Promise<Blob> {
  return http.getBlob(`/api/verifications/${verificationId}/evidence/${evidenceType}`, { auth: true })
}

/** 사용자 수강 인증 신청 (POST /api/verifications) */
export async function submitVerification(params: SubmitVerificationParams): Promise<UserCertificationRequest> {
  const formData = new FormData()
  formData.append('courseId', String(params.courseId))
  formData.append('courseSessionId', String(params.courseSessionId))
  formData.append('jobTrainingHistoryFile', params.jobTrainingHistoryFile)
  formData.append('onlineCourseApplicationFile', params.onlineCourseApplicationFile)

  const created = await http.post<VerificationListItem>('/api/verifications', formData, { auth: true })
  return toUserCertificationRequest(created)
}

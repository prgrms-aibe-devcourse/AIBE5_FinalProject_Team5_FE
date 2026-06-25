export type UserCertificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export type CertifiableCourse = {
  courseId: number
  courseSessionId: number
  title: string
  academy: string
  batch: string
}

export type CertificationDocumentType = 'TRAINING_HISTORY' | 'ONLINE_APPLICATION'

export type CourseCertificationSubmitPayload = {
  courseId: number
  courseSessionId: number
  jobTrainingHistoryFile: File
  onlineCourseApplicationFile: File
}

export type CertificationDocument = {
  id: number
  name: string
  type: CertificationDocumentType
  uploadedAt: string
}

export type UserCertificationRequest = {
  id: number
  courseName: string
  courseSessionId: number
  batch: string
  requestedAt: string
  status: UserCertificationStatus
  rejectReason?: string
  documents: CertificationDocument[]
}

export const CERTIFICATION_UPLOAD_SLOTS = [
  {
    type: 'TRAINING_HISTORY' as const,
    title: '직업 훈련 이력',
  },
  {
    type: 'ONLINE_APPLICATION' as const,
    title: '온라인 수강 신청 이력',
  },
]

const CERTIFICATION_DOCUMENT_LABEL = Object.fromEntries(
  CERTIFICATION_UPLOAD_SLOTS.map((slot) => [slot.type, slot.title]),
) as Record<CertificationDocumentType, string>

export function getCertificationDocumentLabel(type: CertificationDocumentType) {
  return CERTIFICATION_DOCUMENT_LABEL[type]
}

export const CERTIFICATION_SUBMISSION_GUIDE = {
  trainingHistoryPath: '고용 24 - 마이페이지 - 직업 훈련 관리 - 직업 훈련 이력',
  onlineApplicationPath: '고용 24 - 마이페이지 - 직업 훈련 관리 - 온라인 수강 신청 이력',
  instruction: '다음 자료에 대한 화면을 캡쳐해서 이미지를 업로드해주세요.',
}

export const CERTIFICATION_ACCEPTED_EXTENSIONS = ['image/jpeg', 'image/png', 'image/gif']
export const CERTIFICATION_MAX_FILE_SIZE = 25 * 1024 * 1024

export function getApprovedCertificationRequests(requests: UserCertificationRequest[]) {
  return requests.filter((request) => request.status === 'APPROVED')
}

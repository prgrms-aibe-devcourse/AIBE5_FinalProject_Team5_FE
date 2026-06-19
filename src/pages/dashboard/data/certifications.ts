export type UserCertificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export type CertifiableCourse = {
  courseId: number
  courseSessionId: number
  title: string
  academy: string
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

/** API 연동 후 제거 예정 — 내 과정 인증 요청 더미 데이터 */
export const myCertificationRequests: UserCertificationRequest[] = [
  {
    id: 1,
    courseName: '[프로그래밍] 국비지원 프론트엔드 데브코스',
    requestedAt: '2026-06-02',
    status: 'PENDING',
    documents: [
      { id: 1, name: '직업훈련이력_캡처.png', type: 'TRAINING_HISTORY', uploadedAt: '2026-06-02' },
      { id: 2, name: '온라인수강이력_캡처.png', type: 'ONLINE_APPLICATION', uploadedAt: '2026-06-02' },
    ],
  },
  {
    id: 2,
    courseName: '데이터 분석가 부트캠프 12기',
    requestedAt: '2026-05-28',
    status: 'APPROVED',
    documents: [
      { id: 3, name: '직업훈련이력_부트캠프.jpg', type: 'TRAINING_HISTORY', uploadedAt: '2026-05-28' },
      { id: 4, name: '온라인수강이력_부트캠프.jpg', type: 'ONLINE_APPLICATION', uploadedAt: '2026-05-28' },
    ],
  },
  {
    id: 3,
    courseName: 'React Native 모바일 앱 개발',
    requestedAt: '2026-05-25',
    status: 'REJECTED',
    rejectReason: '제출하신 수료증의 과정명이 신청 과정과 일치하지 않습니다.',
    documents: [
      { id: 5, name: '직업훈련이력_제출본.png', type: 'TRAINING_HISTORY', uploadedAt: '2026-05-25' },
      { id: 6, name: '온라인수강이력_제출본.png', type: 'ONLINE_APPLICATION', uploadedAt: '2026-05-25' },
    ],
  },
]

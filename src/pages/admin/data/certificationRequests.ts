import type { CertificationRequest, StatusTab } from '../AdminCertificationsPage'

/** API 연동 후 제거 예정 — 인증 관리 목록 더미 데이터 */
export const initialCertificationRequests: CertificationRequest[] = [
  {
    id: 1,
    userName: '김지원',
    courseName: '[프로그래밍] 국비지원 프론트엔드 데브코스',
    status: 'PENDING',
    requestedAt: '2026-06-02',
    documents: [
      { id: 1, name: '수료증명서.pdf', uploadedAt: '2026-06-02' },
      { id: 2, name: '출석부_최종.pdf', uploadedAt: '2026-06-02' },
    ],
  },
  {
    id: 2,
    userName: '박서연',
    courseName: 'Java 백엔드 개발자 양성과정',
    status: 'PENDING',
    requestedAt: '2026-06-01',
    documents: [{ id: 1, name: '과정수료증.pdf', uploadedAt: '2026-06-01' }],
  },
  {
    id: 3,
    userName: '이민호',
    courseName: '데이터 분석가 부트캠프 12기',
    status: 'APPROVED',
    requestedAt: '2026-05-28',
    documents: [
      { id: 1, name: '프로젝트결과보고서.pdf', uploadedAt: '2026-05-28' },
      { id: 2, name: '수료증.pdf', uploadedAt: '2026-05-28' },
    ],
  },
  {
    id: 4,
    userName: '최유진',
    courseName: 'React Native 모바일 앱 개발',
    status: 'REJECTED',
    requestedAt: '2026-05-25',
    rejectReason: '제출하신 수료증의 과정명이 신청 과정과 일치하지 않습니다.',
    documents: [{ id: 1, name: '증빙서류_제출본.pdf', uploadedAt: '2026-05-25' }],
  },
  {
    id: 5,
    userName: '정하늘',
    courseName: '클라우드 엔지니어 양성과정',
    status: 'PENDING',
    requestedAt: '2026-05-24',
    documents: [
      { id: 1, name: 'AWS자격증사본.pdf', uploadedAt: '2026-05-24' },
      { id: 2, name: '수료확인서.pdf', uploadedAt: '2026-05-24' },
      { id: 3, name: '출석증빙.pdf', uploadedAt: '2026-05-24' },
    ],
  },
]

export const CERTIFICATION_STATUS_TABS: { key: StatusTab; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'PENDING', label: '대기' },
  { key: 'APPROVED', label: '승인' },
  { key: 'REJECTED', label: '반려' },
]

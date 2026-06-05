import type { Inquiry } from '../AdminInquiriesPage'

/** API 연동 후 제거 예정 — 문의 관리 목록 더미 데이터 */
export const initialInquiries: Inquiry[] = [
  {
    id: 1,
    userName: '김지원',
    title: '수료증 제출 관련 문의',
    status: 'PENDING',
    requestedAt: '2026-06-03',
    content: '수료증 업로드가 되지 않아 문의드립니다. 확인 부탁드립니다.',
  },
  {
    id: 2,
    userName: '박서연',
    title: '결제 영수증 요청',
    status: 'PENDING',
    requestedAt: '2026-06-02',
    content: '결제 완료 후 영수증 발급이 필요합니다.',
  },
  {
    id: 3,
    userName: '이민호',
    title: '계정 정보 수정',
    status: 'COMPLETED',
    requestedAt: '2026-06-01',
    content: '닉네임 변경이 반영되지 않아 문의드렸습니다.',
    adminReply:
      '안녕하세요. 닉네임 변경이 정상 반영되었습니다. 마이페이지에서 다시 한 번 확인해 주세요.',
  },
  {
    id: 4,
    userName: '최유진',
    title: '과정 비교 기능 문의',
    status: 'PENDING',
    requestedAt: '2026-05-31',
    content: '비교하기 기능 사용 방법을 알고 싶습니다.',
  },
  {
    id: 5,
    userName: '정하늘',
    title: '수강 신청 취소',
    status: 'PENDING',
    requestedAt: '2026-05-30',
    content: '개인 사정으로 수강 신청을 취소하고 싶습니다.',
  },
  {
    id: 6,
    userName: '한소희',
    title: '출석 인정 문의',
    status: 'COMPLETED',
    requestedAt: '2026-05-29',
    content: '병원 진료로 인한 결석에 대한 출석 인정이 가능한지 문의합니다.',
    adminReply: '제출해 주신 진료 확인서 검토 후 출석 인정 처리 완료했습니다.',
  },
  {
    id: 7,
    userName: '오준혁',
    title: '환불 절차 문의',
    status: 'COMPLETED',
    requestedAt: '2026-05-28',
    content: '중도 환불 절차와 필요 서류를 안내해 주세요.',
    adminReply: '환불 절차 및 필요 서류를 등록하신 이메일로 발송해 드렸습니다.',
  },
  {
    id: 8,
    userName: '윤서아',
    title: '강의 자료 다운로드',
    status: 'PENDING',
    requestedAt: '2026-05-27',
    content: '지난 주 강의 자료를 다시 받을 수 있는지 문의드립니다.',
  },
]

export const INQUIRY_STATUS_TABS: { key: Inquiry['status'] | 'ALL'; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'PENDING', label: '대기' },
  { key: 'COMPLETED', label: '완료' },
]

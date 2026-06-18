export type UserInquiryStatus = 'PENDING' | 'COMPLETED'

export type UserInquiry = {
  id: number
  title: string
  requestedAt: string
  status: UserInquiryStatus
  content: string
  adminReply?: string
}

/** API 연동 후 제거 예정 — 사용자 문의 더미 데이터 */
export const userInquiries: UserInquiry[] = [
  {
    id: 1,
    title: '결제 문의',
    requestedAt: '2026.06.01',
    status: 'COMPLETED',
    content: '결제가 정상적으로 완료되었는지 확인 부탁드립니다.',
    adminReply: '결제 확인 및 처리 상태를 안내드렸습니다. 마이페이지에서 영수증을 확인해 주세요.',
  },
  {
    id: 2,
    title: '수강 신청 관련',
    requestedAt: '2026.06.01',
    status: 'PENDING',
    content: '수강 신청 후 추가 서류 제출이 필요한지 문의드립니다.',
  },
  {
    id: 3,
    title: '계정 정보 수정',
    requestedAt: '2026.05.30',
    status: 'COMPLETED',
    content: '이메일 주소 변경이 반영되지 않아 문의드립니다.',
    adminReply: '이메일 변경 절차를 안내드렸으며, 변경이 정상 반영되었습니다.',
  },
  {
    id: 4,
    title: '과정 비교 기능',
    requestedAt: '2026.05.28',
    status: 'PENDING',
    content: '비교하기 기능 사용 방법을 알고 싶습니다.',
  },
  {
    id: 5,
    title: '수료증 발급 문의',
    requestedAt: '2026.05.27',
    status: 'PENDING',
    content: '수료 후 수료증 발급까지 얼마나 걸리는지 궁금합니다.',
  },
  {
    id: 6,
    title: '출석 인정 요청',
    requestedAt: '2026.05.25',
    status: 'COMPLETED',
    content: '병원 진료로 인한 결석에 대한 출석 인정이 가능한지 문의합니다.',
    adminReply: '제출해 주신 진료 확인서 검토 후 출석 인정 처리 완료했습니다.',
  },
]

export type FaqItem = {
  id: number
  question: string
  answer: string
}

export const faqItems: FaqItem[] = [
  {
    id: 1,
    question: '내 문의는 어디에서 확인하나요?',
    answer: '문의 페이지 좌측 나의 문의 내역에서 등록한 문의와 처리 상태를 확인할 수 있습니다.',
  },
  {
    id: 2,
    question: '수강 신청 후 일정은 어디서 보나요?',
    answer: '대시보드 일정 메뉴에서 수강 일정과 알림을 확인할 수 있습니다.',
  },
  {
    id: 3,
    question: '스크랩한 과정은 어떻게 비교하나요?',
    answer: '스크랩 목록 페이지에서 비교할 과정을 선택한 뒤 과정 비교 기능을 이용해 주세요.',
  },
  {
    id: 4,
    question: '답변 완료된 문의는 어떻게 확인하나요?',
    answer: '완료 상태로 변경된 문의의 상세 보기에서 관리자 답변을 확인할 수 있습니다.',
  },
]

export type UserInquiryStatusTab = 'ALL' | UserInquiryStatus

export const USER_INQUIRY_STATUS_TABS: { key: UserInquiryStatusTab; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'PENDING', label: '대기' },
  { key: 'COMPLETED', label: '완료' },
]

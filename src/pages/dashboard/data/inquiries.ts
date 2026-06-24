export type UserInquiryStatus = 'PENDING' | 'COMPLETED'

export type UserInquiry = {
  id: number
  title: string
  requestedAt: string
  status: UserInquiryStatus
  content: string
  adminReply?: string
}

export type FaqItem = {
  id: number
  question: string
  answer: string
}

export const faqItems: FaqItem[] = [
  {
    id: 1,
    question: '과정 인증은 어떻게 신청하나요?',
    answer:
      '대시보드 → 내 정보에서 「과정 인증」을 선택한 뒤, 수강한 과정을 검색해 제출합니다. 고용24 마이페이지의 직업 훈련 이력·온라인 수강 신청 이력 화면을 캡처해 업로드해 주세요. 자세한 절차는 고객센터 → 과정 인증 가이드에서 확인할 수 있습니다.',
  },
  {
    id: 2,
    question: '과정 인증이 승인되어야 이용할 수 있는 기능이 있나요?',
    answer:
      '네. 해당 과정에 대한 인증 리뷰 작성과 AI 포트폴리오 생성은 인증이 승인된 이후에 이용할 수 있습니다. 과정 조회·스크랩·비교, 커뮤니티 게시글 작성 등은 인증 없이도 이용 가능합니다.',
  },
  {
    id: 3,
    question: '관심 있는 과정을 비교하려면 어떻게 하나요?',
    answer:
      '과정 조회 또는 스크랩 목록에서 카드의 ＋ 버튼으로 비교함에 담을 수 있습니다. 최대 3개까지 선택한 뒤, 우측 비교함에서 「비교하기」를 누르면 만족도·취업률·모집 정보 등을 한 화면에서 확인할 수 있습니다.',
  },
  {
    id: 4,
    question: '스크랩한 과정은 어디에서 보나요?',
    answer:
      '대시보드 홈의 스크랩 미리보기 또는 대시보드 → 스크랩 메뉴에서 확인할 수 있습니다. 스크랩 목록에서도 과정 비교함에 담아 비교할 수 있습니다.',
  },
  {
    id: 5,
    question: '문의 답변은 어디에서 확인하나요?',
    answer:
      '문의 페이지 좌측 「나의 문의 내역」에서 처리 상태를 확인할 수 있습니다. 관리자 답변이 등록되면 상태가 「완료」로 바뀌며, 해당 문의를 펼쳐 답변 내용을 볼 수 있습니다.',
  },
]

export type UserInquiryStatusTab = 'ALL' | UserInquiryStatus

export const USER_INQUIRY_STATUS_TABS: { key: UserInquiryStatusTab; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'PENDING', label: '대기' },
  { key: 'COMPLETED', label: '완료' },
]

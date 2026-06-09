export type SupportNotice = {
  id: number
  title: string
  content: string
  postedAt: string
}

/** API 연동 후 제거 예정 — 고객센터 공지 더미 데이터 */
export const supportNotices: SupportNotice[] = [
  {
    id: 1,
    title: '6월 정기 점검 안내',
    content:
      '서비스 안정화를 위한 정기 점검이 6월 8일(일) 02:00~06:00 예정입니다. 점검 시간에는 일부 기능 이용이 제한될 수 있습니다.',
    postedAt: '2026.06.03',
  },
  {
    id: 2,
    title: '신규 과정 오픈 알림',
    content: '데이터 분석 부트캠프 과정이 새롭게 오픈되었습니다. 과정 조회 메뉴에서 확인해 보세요.',
    postedAt: '2026.06.01',
  },
  {
    id: 3,
    title: '고객센터 운영 시간 안내',
    content: '6월 공휴일 기간 고객센터 운영 시간이 조정됩니다. 자세한 일정은 문의 안내를 참고해 주세요.',
    postedAt: '2026.05.24',
  },
  {
    id: 4,
    title: '여름 리뷰 작성 이벤트 안내',
    content: '7월 한 달간 인증 리뷰 작성 이벤트를 진행합니다. 참여 방법은 커뮤니티 아티클에서 확인할 수 있습니다.',
    postedAt: '2026.05.27',
  },
]

export type SupportContactInfo = {
  email: string
  hours: string
  lunchBreak: string
}

export const supportContactInfo: SupportContactInfo = {
  email: 'support@bootsignal.kr',
  hours: '평일 10:00 ~ 18:00',
  lunchBreak: '점심시간 12:00 ~ 13:00',
}

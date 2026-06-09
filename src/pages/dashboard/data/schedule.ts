export function toScheduleDateKey(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export type ScheduleEvent = {
  id: number
  date: string
  title: string
  startTime: string
  endTime: string
  description: string
}

/** API 연동 후 제거 예정 — 일정 더미 데이터 */
export const scheduleEvents: ScheduleEvent[] = [
  {
    id: 1,
    date: '2026-06-15',
    title: '프로젝트 회의',
    startTime: '11:00',
    endTime: '12:00',
    description: '주간 진행 상황과 다음 작업을 정리합니다.',
  },
  {
    id: 2,
    date: '2026-06-15',
    title: '백엔드 스터디',
    startTime: '19:00',
    endTime: '20:30',
    description: '에러 처리와 API 계약을 다시 점검합니다.',
  },
  {
    id: 3,
    date: '2026-06-17',
    title: '포트폴리오 정리',
    startTime: '14:00',
    endTime: '15:30',
    description: '지원용 포트폴리오 문구와 레이아웃을 다듬습니다.',
  },
  {
    id: 4,
    date: '2026-06-17',
    title: '면접 준비',
    startTime: '20:00',
    endTime: '21:00',
    description: '자주 묻는 질문과 답변을 연습합니다.',
  },
  {
    id: 5,
    date: '2026-06-24',
    title: '팀 미팅',
    startTime: '10:00',
    endTime: '11:00',
    description: '역할 분담과 일정 확인을 진행합니다.',
  },
  {
    id: 6,
    date: '2026-06-24',
    title: '리뷰 작성',
    startTime: '13:00',
    endTime: '14:00',
    description: '학습 후기를 정리해서 게시글로 남깁니다.',
  },
  {
    id: 7,
    date: '2026-06-24',
    title: '자료 업로드',
    startTime: '16:00',
    endTime: '16:30',
    description: '공유 문서를 최신 상태로 맞춥니다.',
  },
  {
    id: 8,
    date: '2026-06-25',
    title: '컨디션 체크',
    startTime: '09:00',
    endTime: '09:30',
    description: '일주일 학습 흐름을 점검합니다.',
  },
  {
    id: 9,
    date: '2026-06-25',
    title: '코드 정리',
    startTime: '15:00',
    endTime: '16:00',
    description: '중복 로직과 공통 컴포넌트를 묶습니다.',
  },
]

export const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

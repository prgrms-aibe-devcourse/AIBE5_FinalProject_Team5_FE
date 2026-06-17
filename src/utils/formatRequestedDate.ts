// ISO 형식의 날짜를 `YYYY.MM.DD` 형태로 표시하기 위한 유틸
export function formatRequestedDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-')
  return `${year}.${month}.${day}`
}

// 커뮤니티/아티클에서 날짜를 `YYYY.MM.DD` 형태로 표시하기 위한 유틸
export function formatCommunityDate(date: string) {
  return date.replaceAll('-', '.')
}

/** ISO 날짜/시간에서 YYYY-MM-DD만 추출 */
export function toDateOnly(iso: string): string {
  return iso.split('T')[0]
}


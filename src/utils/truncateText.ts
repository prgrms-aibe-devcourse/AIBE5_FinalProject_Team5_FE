/** 목록·카드용 텍스트 말줄임 (공백 정규화 후 최대 길이) */
export function truncateText(text: string, maxLength = 50): string {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength)}…`
}

/** 목록·카드용 텍스트 말줄임 (공백 정규화 후 최대 길이) */
export function truncateText(text: string, maxLength = 50): string {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength)}…`
}

/** 긴 텍스트를 앞·뒤를 남기고 가운데를 … 로 말줄임 */
export function truncateTextMiddle(text: string, maxLength = 50): string {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized

  const ellipsis = '...'
  const keepLength = maxLength - ellipsis.length
  if (keepLength <= 1) return `${normalized.slice(0, maxLength - 1)}…`

  const head = Math.ceil(keepLength / 2)
  const tail = Math.floor(keepLength / 2)
  return `${normalized.slice(0, head)}${ellipsis}${normalized.slice(-tail)}`
}

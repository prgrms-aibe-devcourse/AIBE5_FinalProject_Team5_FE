/** protocol 없는 외부 URL을 절대 URL로 변환 (예: www.example.com → https://www.example.com) */
export function toAbsoluteUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return trimmed
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (trimmed.startsWith('//')) return `https:${trimmed}`
  return `https://${trimmed}`
}

/**
 * 과정 썸네일 유틸 — 기관 로고가 없을 때 과정별로 구별되는 그라디언트와
 * 기관 이니셜을 결정적으로 생성한다. (실제 이미지 없이도 카드가 다양하게 보이도록)
 */

/** 문자열 → 결정적 해시(같은 입력이면 항상 같은 값) */
export function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0 // 32비트 정수로 유지
  }
  return Math.abs(hash)
}

/**
 * 오션 팔레트 기반 그라디언트 후보.
 * Tailwind purge 대응 — 동적 조합 금지, 전체 클래스를 리터럴로 둔다.
 */
export const THUMBNAIL_GRADIENTS: string[] = [
  'bg-gradient-to-br from-waterlineBlue via-softAquaBlue to-mistSkyBlue',
  'bg-gradient-to-br from-deepOceanNavy via-waterlineBlue to-softAquaBlue',
  'bg-gradient-to-br from-softAquaBlue via-mistSkyBlue to-foamWhite',
  'bg-gradient-to-tr from-waterlineBlue via-deepOceanNavy to-waterlineBlue',
  'bg-gradient-to-br from-mistSkyBlue via-softAquaBlue to-waterlineBlue',
  'bg-gradient-to-tr from-deepOceanNavy via-waterlineBlue to-mistSkyBlue',
]

/** seed로 그라디언트 1개를 결정적으로 선택 */
export function pickGradient(seed: string): string {
  return THUMBNAIL_GRADIENTS[hashString(seed) % THUMBNAIL_GRADIENTS.length]
}

/**
 * 기관명에서 이니셜(1~2글자) 도출.
 * "(주)", "㈜", 괄호/공백/특수문자 제거 후 앞 글자 사용. 비면 'BS' 폴백.
 */
export function getCourseInitials(company?: string | null): string {
  if (!company) return 'BS'
  const cleaned = company
    .replace(/\(주\)|\(유\)|\(재\)|㈜|주식회사/g, '')
    .replace(/[^\p{L}\p{N}]/gu, '')
    .trim()
  if (!cleaned) return 'BS'
  // 영문은 대문자 2글자, 그 외(한글 등)는 앞 2글자
  if (/^[A-Za-z]+$/.test(cleaned)) {
    return cleaned.slice(0, 2).toUpperCase()
  }
  return cleaned.slice(0, 2)
}

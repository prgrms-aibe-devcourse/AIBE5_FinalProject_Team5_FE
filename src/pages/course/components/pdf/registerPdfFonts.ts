import { Font } from '@react-pdf/renderer'

let registered = false

/** 한글 PDF — Noto Sans KR (CDN, 최초 1회 등록) */
export function registerPdfFonts() {
  if (registered) return
  registered = true

  Font.register({
    family: 'NotoSansKR',
    fonts: [
      {
        src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-kr@5.2.8/files/noto-sans-kr-korean-400-normal.woff',
        fontWeight: 400,
      },
      {
        src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-kr@5.2.8/files/noto-sans-kr-korean-700-normal.woff',
        fontWeight: 700,
      },
    ],
  })
}

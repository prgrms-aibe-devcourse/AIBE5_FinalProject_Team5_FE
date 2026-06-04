import { pdf } from '@react-pdf/renderer'
import CourseComparePdfDocument from './CourseComparePdfDocument.tsx'
import type { CourseComparePdfPayload } from './courseComparePdfTypes.ts'
import { registerPdfFonts } from './registerPdfFonts.ts'

function buildFileName() {
  const date = new Date()
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `과정비교_${y}${m}${d}.pdf`
}

export async function downloadCourseComparePdf(payload: CourseComparePdfPayload) {
  registerPdfFonts()

  const blob = await pdf(<CourseComparePdfDocument data={payload} />).toBlob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = buildFileName()
  link.click()
  URL.revokeObjectURL(url)
}

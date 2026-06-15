import type { CourseRecruitment } from '../../../services/course.ts'

interface CourseRecruitmentBarProps {
  recruitment: CourseRecruitment
}

const STEPS: {
  key: keyof CourseRecruitment
  label: string
  bgClass: string
  clipClass: string
  outerRoundClass?: string
}[] = [
  {
    key: 'capacity',
    label: '모집 인원',
    bgClass: 'bg-foamWhite',
    clipClass: 'recruitment-chevron-first',
    outerRoundClass: 'overflow-hidden rounded-l-[3rem]',
  },
  {
    key: 'applicants',
    label: '선발 인원',
    bgClass: 'bg-mistSkyBlue',
    clipClass: 'recruitment-chevron-middle',
  },
  {
    key: 'confirmed',
    label: '수강 확정 인원',
    bgClass: 'bg-softAquaBlue',
    clipClass: 'recruitment-chevron-last',
    outerRoundClass: 'overflow-hidden rounded-r-[3rem]',
  },
]

// 모집 현황 바 (모집 인원, 선발 인원, 수강 확정 인원)
export default function CourseRecruitmentBar({ recruitment }: CourseRecruitmentBarProps) {
  return (
    <div className="flex h-full flex-col rounded-xl glass-panel shadow-[0_2px_12px_rgba(52,74,100,0.06)] p-4 md:p-5">
      <h3 className="mb-3 text-sm font-semibold text-deepOceanNavy md:text-base">모집 현황</h3>
      
      {/* 모집 현황 세그먼트 (모집 인원, 선발 인원, 수강 확정 인원) 반복 처리 */}
      <div className="flex min-h-[5.5rem] flex-1 items-stretch gap-[3px]">
        {STEPS.map(({ key, label, bgClass, clipClass, outerRoundClass }) => {
          const segment = (
            <div className={`flex h-full min-h-[5.5rem] flex-col items-center justify-center py-3 text-center ${bgClass} ${clipClass}`} >
              <p className="text-base font-semibold text-deepOceanNavy sm:text-lg">
                {recruitment[key]}명
              </p>
              <p className="mt-0.5 text-xs text-deepOceanNavy/80 sm:text-sm">{label}</p>
            </div>
          )

          return ( // 모집 현황 세그먼트 반환
            <div key={key} className={`min-w-0 flex-1 ${outerRoundClass ?? ''}`}>
              {segment}
            </div>
          )
        })}
      </div>
    </div>
  )
}

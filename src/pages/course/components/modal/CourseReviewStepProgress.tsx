interface CourseReviewStepProgressProps {
  currentStep: 1 | 2 | 3 | 4 | 5
}

const STEP_LABELS = ['기본 정보', '과정 난이도', '과정 품질', '프로젝트 경험', '추가 정보'] as const

export default function CourseReviewStepProgress({ currentStep }: CourseReviewStepProgressProps) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2.5">
        {STEP_LABELS.map((label, idx) => {
          const step = idx + 1
          const isActive = step <= currentStep

          return (
            <div key={label} className="flex min-w-0 flex-1 items-center gap-2.5">
              <div className="min-w-0 flex-1">
                <div className={`h-1.5 rounded-full transition-colors ${isActive ? 'bg-waterlineBlue' : 'bg-mistSkyBlue/45'}`} />
                <p className={`mt-0.5 hidden text-[10px] font-medium sm:mt-1 sm:block sm:text-xs ${isActive ? 'text-deepOceanNavy' : 'text-secondary/80'}`}>
                  {label}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      <p className="mt-1 text-right text-xs font-medium text-secondary/85">{currentStep} / 5 단계</p>
    </div>
  )
}

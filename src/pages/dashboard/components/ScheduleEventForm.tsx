import type { FormEvent } from 'react'

export type ScheduleFormState = {
  date: string
  title: string
  startTime: string
  endTime: string
  description: string
}

export const scheduleInputClassName =
  'w-full rounded-xl border border-mistSkyBlue/60 bg-white px-4 py-3 font-pretendard text-sm text-deepOceanNavy outline-none transition-colors placeholder:text-secondary/60 focus:border-waterlineBlue focus:ring-2 focus:ring-waterlineBlue/20'

type ScheduleEventFormProps = {
  formId: string
  value: ScheduleFormState
  onChange: (value: ScheduleFormState) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export default function ScheduleEventForm({ formId, value, onChange, onSubmit }: ScheduleEventFormProps) {
  return (
    <form id={formId} className="space-y-4" onSubmit={onSubmit}>
      <label className="block">
        <span className="mb-2 block font-pretendard text-sm font-semibold text-deepOceanNavy">날짜</span>
        <input
          type="date"
          value={value.date}
          onChange={(event) => onChange({ ...value, date: event.target.value })}
          className={scheduleInputClassName}
        />
      </label>

      <label className="block">
        <span className="mb-2 block font-pretendard text-sm font-semibold text-deepOceanNavy">제목</span>
        <input
          value={value.title}
          onChange={(event) => onChange({ ...value, title: event.target.value })}
          className={scheduleInputClassName}
          placeholder="일정 제목"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-pretendard text-sm font-semibold text-deepOceanNavy">시작 시간</span>
          <input
            type="time"
            value={value.startTime}
            onChange={(event) => onChange({ ...value, startTime: event.target.value })}
            className={scheduleInputClassName}
          />
        </label>
        <label className="block">
          <span className="mb-2 block font-pretendard text-sm font-semibold text-deepOceanNavy">종료 시간</span>
          <input
            type="time"
            value={value.endTime}
            onChange={(event) => onChange({ ...value, endTime: event.target.value })}
            className={scheduleInputClassName}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block font-pretendard text-sm font-semibold text-deepOceanNavy">메모</span>
        <textarea
          value={value.description}
          onChange={(event) => onChange({ ...value, description: event.target.value })}
          rows={5}
          className={`${scheduleInputClassName} resize-none`}
          placeholder="일정 메모"
        />
      </label>
    </form>
  )
}

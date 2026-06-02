import { useState, type FormEvent, type ReactNode } from 'react'
import DashboardShell from './components/DashboardShell'
import ScheduleCalendarPanel from './components/ScheduleCalendarPanel'
import { scheduleEvents, type ScheduleEvent } from './dashboardData'

type ScheduleFormState = {
  date: string
  title: string
  startTime: string
  endTime: string
  description: string
}

const initialScheduleForm: ScheduleFormState = {
  date: '2026-06-15',
  title: '',
  startTime: '06:00',
  endTime: '06:00',
  description: '',
}

function Modal({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#eef2f6] px-6 py-4">
          <h3 className="text-lg font-bold text-[#151b24]">일정 추가</h3>
          <button type="button" onClick={onClose} className="text-2xl leading-none text-[#5d6470]">
            ×
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  )
}

function toEventId(events: ScheduleEvent[]) {
  return events.length ? Math.max(...events.map((event) => event.id)) + 1 : 1
}

export default function SchedulePage() {
  const [events, setEvents] = useState<ScheduleEvent[]>(scheduleEvents)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(initialScheduleForm)
  const [toast, setToast] = useState('')

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setEvents((current) => [
      ...current,
      {
        id: toEventId(current),
        date: form.date,
        title: form.title,
        startTime: form.startTime,
        endTime: form.endTime,
        description: form.description,
      },
    ])

    setOpen(false)
    setForm(initialScheduleForm)
    showToast('일정을 추가했어요.')
  }

  return (
    <DashboardShell
      title="일정"
      action={
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border border-[#e1e5ea] px-4 py-2 text-sm font-semibold text-[#7c8796] transition-colors hover:border-[#b7c4d6] hover:text-[#344A64]"
        >
          + 일정 추가
        </button>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.75fr)]">
        <ScheduleCalendarPanel
          title="일정"
          events={events}
          showAddButton
          onAddSchedule={() => setOpen(true)}
        />

        <section className="rounded-2xl border border-[#eef2f6] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <h2 className="text-lg font-bold text-[#151b24]">리마인더 메모</h2>
          <p className="mt-3 text-sm leading-7 text-[#64748b]">
            날짜를 클릭하면 해당 날짜의 일정이 오른쪽에 표시됩니다.
            <br />
            일정 추가 버튼으로 새 이벤트를 넣으면 점 개수도 함께 늘어납니다.
          </p>

          <div className="mt-6 rounded-2xl border border-[#e7edf3] bg-[#f8fafc] px-4 py-4">
            <p className="text-sm font-semibold text-[#1f2937]">오늘의 확인 포인트</p>
            <ul className="mt-3 space-y-2 text-sm text-[#64748b]">
              <li>달력 월 이동</li>
              <li>날짜 클릭 시 리마인더 갱신</li>
              <li>일정 수에 따른 점 표시</li>
            </ul>
          </div>
        </section>
      </div>

      {open ? (
        <Modal onClose={() => setOpen(false)}>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#334155]">날짜</span>
              <input
                type="date"
                value={form.date}
                onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
                className="w-full rounded-xl border border-[#c9d2dd] px-4 py-3 text-sm outline-none transition-colors focus:border-[#344A64]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#334155]">제목</span>
              <input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                className="w-full rounded-xl border border-[#c9d2dd] px-4 py-3 text-sm outline-none transition-colors focus:border-[#344A64]"
                placeholder="일정 제목"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#334155]">시작 시간</span>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(event) => setForm((current) => ({ ...current, startTime: event.target.value }))}
                  className="w-full rounded-xl border border-[#c9d2dd] px-4 py-3 text-sm outline-none transition-colors focus:border-[#344A64]"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#334155]">종료 시간</span>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(event) => setForm((current) => ({ ...current, endTime: event.target.value }))}
                  className="w-full rounded-xl border border-[#c9d2dd] px-4 py-3 text-sm outline-none transition-colors focus:border-[#344A64]"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#334155]">설명</span>
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                rows={5}
                className="w-full rounded-xl border border-[#c9d2dd] px-4 py-3 text-sm outline-none transition-colors focus:border-[#344A64]"
                placeholder="일정 설명"
              />
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-[#c9d2dd] px-5 py-3 text-sm font-semibold text-[#334155] transition-colors hover:bg-[#f7fafc]"
              >
                취소
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#3e4f6d] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#344A64]"
              >
                일정 저장
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {toast ? <div className="fixed bottom-6 right-6 z-[70] rounded-full bg-[#344A64] px-5 py-3 text-sm font-semibold text-white shadow-xl">{toast}</div> : null}
    </DashboardShell>
  )
}

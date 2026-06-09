import { useMemo, useState, type FormEvent } from 'react'
import Toast from '../../components/common/Toast'
import { scheduleEvents, toScheduleDateKey, type ScheduleEvent } from './data/schedule'
import DashboardActionButton from './components/DashboardActionButton'
import DeleteConfirmModal from './components/modal/DeleteConfirmModal'
import DashboardModal from './components/modal/DashboardModal'
import DashboardShell from './components/DashboardShell'
import ScheduleCalendarPanel from './components/ScheduleCalendarPanel'
import ScheduleEventDetailCard from './components/ScheduleEventDetailCard'
import ScheduleEventForm, { type ScheduleFormState } from './components/ScheduleEventForm'

const defaultFormTimes: Pick<ScheduleFormState, 'startTime' | 'endTime'> = {
  startTime: '06:00',
  endTime: '06:00',
}

type ScheduleModalState = { mode: 'add' } | { mode: 'edit'; event: ScheduleEvent } | null

function toEventId(events: ScheduleEvent[]) {
  return events.length ? Math.max(...events.map((event) => event.id)) + 1 : 1
}

function eventToForm(event: ScheduleEvent): ScheduleFormState {
  return {
    date: event.date,
    title: event.title,
    startTime: event.startTime,
    endTime: event.endTime,
    description: event.description,
  }
}

function createEmptyForm(date: string): ScheduleFormState {
  return {
    date,
    title: '',
    ...defaultFormTimes,
    description: '',
  }
}

// 일정 페이지 (캘린더·일정 상세·추가/수정 모달)
export default function SchedulePage() {
  // --- 일정 데이터·선택 상태·모달 ---
  const [events, setEvents] = useState<ScheduleEvent[]>(scheduleEvents)
  const [modal, setModal] = useState<ScheduleModalState>(null)
  const [selectedDate, setSelectedDate] = useState(() => toScheduleDateKey(new Date()))
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
  const [form, setForm] = useState<ScheduleFormState>(() => createEmptyForm(toScheduleDateKey(new Date())))
  const [deleteTarget, setDeleteTarget] = useState<ScheduleEvent | null>(null)
  const [toast, setToast] = useState('')

  const selectedEvent = useMemo(
    () => (selectedEventId ? events.find((event) => event.id === selectedEventId) ?? null : null),
    [events, selectedEventId],
  )

  // --- 이벤트 핸들러 ---
  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  const handleSelectedDateChange = (dateKey: string) => {
    setSelectedDate(dateKey)
    setSelectedEventId((currentId) => {
      if (!currentId) return null

      const currentEvent = events.find((event) => event.id === currentId)
      return currentEvent?.date === dateKey ? currentId : null
    })
  }

  const openAddModal = () => {
    setForm(createEmptyForm(selectedDate))
    setModal({ mode: 'add' })
  }

  const closeModal = () => {
    setModal(null)
    setForm(createEmptyForm(selectedDate))
  }

  const handleAddSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const newEvent: ScheduleEvent = {
      id: toEventId(events),
      date: form.date,
      title: form.title,
      startTime: form.startTime,
      endTime: form.endTime,
      description: form.description,
    }

    setEvents((current) => [...current, newEvent])
    setSelectedDate(newEvent.date)
    setSelectedEventId(newEvent.id)

    closeModal()
    showToast('일정을 추가했어요.')
  }

  const handleEditSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (modal?.mode !== 'edit') return

    const editingId = modal.event.id

    setEvents((current) =>
      current.map((item) =>
        item.id === editingId
          ? {
              ...item,
              date: form.date,
              title: form.title,
              startTime: form.startTime,
              endTime: form.endTime,
              description: form.description,
            }
          : item,
      ),
    )

    setSelectedDate(form.date)
    closeModal()
    showToast('일정을 수정했어요.')
  }

  const handleEventClick = (event: ScheduleEvent) => {
    setSelectedEventId(event.id)
  }

  const openEditModal = (event: ScheduleEvent) => {
    setForm(eventToForm(event))
    setModal({ mode: 'edit', event })
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return

    setEvents((current) => current.filter((item) => item.id !== deleteTarget.id))

    if (selectedEventId === deleteTarget.id) {
      setSelectedEventId(null)
    }

    setDeleteTarget(null)
    showToast('일정을 삭제했어요.')
  }

  return (
    <DashboardShell title="일정">
      {/* 캘린더 */}
      <ScheduleCalendarPanel
        events={events}
        showAddButton
        onAddSchedule={openAddModal}
        onEventClick={handleEventClick}
        selectedEventId={selectedEventId}
        selectedDate={selectedDate}
        onSelectedDateChange={handleSelectedDateChange}
      />

      {/* 선택 일정 상세 */}
      <ScheduleEventDetailCard
        event={selectedEvent}
        onEdit={selectedEvent ? () => openEditModal(selectedEvent) : undefined}
        onDelete={selectedEvent ? () => setDeleteTarget(selectedEvent) : undefined}
        className="mt-4"
      />

      {/* 추가·수정 모달 */}
      {modal?.mode === 'add' ? (
        <DashboardModal
          title="일정 추가"
          onClose={closeModal}
          footer={
            <div className="flex justify-end gap-3">
              <DashboardActionButton label="취소" variant="secondary" onClick={closeModal} />
              <DashboardActionButton label="일정 저장" type="submit" form="schedule-form" />
            </div>
          }
        >
          <ScheduleEventForm
            formId="schedule-form"
            value={form}
            onChange={setForm}
            onSubmit={handleAddSubmit}
          />
        </DashboardModal>
      ) : null}

      {modal?.mode === 'edit' ? (
        <DashboardModal
          title="일정 수정"
          onClose={closeModal}
          footer={
            <div className="flex justify-end gap-3">
              <DashboardActionButton label="취소" variant="secondary" onClick={closeModal} />
              <DashboardActionButton label="저장" type="submit" form="schedule-edit-form" />
            </div>
          }
        >
          <ScheduleEventForm
            formId="schedule-edit-form"
            value={form}
            onChange={setForm}
            onSubmit={handleEditSubmit}
          />
        </DashboardModal>
      ) : null}

      {/* 삭제 확인 모달 */}
      {deleteTarget ? (
        <DeleteConfirmModal
          targetTitle={deleteTarget.title}
          targetLabel="일정"
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
        />
      ) : null}

      {/* 토스트 */}
      {toast ? <Toast message={toast} onClose={() => setToast('')} /> : null}
    </DashboardShell>
  )
}

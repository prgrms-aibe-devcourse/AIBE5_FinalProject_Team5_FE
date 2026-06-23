type GoogleCalendarSyncActionProps = {
  connected: boolean
  isLoading?: boolean
  onConnect: () => void
  onDisconnect: () => void
}

const actionButtonClass =
  'rounded-full border border-mistSkyBlue/55 bg-white/90 px-3 py-1.5 font-pretendard text-xs font-semibold transition-colors hover:border-waterlineBlue/45 hover:bg-foamWhite disabled:cursor-not-allowed disabled:opacity-50'

export default function GoogleCalendarSyncAction({
  connected,
  isLoading = false,
  onConnect,
  onDisconnect,
}: GoogleCalendarSyncActionProps) {
  if (connected) {
    return (
      <button
        type="button"
        onClick={onDisconnect}
        disabled={isLoading}
        className={`${actionButtonClass} shrink-0 text-waterlineBlue hover:text-deepOceanNavy`}
      >
        {isLoading ? '해제 중…' : 'Google Calendar 연동 해제'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onConnect}
      disabled={isLoading}
      className={`${actionButtonClass} shrink-0 text-waterlineBlue hover:text-deepOceanNavy`}
    >
      {isLoading ? '연동 중…' : 'Google Calendar 연동'}
    </button>
  )
}
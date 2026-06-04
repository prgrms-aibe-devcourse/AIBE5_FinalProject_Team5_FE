type AdminListActionButtonProps = {
  label: string
  onClick: () => void
  count?: number
}

export default function AdminListActionButton({ label, onClick, count }: AdminListActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex h-9 items-center gap-2 rounded-lg border border-mistSkyBlue/60 bg-white px-3 font-pretendard text-sm font-semibold text-deepOceanNavy shadow-[0_1px_2px_rgba(52,74,100,0.05)] transition-all hover:border-waterlineBlue hover:bg-waterlineBlue hover:text-white hover:shadow-[0_2px_8px_rgba(84,132,183,0.22)]"
    >
      {label}
      {count !== undefined ? (
        <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-foamWhite px-1.5 text-[11px] font-bold tabular-nums text-waterlineBlue ring-1 ring-mistSkyBlue/50 transition-colors group-hover:bg-white/20 group-hover:text-white group-hover:ring-white/35">
          {count}
        </span>
      ) : null}
    </button>
  )
}

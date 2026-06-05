export default function AdminHeader() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-[#eef2f6] bg-white px-6">
      <div className="flex items-center gap-2">
        <button className="text-[#536173]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <span className="ml-2 text-base font-bold text-[#151b24]">Logo</span>
      </div>

      <nav className="flex gap-8">
        {['메뉴', '메뉴', '메뉴', '메뉴'].map((label, i) => (
          <a key={i} href="#" className="text-sm text-[#536173] hover:text-[#151b24]">
            {label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button className="flex h-8 w-8 items-center justify-center rounded-full text-[#94a3b8] hover:bg-[#f1f5f9]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <circle cx="12" cy="17" r="0.5" fill="currentColor" />
          </svg>
        </button>
        <button className="relative flex h-8 w-8 items-center justify-center rounded-full text-[#94a3b8] hover:bg-[#f1f5f9]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-orange-400" />
        </button>
        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/32?img=47"
            alt="Katie Pena"
            className="h-8 w-8 rounded-full object-cover"
          />
          <div className="text-left">
            <p className="text-xs font-semibold text-[#151b24]">Katie Pena</p>
            <p className="text-[10px] text-[#94a3b8]">Admin</p>
          </div>
        </div>
      </div>
    </header>
  )
}

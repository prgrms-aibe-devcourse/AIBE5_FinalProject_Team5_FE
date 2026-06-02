function BellIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.3" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export default function DashboardHeader() {
  return (
    <header className="flex h-24 items-center justify-end bg-white px-10">
      <nav className="flex items-center gap-12 text-base font-semibold text-[#24354d]" aria-label="상단 메뉴">
        <a href="/courses" className="transition-colors hover:text-[#5484B7]">
          과정 조회
        </a>
        <a href="/community" className="flex items-center gap-1 transition-colors hover:text-[#5484B7]">
          커뮤니티
          <ChevronDownIcon />
        </a>
        <a href="/support" className="transition-colors hover:text-[#5484B7]">
          고객센터
        </a>
      </nav>

      <div className="ml-14 flex items-center gap-6 text-[#7b8795]">
        <button className="relative transition-colors hover:text-[#344A64]" aria-label="알림" type="button">
          <BellIcon />
          <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#f06f64]" />
        </button>

        <button className="flex items-center gap-2 text-base font-semibold text-[#5c6878] transition-colors hover:text-[#344A64]" type="button">
          <UserIcon />
          <span>닉네임</span>
          <ChevronDownIcon />
        </button>
      </div>
    </header>
  )
}

import { NavLink } from 'react-router-dom'

// 고객센터 탭 목록
const supportTabs = [
  { label: '공지사항', path: '/support/notices' },
  { label: '과정 인증 가이드', path: '/support/certification' },
] as const

// 고객센터 탭
export default function SupportTabs() {
  return (
    <nav className="flex min-w-0 flex-wrap gap-x-6 gap-y-1" aria-label="고객센터 메뉴" role="tablist">
      {supportTabs.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          role="tab"
          className={({ isActive }) =>
            `-mb-px px-4 py-4 text-lg font-medium transition-colors ${
              isActive
                ? 'border-b-[3px] border-[#005EB8] font-semibold text-[#005EB8]'
                : 'border-b-2 border-transparent text-softAquaBlue hover:text-secondary'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

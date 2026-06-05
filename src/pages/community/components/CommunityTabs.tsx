import { NavLink } from 'react-router-dom'
import { communitySections } from '../communitySections'

// 커뮤니티 탭 목록 (게시판, Q&A, 모집, 아티클)
const navItems = Object.values(communitySections)

// 커뮤니티 탭 (게시판, Q&A, 모집, 아티클)
export default function CommunityTabs() {
  return (
    <nav className="flex min-w-0 flex-wrap gap-x-6 gap-y-1" aria-label="커뮤니티 메뉴" role="tablist">
      {navItems.map((item) => ( // 커뮤니티 탭 목록 반복 처리
        <NavLink
          key={item.listPath}
          to={item.listPath}
          role="tab"
          className={({ isActive }) =>
            `px-4 py-4 text-lg font-medium transition-colors -mb-px ${
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

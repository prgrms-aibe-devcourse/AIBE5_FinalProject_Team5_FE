import { NavLink, Outlet } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import { communitySections } from './communitySections'

const navItems = Object.values(communitySections)

export default function CommunityLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="w-full flex-1 pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">커뮤니티</h1>
            <p className="text-gray-600">다양한 정보와 경험을 공유하는 공간입니다.</p>
          </div>

          <nav className="border-b border-gray-200" aria-label="커뮤니티 메뉴">
            <div className="flex gap-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.listPath}
                  to={item.listPath}
                  className={({ isActive }) =>
                    `px-4 py-4 text-lg font-medium transition-colors ${
                      isActive
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>

          <div className="py-8">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

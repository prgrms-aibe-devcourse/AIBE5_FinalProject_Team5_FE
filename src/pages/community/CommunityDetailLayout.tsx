import { Link, Outlet, useLocation } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import CommunityDetailBreadcrumb from './components/CommunityDetailBreadcrumb'
import { communitySections, getCommunitySectionFromPath } from './communitySections'

export default function CommunityDetailLayout() {
  const { pathname } = useLocation()
  const section = getCommunitySectionFromPath(pathname)

  if (!section) {
    return null
  }

  const { label, listPath } = communitySections[section]

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="w-full flex-1 pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CommunityDetailBreadcrumb section={section} />

          <div className="mt-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{label} 상세</h1>
            <Link
              to={listPath}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
            >
              목록으로
            </Link>
          </div>

          <div className="py-8">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

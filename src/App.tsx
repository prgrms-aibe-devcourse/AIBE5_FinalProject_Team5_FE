import { useEffect, useState } from 'react'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/dashboard/DashboardPage'
import SchedulePage from './pages/dashboard/SchedulePage'
import ProfilePage from './pages/dashboard/ProfilePage'
import InquiriesPage from './pages/dashboard/InquiriesPage'
import SectionPlaceholderPage from './pages/dashboard/SectionPlaceholderPage'
import LoginPage from './pages/auth/desktop/LoginPage'
import SignupPage from './pages/auth/desktop/SignupPage'

type RouteName =
  | 'home'
  | 'dashboard'
  | 'dashboard-schedule'
  | 'dashboard-profile'
  | 'dashboard-inquiries'
  | 'dashboard-favorites'
  | 'dashboard-posts'
  | 'dashboard-portfolio'
  | 'login'
  | 'signup'

function getRoute(pathname: string): RouteName {
  const normalized = pathname.replace(/\/+$/, '') || '/'

  if (normalized === '/dashboard') return 'dashboard'
  if (normalized === '/dashboard/schedule') return 'dashboard-schedule'
  if (normalized === '/dashboard/profile') return 'dashboard-profile'
  if (normalized === '/dashboard/inquiries') return 'dashboard-inquiries'
  if (normalized === '/dashboard/favorites') return 'dashboard-favorites'
  if (normalized === '/dashboard/posts') return 'dashboard-posts'
  if (normalized === '/dashboard/portfolio') return 'dashboard-portfolio'
  if (normalized === '/login') return 'login'
  if (normalized === '/signup') return 'signup'
  return 'home'
}

function App() {
  const [route, setRoute] = useState<RouteName>(() => getRoute(window.location.pathname))

  useEffect(() => {
    const handlePopState = () => setRoute(getRoute(window.location.pathname))

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  if (route === 'dashboard') return <DashboardPage />
  if (route === 'dashboard-schedule') return <SchedulePage />
  if (route === 'dashboard-profile') return <ProfilePage />
  if (route === 'dashboard-inquiries') return <InquiriesPage />
  if (route === 'dashboard-favorites')
    return (
      <SectionPlaceholderPage
        title="찜 목록"
        description="찜 목록 페이지는 아직 백엔드 없이 자리만 잡아둔 상태예요. 나중에 과정 리스트나 비교 기능과 이어붙이면 됩니다."
      />
    )
  if (route === 'dashboard-posts')
    return (
      <SectionPlaceholderPage
        title="내가 쓴 글"
        description="내가 쓴 글 페이지는 현재 목업 상태입니다. 게시물 목록이 연결되면 같은 카드 스타일로 확장할 수 있어요."
      />
    )
  if (route === 'dashboard-portfolio')
    return (
      <SectionPlaceholderPage
        title="AI 포트폴리오"
        description="AI 포트폴리오 페이지는 현재 자리표시자 상태입니다. 추후 업로드/편집 UI를 이 자리에 이어붙이면 됩니다."
      />
    )
  if (route === 'login') return <LoginPage />
  if (route === 'signup') return <SignupPage />
  return <HomePage />
}

export default App

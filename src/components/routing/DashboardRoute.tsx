import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isAuthenticated } from '../../services/auth'

/** 대시보드 전용 라우트 — 비로그인 시 로그인 화면으로 이동 */
export default function DashboardRoute() {
  const location = useLocation()

  if (!isAuthenticated()) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`)
    return <Navigate to={`/login?redirect=${redirect}`} replace />
  }

  return <Outlet />
}

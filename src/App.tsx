import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/dashboard/DashboardPage'
import SchedulePage from './pages/dashboard/SchedulePage'
import ProfilePage from './pages/dashboard/ProfilePage'
import InquiriesPage from './pages/dashboard/InquiriesPage'
import SectionPlaceholderPage from './pages/dashboard/SectionPlaceholderPage'
import AiPortfolioPage from './pages/dashboard/AiPortfolioPage'
import LoginPage from './pages/auth/desktop/LoginPage'
import SignupPage from './pages/auth/desktop/SignupPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/schedule" element={<SchedulePage />} />
        <Route path="/dashboard/profile" element={<ProfilePage />} />
        <Route path="/dashboard/inquiries" element={<InquiriesPage />} />
        <Route
          path="/dashboard/favorites"
          element={
            <SectionPlaceholderPage
              title="찜 목록"
              description="찜 목록 페이지는 아직 백엔드 없이 자리만 잡아둔 상태예요."
            />
          }
        />
        <Route
          path="/dashboard/posts"
          element={
            <SectionPlaceholderPage
              title="내가 쓴 글"
              description="내가 쓴 글 페이지는 현재 목업 상태입니다."
            />
          }
        />
        <Route path="/dashboard/portfolio" element={<AiPortfolioPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

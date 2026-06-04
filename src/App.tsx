import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.tsx'
import LoginPage from './pages/auth/desktop/LoginPage.tsx'
import SignupPage from './pages/auth/desktop/SignupPage.tsx'
import CourseSearchPage from './pages/course/desktop/CourseSearchPage.tsx'
import CourseComparePage from './pages/course/desktop/CourseComparePage.tsx'
import CourseDetailPage from './pages/course/desktop/CourseDetailPage.tsx'
import DashboardPage from './pages/dashboard/DashboardPage'
import SchedulePage from './pages/dashboard/SchedulePage'
import ProfilePage from './pages/dashboard/ProfilePage'
import InquiriesPage from './pages/dashboard/InquiriesPage'
import SectionPlaceholderPage from './pages/dashboard/SectionPlaceholderPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route path="/courses" element={<CourseSearchPage />} />
      <Route path="/courses/compare" element={<CourseComparePage />} />
      <Route path="/courses/:courseId" element={<CourseDetailPage />} />

      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard/schedule" element={<SchedulePage />} />
      <Route path="/dashboard/profile" element={<ProfilePage />} />
      <Route path="/dashboard/inquiries" element={<InquiriesPage />} />
      <Route
        path="/dashboard/favorites"
        element={
          <SectionPlaceholderPage
            title="찜 목록"
            description="찜 목록 페이지는 아직 백엔드 없이 자리만 잡아둔 상태예요. 나중에 과정 리스트나 비교 기능과 이어붙이면 됩니다."
          />
        }
      />
      <Route
        path="/dashboard/posts"
        element={
          <SectionPlaceholderPage
            title="내가 쓴 글"
            description="내가 쓴 글 페이지는 현재 목업 상태입니다. 게시물 목록이 연결되면 같은 카드 스타일로 확장할 수 있어요."
          />
        }
      />
      <Route
        path="/dashboard/portfolio"
        element={
          <SectionPlaceholderPage
            title="AI 포트폴리오"
            description="AI 포트폴리오 페이지는 현재 자리표시자 상태입니다. 추후 업로드/편집 UI를 이 자리에 이어붙이면 됩니다."
          />
        }
      />

      <Route path="/" element={<HomePage />} />
    </Routes>
  )
}

export default App

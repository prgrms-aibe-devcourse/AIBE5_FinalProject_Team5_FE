import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.tsx'
import LoginPage from './pages/auth/desktop/LoginPage.tsx'
import SignupPage from './pages/auth/desktop/SignupPage.tsx'
import CourseSearchPage from './pages/course/desktop/CourseSearchPage.tsx'
import CourseComparePage from './pages/course/desktop/CourseComparePage.tsx'
import CourseDetailPage from './pages/course/desktop/CourseDetailPage.tsx'

function App() {
  return (
    <Routes>
      {/* auth 관련 페이지 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* course — 과정 조회·상세 */}
      <Route path="/courses" element={<CourseSearchPage />} />
      <Route path="/courses/compare" element={<CourseComparePage />} />
      <Route path="/courses/:courseId" element={<CourseDetailPage />} />

      {/* home 관련 페이지 */}
      <Route path="/" element={<HomePage />} />

    </Routes>
  )
}

export default App

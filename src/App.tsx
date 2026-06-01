import { useEffect, useState } from 'react'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/desktop/LoginPage'
import SignupPage from './pages/auth/desktop/SignupPage'

function getRoute(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '') || '/'

  if (normalized === '/login') return 'login'
  if (normalized === '/signup') return 'signup'
  return 'home'
}

function App() {
  const [route, setRoute] = useState(() => getRoute(window.location.pathname))

  useEffect(() => {
    const handlePopState = () => setRoute(getRoute(window.location.pathname))

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  if (route === 'login') {
    return <LoginPage />
  }

  if (route === 'signup') {
    return <SignupPage />
  }

  return <HomePage />
}

export default App

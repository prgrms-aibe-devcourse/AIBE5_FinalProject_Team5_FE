import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'

export default function CommunityFormLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col font-pretendard">
      <Header fixed={false} />

      <main className="flex-1 px-4 pb-16 pt-6 sm:px-8 sm:pb-20 sm:pt-8 md:px-16 md:pt-10 lg:px-20">
        <div className="mx-auto w-full max-w-4xl">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  )
}


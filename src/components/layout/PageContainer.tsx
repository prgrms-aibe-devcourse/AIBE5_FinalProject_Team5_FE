import type { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  className?: string
}

/** 페이지 콘텐츠 max-width 컨테이너 */
export default function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-desktop-content px-6 md:px-12 ${className}`}>
      {children}
    </div>
  )
}

import type { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  className?: string
}

/** Header / Footer 와 동일 — tailwind.config.js max-w-desktop-content */
export default function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-desktop-content px-6 md:px-12 ${className}`}>
      {children}
    </div>
  )
}

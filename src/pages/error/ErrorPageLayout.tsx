import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'

export type ErrorPageAction = {
  label: string
  to?: string
  onClick?: () => void
  variant?: 'primary' | 'outline'
}

type ErrorPageLayoutProps = {
  statusCode: number
  title: string
  description: ReactNode
  actions: ErrorPageAction[]
}

const actionBaseClass =
  'inline-flex min-w-[9.5rem] items-center justify-center rounded-lg px-5 py-2.5 font-pretendard text-sm font-semibold transition-colors'

const actionVariants = {
  primary: `${actionBaseClass} bg-deepOceanNavy text-white hover:bg-waterlineBlue`,
  outline: `${actionBaseClass} border border-mistSkyBlue/70 bg-white/80 text-deepOceanNavy hover:border-waterlineBlue hover:bg-foamWhite/60`,
}

function ErrorPageActionButton({ label, to, onClick, variant = 'primary' }: ErrorPageAction) {
  const className = actionVariants[variant]

  if (to) {
    return (
      <Link to={to} className={className}>
        {label}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {label}
    </button>
  )
}

export default function ErrorPageLayout({
  statusCode,
  title,
  description,
  actions,
}: ErrorPageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col font-pretendard">
      <Header fixed={false} />

      <main className="flex min-h-[calc(100dvh-12rem)] flex-1 items-center justify-center px-6 py-24 md:min-h-[calc(100dvh-14rem)] md:px-12 md:py-32">
        <div className="relative w-full max-w-2xl md:max-w-3xl">
          <p
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[58%] select-none font-pretendard text-[11rem] font-bold leading-none text-waterlineBlue/[0.12] md:text-[14rem]"
            aria-hidden="true"
          >
            {statusCode}
          </p>

          <section className="glass-panel relative rounded-3xl px-8 py-14 text-center md:px-14 md:py-20 lg:px-16">
            <div className="relative mx-auto inline-flex flex-col items-center">
              <p
                className="font-pretendard text-[4.75rem] font-bold leading-none tabular-nums tracking-tight text-deepOceanNavy md:text-[6rem]"
                aria-hidden="true"
              >
                {statusCode}
              </p>
            </div>

            <div
              className="mx-auto mt-8 h-px w-20 bg-gradient-to-r from-transparent via-mistSkyBlue to-transparent"
              aria-hidden="true"
            />

            <h1 className="mt-8 font-pretendard text-2xl font-bold text-deepOceanNavy md:text-[1.75rem]">
              {title}
            </h1>
            <p className="mt-4 px-2 font-pretendard text-sm leading-relaxed text-secondary md:px-4 md:text-base">
              {description}
            </p>

            <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-center">
              {actions.map((action) => (
                <ErrorPageActionButton key={action.label} {...action} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

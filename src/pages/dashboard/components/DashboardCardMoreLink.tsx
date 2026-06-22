import { Link } from 'react-router-dom'

type DashboardCardMoreLinkProps = {
  to: string
  ariaLabel: string
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function DashboardCardMoreLink({ to, ariaLabel }: DashboardCardMoreLinkProps) {
  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-waterlineBlue transition-colors hover:bg-foamWhite hover:text-deepOceanNavy"
    >
      <ChevronRightIcon />
    </Link>
  )
}

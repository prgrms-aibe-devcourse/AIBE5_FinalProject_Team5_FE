import { Link, useLocation } from 'react-router-dom'
import { isAuthenticated } from '../../../services/auth'
import { communitySections, getCommunitySectionFromPath } from '../communitySections'

export default function CommunityWriteButton() {
  const { pathname } = useLocation()

  if (!isAuthenticated()) return null
  if (pathname.endsWith('/new')) return null

  const sectionKey = getCommunitySectionFromPath(pathname)
  if (!sectionKey) return null

  const section = communitySections[sectionKey]
  if (!('writePath' in section) || !('writeLabel' in section)) return null

  return (
    <Link
      to={section.writePath}
      className="inline-flex shrink-0 items-center justify-center gap-1 rounded-lg bg-waterlineBlue px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#005EB8] sm:gap-1.5 sm:px-3.5 sm:py-2.5 sm:text-sm"
    >
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 3.5v9M3.5 8h9"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
      {section.writeLabel}
    </Link>
  )
}

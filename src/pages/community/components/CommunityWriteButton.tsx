import { Link, useLocation } from 'react-router-dom'
import { communitySections, getCommunitySectionFromPath } from '../communitySections'

export default function CommunityWriteButton() {
  const { pathname } = useLocation()

  if (pathname.endsWith('/new')) return null

  const sectionKey = getCommunitySectionFromPath(pathname)
  if (!sectionKey) return null

  const section = communitySections[sectionKey]
  if (!('writePath' in section) || !('writeLabel' in section)) return null

  return (
    <Link
      to={section.writePath}
      className="inline-flex shrink-0 items-center gap-1.5 self-end rounded-lg bg-waterlineBlue px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#005EB8] sm:mb-3.5"
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

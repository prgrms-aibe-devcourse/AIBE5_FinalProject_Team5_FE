import { Link } from 'react-router-dom'
import type { CommunitySectionKey } from '../communitySections'
import { communitySections } from '../communitySections'

type CommunityDetailBreadcrumbProps = {
  section: CommunitySectionKey
}

export default function CommunityDetailBreadcrumb({ section }: CommunityDetailBreadcrumbProps) {
  const { label, listPath } = communitySections[section]

  return (
    <nav aria-label="breadcrumb" className="text-sm text-gray-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link to={listPath} className="transition-colors hover:text-blue-600">
            커뮤니티
          </Link>
        </li>
        <li aria-hidden="true">&gt;</li>
        <li>
          <Link to={listPath} className="transition-colors hover:text-blue-600">
            {label}
          </Link>
        </li>
        <li aria-hidden="true">&gt;</li>
        <li className="font-medium text-gray-900" aria-current="page">
          상세
        </li>
      </ol>
    </nav>
  )
}

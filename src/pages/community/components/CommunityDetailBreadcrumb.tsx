import { Link } from 'react-router-dom'
import type { CommunitySectionKey } from '../communitySections'
import { communitySections } from '../communitySections'

type CommunityDetailBreadcrumbProps = {
  section: CommunitySectionKey
}

// 커뮤니티 상세 페이지 브레드크럼 컴포넌트
export default function CommunityDetailBreadcrumb({ section }: CommunityDetailBreadcrumbProps) {
  const { label, listPath } = communitySections[section]

  return (
    <nav aria-label="breadcrumb" className="text-base text-secondary">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link to={listPath} className="transition-colors hover:text-waterlineBlue">
            커뮤니티
          </Link>
        </li>
        <li aria-hidden="true" className="text-softAquaBlue">
          &gt;
        </li>
        <li>
          <Link to={listPath} className="transition-colors hover:text-waterlineBlue">
            {label}
          </Link>
        </li>
        <li aria-hidden="true" className="text-softAquaBlue">
          &gt;
        </li>
        <li className="font-medium text-deepOceanNavy" aria-current="page">
          상세
        </li>
      </ol>
    </nav>
  )
}

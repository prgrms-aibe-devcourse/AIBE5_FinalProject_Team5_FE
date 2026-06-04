// 과정 비교 브레드크럼
import { Link } from 'react-router-dom'

export default function CourseCompareBreadcrumb() {
  return (
    <nav aria-label="breadcrumb" className="text-base text-secondary">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link to="/courses" className="transition-colors hover:text-waterlineBlue">
            과정 조회
          </Link>
        </li>
        <li aria-hidden="true" className="text-softAquaBlue">
          &gt;
        </li>
        <li className="font-medium text-deepOceanNavy" aria-current="page">
          과정 비교
        </li>
      </ol>
    </nav>
  )
}

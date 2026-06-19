import { Link } from 'react-router-dom'
import { formatCommunityDate } from '../../../utils/formatRequestedDate'
import type { RecentPost } from '../data/posts'
import DashboardCard from './DashboardCard'

function getPostPath(post: RecentPost) {
  return `/community/posts/${post.id}`
}

type DashboardRecentPostsCardProps = {
  posts: RecentPost[]
}

export default function DashboardRecentPostsCard({ posts }: DashboardRecentPostsCardProps) {
  return (
    <DashboardCard title="최근 내가 쓴 글">
      {posts.length > 0 ? (
        <ul>
          {posts.map((post, index) => (
            <li
              key={post.id}
              className={`py-4 ${index < posts.length - 1 ? 'border-b border-mistSkyBlue/25' : ''}`}
            >
              <Link to={getPostPath(post)} className="group block">
                <p className="line-clamp-2 font-pretendard text-sm font-semibold leading-snug text-deepOceanNavy transition-colors group-hover:text-waterlineBlue">
                  {post.title}
                </p>
                <p className="mt-1 font-pretendard text-xs text-secondary">
                  <time dateTime={post.createdAt}>{formatCommunityDate(post.createdAt)}</time>
                  <span className="mx-1.5 text-mistSkyBlue/80">·</span>
                  {post.board}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-6 text-center font-pretendard text-sm text-secondary">작성한 글이 없습니다.</p>
      )}
    </DashboardCard>
  )
}

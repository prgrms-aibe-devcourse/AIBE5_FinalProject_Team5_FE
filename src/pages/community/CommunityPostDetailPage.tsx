import { useParams } from 'react-router-dom'

export default function CommunityPostDetailPage() {
  const { postId } = useParams<{ postId: string }>()

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">게시글 ID: {postId}</p>
      <h2 className="mt-4 text-xl font-semibold text-gray-900">게시글 제목</h2>
      <div className="mt-2 flex gap-4 text-sm text-gray-600">
        <span>작성자</span>
        <span>작성일</span>
        <span>조회 0</span>
      </div>
      <div className="mt-8 min-h-48 text-gray-700">게시글 본문 영역</div>
    </article>
  )
}

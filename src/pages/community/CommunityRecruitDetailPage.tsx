import { useParams } from 'react-router-dom'

export default function CommunityRecruitDetailPage() {
  const { recruitId } = useParams<{ recruitId: string }>()

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">모집 ID: {recruitId}</p>
      <h2 className="mt-4 text-xl font-semibold text-gray-900">모집 제목</h2>
      <div className="mt-2 flex gap-4 text-sm text-gray-600">
        <span>회사명</span>
        <span>포지션</span>
        <span>등록일</span>
      </div>
      <div className="mt-8 min-h-48 text-gray-700">모집 상세 내용 영역</div>
    </article>
  )
}

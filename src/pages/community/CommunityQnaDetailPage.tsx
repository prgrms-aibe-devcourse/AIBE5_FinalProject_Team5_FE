import { useParams } from 'react-router-dom'

export default function CommunityQnaDetailPage() {
  const { qnaId } = useParams<{ qnaId: string }>()

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">Q&A ID: {qnaId}</p>
      <h2 className="mt-4 text-xl font-semibold text-gray-900">질문 제목</h2>
      <div className="mt-2 flex gap-4 text-sm text-gray-600">
        <span>작성자</span>
        <span>작성일</span>
        <span>답변 0</span>
      </div>
      <div className="mt-8 min-h-32 text-gray-700">질문 본문 영역</div>
      <section className="mt-8 border-t border-gray-200 pt-8">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">답변</h3>
        <div className="min-h-24 text-gray-500">답변 목록 영역</div>
      </section>
    </article>
  )
}

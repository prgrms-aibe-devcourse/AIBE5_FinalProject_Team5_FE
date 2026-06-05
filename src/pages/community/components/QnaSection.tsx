export default function QnaSection() {
  const questions = [
    { id: 1, title: '이 에러는 왜 발생하나요?', author: '사용자4', date: '2024-01-15', answers: 5, solved: true },
    { id: 2, title: '최적화 방법을 알려주세요', author: '사용자5', date: '2024-01-14', answers: 3, solved: false },
    { id: 3, title: '라이브러리 추천 부탁합니다', author: '사용자6', date: '2024-01-13', answers: 8, solved: true },
  ]

  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <div key={q.id} className="border-b border-gray-200 pb-4 hover:bg-gray-50 px-4 py-3 rounded cursor-pointer transition-colors">
          <div className="flex items-start gap-3 mb-2">
            <div className={`px-2 py-1 rounded text-xs font-semibold ${q.solved ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
              {q.solved ? '해결됨' : '미해결'}
            </div>
            <h3 className="font-semibold text-gray-900 flex-1">{q.title}</h3>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex gap-4">
              <span>{q.author}</span>
              <span>{q.date}</span>
            </div>
            <span>답변 {q.answers}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

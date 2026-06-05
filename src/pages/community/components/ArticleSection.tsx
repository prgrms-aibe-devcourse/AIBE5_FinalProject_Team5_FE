export default function ArticleSection() {
  const articles = [
    { id: 1, title: '프론트엔드 성능 최적화 가이드', author: '에디터1', date: '2024-01-15', readTime: '5분' },
    { id: 2, title: '취업 준비를 위한 포트폴리오 팁', author: '에디터2', date: '2024-01-14', readTime: '7분' },
    { id: 3, title: '팀 프로젝트 협업 노하우', author: '에디터3', date: '2024-01-13', readTime: '4분' },
  ]

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <div key={article.id} className="border-b border-gray-200 pb-4 hover:bg-gray-50 px-4 py-3 rounded cursor-pointer transition-colors">
          <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex gap-4">
              <span>{article.author}</span>
              <span>{article.date}</span>
            </div>
            <span>읽는 시간 {article.readTime}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

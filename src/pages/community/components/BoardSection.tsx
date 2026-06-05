export default function BoardSection() {
  const posts = [
    { id: 1, title: '개발 팁 공유합니다', author: '사용자1', date: '2024-01-15', views: 234 },
    { id: 2, title: '이 방법을 시도해보세요', author: '사용자2', date: '2024-01-14', views: 156 },
    { id: 3, title: '좋은 라이브러리를 찾았어요', author: '사용자3', date: '2024-01-13', views: 89 },
  ]

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="border-b border-gray-200 pb-4 hover:bg-gray-50 px-4 py-3 rounded cursor-pointer transition-colors">
          <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex gap-4">
              <span>{post.author}</span>
              <span>{post.date}</span>
            </div>
            <span>조회 {post.views}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

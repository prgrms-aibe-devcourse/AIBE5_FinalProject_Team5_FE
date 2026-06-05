export default function RecruitmentSection() {
  const recruitments = [
    { id: 1, title: 'React 개발자 모집합니다', company: '스타트업A', position: 'Frontend', date: '2024-01-15', applicants: 12 },
    { id: 2, title: 'Node.js 백엔드 팀원 찾습니다', company: '회사B', position: 'Backend', date: '2024-01-14', applicants: 8 },
    { id: 3, title: 'UI/UX 디자이너 모집 중', company: '디자인팀C', position: 'Design', date: '2024-01-13', applicants: 5 },
  ]

  return (
    <div className="space-y-4">
      {recruitments.map((item) => (
        <div key={item.id} className="border-b border-gray-200 pb-4 hover:bg-gray-50 px-4 py-3 rounded cursor-pointer transition-colors">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 flex-1">{item.title}</h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.position}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex gap-4">
              <span>{item.company}</span>
              <span>{item.date}</span>
            </div>
            <span>지원 {item.applicants}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

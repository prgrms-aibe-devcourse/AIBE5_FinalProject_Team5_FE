import DashboardShell from './components/DashboardShell'

type SectionPlaceholderPageProps = {
  title: string
  description: string
}

// 대시보드 미구현 섹션 플레이스홀더
export default function SectionPlaceholderPage({ title, description }: SectionPlaceholderPageProps) {
  return (
    <DashboardShell title={title}>
      <p className="font-pretendard text-sm leading-6 text-secondary">{description}</p>
    </DashboardShell>
  )
}

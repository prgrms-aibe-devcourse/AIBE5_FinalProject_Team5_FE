import DashboardShell from './components/DashboardShell'

type SectionPlaceholderPageProps = {
  title: string
  description: string
}

export default function SectionPlaceholderPage({ title, description }: SectionPlaceholderPageProps) {
  return (
    <DashboardShell title={title}>
      <section className="rounded-2xl border border-[#eef2f6] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <h2 className="text-lg font-bold text-[#151b24]">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-[#64748b]">{description}</p>
      </section>
    </DashboardShell>
  )
}

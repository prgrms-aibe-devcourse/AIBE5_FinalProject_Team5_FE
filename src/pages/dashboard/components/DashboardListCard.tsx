type DashboardListCardProps = {
  title: string
  items: string[]
}

export default function DashboardListCard({ title, items }: DashboardListCardProps) {
  return (
    <section className="rounded-2xl border border-[#eef2f6] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <h2 className="mb-5 text-lg font-bold text-[#151b24]">{title}</h2>

      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item}>
            <a href="#" className="text-sm font-semibold text-[#1f2937] underline decoration-[#1f2937] underline-offset-2 transition-colors hover:text-[#5484B7]">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

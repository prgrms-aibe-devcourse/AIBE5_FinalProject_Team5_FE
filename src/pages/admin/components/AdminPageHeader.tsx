type AdminPageHeaderProps = {
  title: string
  description?: string
  className?: string
}

export default function AdminPageHeader({
  title,
  description,
  className = 'mb-8',
}: AdminPageHeaderProps) {
  return (
    <header className={className}>
      <h1 className="font-pretendard text-2xl font-bold text-deepOceanNavy">{title}</h1>
      {description ? (
        <p className="mt-2 font-pretendard text-sm text-secondary">{description}</p>
      ) : null}
    </header>
  )
}

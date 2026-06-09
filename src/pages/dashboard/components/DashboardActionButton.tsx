type DashboardActionButtonProps = {
  label: string
  onClick?: () => void
  type?: 'button' | 'submit'
  form?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  className?: string
}

const variantClass: Record<NonNullable<DashboardActionButtonProps['variant']>, string> = {
  primary:
    'border-deepOceanNavy bg-deepOceanNavy text-white shadow-[0_8px_24px_rgba(30,58,95,0.35),0_2px_6px_rgba(30,58,95,0.18)] hover:border-waterlineBlue hover:bg-waterlineBlue hover:shadow-[0_12px_32px_rgba(84,132,183,0.40),0_4px_10px_rgba(84,132,183,0.22)] hover:-translate-y-px transition-all',
  secondary:
    'border-mistSkyBlue/60 bg-white text-secondary hover:border-waterlineBlue hover:bg-foamWhite/60 hover:text-deepOceanNavy',
  ghost:
    'border-mistSkyBlue/60 bg-white text-deepOceanNavy hover:border-waterlineBlue hover:bg-waterlineBlue hover:text-white hover:shadow-[0_2px_8px_rgba(84,132,183,0.22)]',
}

export default function DashboardActionButton({
  label,
  onClick,
  type = 'button',
  form,
  variant = 'primary',
  disabled = false,
  className = '',
}: DashboardActionButtonProps) {
  return (
    <button
      type={type}
      form={form}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded border px-5 py-2.5 font-pretendard text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${variantClass[variant]} ${className}`}
    >
      {label}
    </button>
  )
}

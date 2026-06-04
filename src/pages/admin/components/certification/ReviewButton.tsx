import AdminListActionButton from '../AdminListActionButton'

type ReviewButtonProps = {
  count: number
  onClick: () => void
}

export default function ReviewButton({ count, onClick }: ReviewButtonProps) {
  return <AdminListActionButton label="열람" count={count} onClick={onClick} />
}

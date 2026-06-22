import { useNavigate } from 'react-router-dom'
import ErrorPageLayout from './ErrorPageLayout'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <ErrorPageLayout
      statusCode={404}
      title="페이지를 찾을 수 없습니다"
      description="요청하신 주소가 변경되었거나 삭제되어 더 이상 접근할 수 없습니다. 주소를 다시 확인해 주세요."
      actions={[
        { label: '홈으로 이동', to: '/', variant: 'primary' },
        { label: '이전 페이지', onClick: () => navigate(-1), variant: 'outline' },
      ]}
    />
  )
}

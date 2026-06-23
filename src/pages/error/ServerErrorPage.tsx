import { useNavigate } from 'react-router-dom'
import ErrorPageLayout from './ErrorPageLayout'

export default function ServerErrorPage() {
  const navigate = useNavigate()

  return (
    <ErrorPageLayout
      statusCode={500}
      title="일시적인 오류가 발생했습니다"
      description="서버에서 문제가 발생했습니다. 잠시 후 다시 시도해 주세요. 문제가 계속되면 고객센터로 문의해 주세요."
      actions={[
        { label: '홈으로 이동', to: '/', variant: 'primary' },
        { label: '이전 페이지', onClick: () => navigate(-1), variant: 'outline' },
      ]}
    />
  )
}

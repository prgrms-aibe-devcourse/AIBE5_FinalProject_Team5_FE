import { useNavigate } from 'react-router-dom'
import ErrorPageLayout from './ErrorPageLayout'

export default function ForbiddenPage() {
  const navigate = useNavigate()

  return (
    <ErrorPageLayout
      statusCode={403}
      title="접근 권한이 없습니다"
      description="이 페이지는 로그인이 필요하거나, 계정에 접근 권한이 없습니다. 관리자에게 문의하거나 다른 메뉴를 이용해 주세요."
      actions={[
        { label: '홈으로 이동', to: '/', variant: 'primary' },
        { label: '이전 페이지', onClick: () => navigate(-1), variant: 'outline' },
      ]}
    />
  )
}

import { useParams } from 'react-router-dom'

/* components */
import { AuthWrapper } from 'components/templates'

export const MypageTop: React.FC = () => {
  const params = useParams()
  // eslint-disable-next-line no-console
  console.log(params.id)

  return (
    <>
      <AuthWrapper>マイページ</AuthWrapper>
    </>
  )
}

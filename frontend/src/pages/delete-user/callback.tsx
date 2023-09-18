/**
 * 退会時にAuth0のログアウト処理を入れないとログインしたままの状態になってしまう
 * 一旦コールバックを挟むことでLPでフラッシュメッセージを表示させる
 */
import { useNavigate } from 'react-router-dom'
/* components */
import { LoadingTpl } from 'components/templates'
import { useEffect } from 'react'

export const DeleteUserCallback: React.FC = () => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate('/', { state: { flashMessage: { type: 'success', message: '退会が完了しました。' } } })
  }, [navigate])

  return <LoadingTpl />
}

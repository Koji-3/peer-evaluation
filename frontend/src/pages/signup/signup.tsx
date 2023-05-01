import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'

/* components */
import { Button } from 'components/atoms'

/* lib, types */
import { post } from 'lib/axios'
import { User, DBUser } from 'types/types'

export const Signup: React.FC = () => {
  const { user: auth0User, getAccessTokenSilently } = useAuth0()
  const initialUserInput: User = {
    auth0_id: auth0User?.sub || '',
    name: '',
    profile: '',
    icon_url: '',
    is_deleted: false,
  }
  const [userInput, setUserInput] = useState<User>(initialUserInput)
  const navigate = useNavigate()

  const changeUserInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setUserInput({ ...userInput, [name]: value })
  }

  const registerUser = async (): Promise<void> => {
    const token = await getAccessTokenSilently()
    const res = await post<{ user: DBUser }, { user: User }>(`/user/signup/${auth0User?.sub}`, { user: userInput }, token)
    navigate(`/mypage/${res.user.key}`)
  }

  // TODO: バリデーション
  // TODO: アイコンをs3にアップロードする機能

  return (
    <>
      <input name="name" placeholder="名前" value={userInput.name} onChange={changeUserInput} />
      <Button onClick={registerUser}>登録</Button>
    </>
  )
}

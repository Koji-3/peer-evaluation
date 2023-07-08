import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'

/* components */
import { SignupTpl, Layout } from 'components/templates'

/* lib, types */
import { post } from 'lib/axios'
import { validateIcon } from 'lib/validate'
import { UserInput, DBUser } from 'types/types'

export const Signup: React.FC = () => {
  const { user: auth0User, getAccessTokenSilently } = useAuth0()
  const initialUserInput: UserInput = {
    name: '',
    profile: '',
    icon_url: '',
  }
  const [userInput, setUserInput] = useState<UserInput>(initialUserInput)
  const [iconFile, setIconFile] = useState<File>()
  const [iconObjectUrl, setIconObjectUrl] = useState<string>('')
  const [iconInputError, setIconInputError] = useState<string | null>(null)
  const navigate = useNavigate()

  const onChangeUserInput = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>): void => {
    const { name, value } = e.target
    setUserInput({ ...userInput, [name]: value })
  }

  const onChangeIconInput = (file: File): void => {
    const error = validateIcon(file)
    setIconInputError(error)
    if (!error) {
      setIconObjectUrl(URL.createObjectURL(file))
      // 後でs3にアップするためにセット
      setIconFile(file)
    }
  }

  const register = async (): Promise<void> => {
    // TODO: アイコンをs3にアップロードする機能
    console.log(iconFile)
    const token = await getAccessTokenSilently()
    const res = await post<{ user: DBUser }, { user: UserInput }>(`/user/signup/${auth0User?.sub}`, { user: userInput }, token)
    navigate(`/mypage/${res.user.key}`)
  }

  return (
    <Layout>
      <SignupTpl
        userInput={userInput}
        iconObjectUrl={iconObjectUrl}
        iconInputError={iconInputError}
        onChangeUserInput={onChangeUserInput}
        onChangeIconInput={onChangeIconInput}
        register={register}
      />
    </Layout>
  )
}
